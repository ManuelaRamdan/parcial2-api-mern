const Alumno = require("../models/alumnoModel");
const Profesor = require("../models/profesorModel");
const Curso = require("../models/cursoModel");
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
        const cursosDB = await Curso.find({
            _id: { $in: actualizarDatos.materias.map(m => m.idCurso) }
        });

        const cursoInvalido = actualizarDatos.materias.find(
            m => !cursosDB.some(dbC => dbC._id.toString() === m.idCurso)
        );
        if (cursoInvalido) {
            const error = new Error(`El curso con ID ${cursoInvalido.idCurso} no existe`);
            error.statusCode = 404;
            throw error;
        }

        const noInscripto = actualizarDatos.materias.find(
            m => !alumno.materias.some(am => am.idCurso.toString() === m.idCurso)
        );
        if (noInscripto) {
            const error = new Error(
                `El alumno no está inscripto en el curso con ID ${noInscripto.idCurso}`
            );
            error.statusCode = 422;
            throw error;
        }

        alumno.materias = alumno.materias.map(materia => {
            const materiaUpdate = actualizarDatos.materias.find(
                mu => mu.idCurso.toString() === materia.idCurso.toString()
            );

            return materiaUpdate
                ? {
                    ...materia,
                    notas: actualizarNotas(materia.notas ?? [], materiaUpdate.notas ?? []),
                    asistencias: actualizarAsistencias(
                        materia.asistencias ?? [],
                        materiaUpdate.asistencias ?? []
                    ),
                }
                : materia;
        });
    }


    await alumno.save();

    await sincronizarAlumnoConColecciones(alumno, dniViejo);

    return alumno;
};


const actualizarNotas = (notasActuales, notasNuevas) => {
    if (!Array.isArray(notasNuevas)) return notasActuales;

    // Validación mínima sin loops:
    const esValido =
        notasNuevas.length === 0 ||                      // permitir lista vacía
        JSON.stringify(notasNuevas).match(/"tipo":|"nota":/) !== null;

    if (!esValido) {
        const error = new Error("Formato inválido en notas");
        error.statusCode = 422;
        throw error;
    }

    // ✔ REEMPLAZO TOTAL (permite borrar, agregar, modificar)
    return notasNuevas;
};


const actualizarAsistencias = (asisActuales, asisNuevas) => {
    if (!Array.isArray(asisNuevas)) return asisActuales;

    // Validación mínima sin loops:
    const esValido =
        asisNuevas.length === 0 ||
        JSON.stringify(asisNuevas).match(/"fecha":|"presente":/) !== null;

    if (!esValido) {
        const error = new Error("Formato inválido en asistencias");
        error.statusCode = 422;
        throw error;
    }

    // ✔ Convertir fechas SIN loops
    const stringData = JSON.stringify(asisNuevas);
    const reemplazado = stringData.replace(
        /"fecha"\s*:\s*"([^"]+)"/g,
        (_, fecha) => `"fecha":"${new Date(fecha).toISOString()}"`
    );
    const asistenciasFinal = JSON.parse(reemplazado);

    // ✔ REEMPLAZO TOTAL
    return asistenciasFinal;
};


const sincronizarAlumnoConColecciones = async (alumno, dniViejo) => {

    await actualizarDniEnUsuarios(dniViejo, alumno);
    await actualizarProfesores(alumno, dniViejo);
    await actualizarAlumnoEnCursos(dniViejo, alumno);

};

const actualizarAlumnoEnCursos = async (dniViejo, alumno) => {
    await Curso.updateMany(
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
    const { nombre, dni, activo } = alumno;
    let huboCambios = false;

    const materiasActualizadas = prof.materiasDictadas.map(materiaDictada => {
        const materiaAlumno = alumno.materias.find(
            m => m.idCurso?.toString() === materiaDictada.idCurso?.toString()
        );

        let nuevosAlumnos = materiaDictada.alumnos;

        if (materiaAlumno) {
            nuevosAlumnos = materiaDictada.alumnos.map(alumnoSub => {
                if (alumnoSub.dni === dniViejo) {
                    const nuevasNotas = actualizarNotas(alumnoSub.notas ?? [], materiaAlumno.notas ?? []);
                    const nuevasAsistencias = actualizarAsistencias(alumnoSub.asistencias ?? [], materiaAlumno.asistencias ?? []);

                    const cambio =
                        alumnoSub.nombre !== nombre ||
                        alumnoSub.dni !== dni ||
                        alumnoSub.activo !== activo ||
                        !_.isEqual(alumnoSub.notas, nuevasNotas) ||
                        !_.isEqual(alumnoSub.asistencias, nuevasAsistencias);

                    if (cambio) huboCambios = true;

                    return {
                        ...alumnoSub,
                        nombre,
                        dni,
                        activo,
                        notas: nuevasNotas,
                        asistencias: nuevasAsistencias,
                    };
                }

                return alumnoSub;
            });
        }

        return { ...materiaDictada, alumnos: nuevosAlumnos };
    });

    if (huboCambios) {
        prof.materiasDictadas = materiasActualizadas;
        await prof.save();
    }
};




const agregarAlumnoEnCursos = async (alumno) => {
    if (alumno && Array.isArray(alumno.materias)) {
        await Promise.all(
            alumno.materias.map(async (materiaAlumno) => {
                await Curso.updateOne(
                    { _id: materiaAlumno.idCurso }, // ahora busca por el id del curso
                    {
                        $addToSet: {
                            alumnos: {
                                nombre: alumno.nombre,
                                dni: alumno.dni,
                                activo: alumno.activo ?? true,
                                notas: materiaAlumno.notas ?? [],
                                asistencias: materiaAlumno.asistencias ?? [],
                            },
                        },
                    }
                );
            })
        );
    }
};


const agregarAlumnoEnProfesores = async (alumno) => {
    if (alumno && Array.isArray(alumno.materias)) {
        const idsCursosAlumno = alumno.materias.map(m => m.idCurso);

        const profesores = await Profesor.find({
            "materiasDictadas.idCurso": { $in: idsCursosAlumno }
        });

        await Promise.all(
            profesores.map(async (prof) => {
                let huboCambios = false;

                const nuevasMaterias = prof.materiasDictadas.map(materiaDictada => {
                    // Buscar la materia del alumno que coincide con la materia del profesor
                    const materiaAlumno = alumno.materias.find(
                        m => String(m.idCurso) === String(materiaDictada.idCurso)
                    );

                    const yaExiste = materiaDictada.alumnos.some(a => a.dni === alumno.dni);

                    // Si no hay materiaAlumno, no se agregan notas ni asistencias
                    const nuevosAlumnos = yaExiste
                        ? materiaDictada.alumnos
                        : [
                            ...materiaDictada.alumnos,
                            {
                                nombre: alumno.nombre,
                                dni: alumno.dni,
                                activo: alumno.activo ?? true,
                                notas: materiaAlumno?.notas ?? [],
                                asistencias: materiaAlumno?.asistencias ?? [],
                            },
                        ];

                    if (!yaExiste) huboCambios = true;

                    return { ...materiaDictada, alumnos: nuevosAlumnos };
                });

                if (huboCambios) {
                    prof.materiasDictadas = nuevasMaterias;
                    await prof.save();
                }
            })
        );
    }
};



module.exports = { actualizarAlumno, agregarAlumnoEnCursos, agregarAlumnoEnProfesores };

