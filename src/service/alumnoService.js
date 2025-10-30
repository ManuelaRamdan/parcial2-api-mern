const Alumno = require("../models/alumnoModel");
const Profesor = require("../models/profesorModel");
const Materia = require("../models/materiaModel");
const Usuario = require("../models/usuarioModel");
const _ = require("lodash");

const actualizarAlumno = async (id, actualizarDatos) => {

    const alumno = await Alumno.findOne({ _id: id, activo: true });
    if (!alumno) {
        const error = new Error("Alumno no encontrado");
        error.statusCode = 404;
        throw error;
    }

    const dniViejo = alumno.dni;

    if (actualizarDatos.dni !== undefined) {
        if (Number(actualizarDatos.dni) <= 0) {
            const error = new Error("El DNI debe ser mayor que 0");
            error.statusCode = 422;
            throw error;
        }
        const alumnoExistente = await Alumno.findOne({ dni: actualizarDatos.dni, _id: { $ne: id } });
        if (alumnoExistente) {
            const error = new Error(`Ya existe un alumno con el DNI ${actualizarDatos.dni}`);
            error.statusCode = 409;
            throw error;
        }
        alumno.dni = actualizarDatos.dni;
    }


    if (actualizarDatos.nombre !== undefined) alumno.nombre = actualizarDatos.nombre;


    if (actualizarDatos.activo !== undefined) alumno.activo = actualizarDatos.activo;

    if (Array.isArray(actualizarDatos.materias)) {
        const materiasDB = await Materia.find({
            $or: actualizarDatos.materias.map(m => ({ nombre: m.nombre, curso: m.curso }))
        });

        // Validaciones usando programación funcional
        const materiaInvalida = actualizarDatos.materias.find(
            m => !materiasDB.some(dbM => dbM.nombre === m.nombre && dbM.curso === m.curso)
        );
        if (materiaInvalida) {
            const error = new Error(`La materia ${materiaInvalida.nombre} curso ${materiaInvalida.curso} no existe`);
            error.statusCode = 404;
            throw error;
        }

        const noInscripto = actualizarDatos.materias.find(
            m => !alumno.materias.some(am => am.nombre === m.nombre && am.curso === m.curso)
        );
        if (noInscripto) {
            const error = new Error(`El alumno no está inscripto en la materia ${noInscripto.nombre} curso ${noInscripto.curso}`);
            error.statusCode = 422;
            throw error;
        }

        alumno.materias = alumno.materias.map(materia => ({
            ...materia,
            notas: actualizarNotas(materia.notas, materiaUpdate.notas),
            asistencias: actualizarAsistencias(materia.asistencias, materiaUpdate.asistencias),
        }));

    }


    await alumno.save();

    await sincronizarAlumnoConColecciones(alumno, dniViejo);
    return alumno;

};


const actualizarNotas = (notasAlumno = [], notasActualizadas = []) => {
    if (Array.isArray(notasActualizadas)) {
        notasAlumno = notasActualizadas.reduce((acc, notaUpdate) => {

            const existe = acc.some(n => n.tipo === notaUpdate.tipo);

            let nuevasNotas;

            if (existe) {
                nuevasNotas = acc.map(n =>
                    n.tipo === notaUpdate.tipo
                        ? { ...n, tipo: notaUpdate.tipo, nota: notaUpdate.nota }
                        : n
                );
            } else {
                nuevasNotas = [...acc, { tipo: notaUpdate.tipo, nota: notaUpdate.nota }];
            }

            return nuevasNotas;
        }, [...notasAlumno]);
    }

    return notasAlumno;
};



const actualizarAsistencias = (asistenciasAlumno = [], asistenciasActualizadas = []) => {
    if (Array.isArray(asistenciasActualizadas)) {

        asistenciasAlumno = asistenciasActualizadas.reduce((acc, asisUpdate) => {
            const fechaUpdate = new Date(asisUpdate.fecha);

            if (isNaN(fechaUpdate)) {
                const error = new Error(`Fecha inválida en asistencia: "${asisUpdate.fecha}"`);
                error.statusCode = 422;
                throw error;
            }
            const fechaISO = fechaUpdate.toISOString().slice(0, 10);

            const existe = acc.some(a => {
                const fechaExistenteISO = new Date(a.fecha).toISOString().slice(0, 10);
                return fechaExistenteISO === fechaISO;
            });

            let nuevasAsistencias;

            if (existe) {
                nuevasAsistencias = acc.map(a => {
                    const fechaExistenteISO = new Date(a.fecha).toISOString().slice(0, 10);
                    return fechaExistenteISO === fechaISO
                        ? { ...a, fecha: fechaUpdate, presente: asisUpdate.presente }
                        : a;
                });
            } else {
                nuevasAsistencias = [...acc, { fecha: fechaUpdate, presente: asisUpdate.presente }];
            }
        }, asistenciasAlumno);
    }
    return asistenciasAlumno;
};

const sincronizarAlumnoConColecciones = async (alumno, dniViejo) => {

    await actualizarDniEnUsuarios(dniViejo, alumno);
    await actualizarProfesores(alumno, dniViejo);
    await actualizarAlumnoEnMaterias(dniViejo, alumno);

};

const actualizarAlumnoEnMaterias = async (dniViejo, alumno) => {
    await Materia.updateMany(
        { "alumnos.dni": dniViejo },
        {
            $set: {
                "alumnos.$[a].nombre": alumno.nombre,
                "alumnos.$[a].dni": alumno.dni,
                "alumnos.$[a].activo": alumno.activo,
            },
        },
        {
            arrayFilters: [{ "a.dni": dniViejo }]
        }
    );
};




const actualizarDniEnUsuarios = async (dniViejo, alumno) => {
    await Usuario.updateMany(
        { "hijos.dni": dniViejo },
        {
            $set: {
                "hijos.$.dni": alumno.dni,
                "hijos.$.activo": alumno.activo
            }
        }
    );
};



const actualizarProfesores = async (alumno, dniViejo) => {
    const { nombre, dni, materias, activo } = alumno;

    const profesores = await Profesor.find({ "materiasDictadas.alumnos.dni": dniViejo });

    await Promise.all(
        profesores.map(prof => procesarProfesor(prof, alumno, dniViejo))
    );

};

const procesarProfesor = async (prof, alumno, dniViejo) => {
    const { nombre, dni, materias, activo } = alumno;
    let huboCambios = false;

    const materiasNuevas = prof.materiasDictadas.map(materiaDictada => {
        const materiaAlumno = materias.find(
            m => m.nombre === materiaDictada.nombre && m.curso === materiaDictada.curso
        );

        let materiaActualizada = { ...materiaDictada };

        if (materiaAlumno) {

            const nuevosAlumnos = materiaDictada.alumnos.map(alumnoSub => {

                let alumnoActualizado = { ...alumnoSub };

                if (alumnoSub.dni === dniViejo) {

                    const nuevasNotas = actualizarNotas(alumnoSub.notas, materiaAlumno.notas);
                    const nuevasAsistencias = actualizarAsistencias(alumnoSub.asistencias, materiaAlumno.asistencias);

                    const cambio =
                        alumnoSub.nombre !== nombre ||
                        alumnoSub.dni !== dni ||
                        alumnoSub.activo !== activo ||
                        !_.isEqual(alumnoSub.notas, nuevasNotas) ||
                        !_.isEqual(alumnoSub.asistencias, nuevasAsistencias);

                    if (cambio) {
                        huboCambios = true;


                        alumnoActualizado = {
                            ...alumnoSub,
                            nombre,
                            dni,
                            activo,
                            notas: nuevasNotas,
                            asistencias: nuevasAsistencias,
                        };
                    }
                }

                return alumnoActualizado;
            });

            materiaActualizada = { ...materiaDictada, alumnos: nuevosAlumnos };
        }

        return materiaActualizada;
    });

    if (huboCambios) {
        prof.materiasDictadas = materiasNuevas;
        prof.markModified("materiasDictadas");
        await prof.save();
    }
};

const agregarAlumnoEnMaterias = async (alumno) => {
    if (alumno && Array.isArray(alumno.materias)) {
        await Promise.all(
            alumno.materias.map(async (materiaAlumno) => {
                const result = await Materia.updateOne(
                    { nombre: materiaAlumno.nombre, curso: materiaAlumno.curso },
                    {
                        $addToSet: {
                            alumnos: {
                                nombre: alumno.nombre,
                                dni: alumno.dni,
                                activo: alumno.activo ?? true,
                            }
                        }
                    }
                );
            })
        );
    }

};

const agregarAlumnoEnProfesores = async (alumno) => {
    if (alumno && Array.isArray(alumno.materias)) {
        const materiasAlumno = alumno.materias.map(m => m.nombre);

        const profesores = await Profesor.find({
            "materiasDictadas.nombre": { $in: materiasAlumno },
        });

        await Promise.all(
            profesores.map(async (prof) => {
                let huboCambios = false;

                const nuevasMaterias = prof.materiasDictadas.map(materiaDictada => {
                    const coincide = alumno.materias.some(
                        m => m.nombre === materiaDictada.nombre && m.curso === materiaDictada.curso
                    );
                    const yaExiste = materiaDictada.alumnos.some(a => a.dni === alumno.dni);

                    const alumnosActualizados = (coincide && !yaExiste)
                        ? [...materiaDictada.alumnos, {
                            nombre: alumno.nombre,
                            dni: alumno.dni,
                            activo: alumno.activo ?? true,
                            notas: [],
                            asistencias: []
                        }]
                        : materiaDictada.alumnos;

                    if (coincide && !yaExiste) huboCambios = true;

                    return { ...materiaDictada, alumnos: alumnosActualizados };
                });

                if (huboCambios) {
                    prof.materiasDictadas = nuevasMaterias;
                    prof.markModified("materiasDictadas");
                    await prof.save();
                }
            })
        );
    }


};


module.exports = { actualizarAlumno, agregarAlumnoEnMaterias, agregarAlumnoEnProfesores };

