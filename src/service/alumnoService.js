const Alumno = require("../models/alumnoModel");
const Profesor = require("../models/profesorModel");
const Materia = require("../models/materiaModel");
const Usuario = require("../models/usuarioModel");


const actualizarAlumno = async (id, actualizarDatos, next) => {
    try {
        const alumno = await Alumno.findById(id);
        if (!alumno) {
            const error = new Error("Alumno no encontrado");
            error.statusCode = 404;
            throw error;
        }

        const dniViejo = alumno.dni;

        // Actualizar solo nombre y dni
        if (actualizarDatos.nombre) alumno.nombre = actualizarDatos.nombre;
        if (actualizarDatos.dni) alumno.dni = actualizarDatos.dni;

        // Actualizar materias (notas y asistencias)
        if (Array.isArray(actualizarDatos.materias)) {
            alumno.materias = alumno.materias.map((materia) => {
                const materiaUpdate = actualizarDatos.materias.find(m => m.nombre === materia.nombre);
                if (!materiaUpdate) return materia;

                return {
                    ...materia,
                    notas: actualizarNotas(materia.notas, materiaUpdate.notas),
                    asistencias: actualizarAsistencias(materia.asistencias, materiaUpdate.asistencias, next),
                };
            });
        }

        await alumno.save();

        // Sincronizar cambios de nombre/dni en usuarios, materias y profesores
        await sincronizarAlumnoConColecciones(alumno, dniViejo, next);

        return alumno;
    } catch (err) {
        next(err);
    }
};


const actualizarNotas = (notasAlumnoSub = [], notasActualizadas = []) => {
    if (Array.isArray(notasActualizadas)) {
        notasAlumnoSub = notasActualizadas.reduce((acc, notaUpdate) => {
            const notaExistente = acc.find((n) => n.tipo === notaUpdate.tipo);

            if (notaExistente) {
                acc = acc.map(n =>
                    n.tipo === notaUpdate.tipo ? { ...n, nota: notaUpdate.nota } : n
                );
            } else {
                acc = [...acc, notaUpdate];
            }
            return acc;
        }, notasAlumnoSub);
    }
    return notasAlumnoSub;

};

//se usan valores por defecto [] para evitar errores si algún parámetro viene undefined

const actualizarAsistencias = (asistenciasAlumno = [], asistenciasActualizadas = []) => {
    if (Array.isArray(asistenciasActualizadas)) {
        //reduce se usa para iterer cada elemento del array y mantener el acumulador donde de acumula el resultado final
        // acc -> empieza siendo las asistencias actuales (asistenciasAlumnoSub) y se va modificando con cada iteración.
        //asisUpdate -> cada asistencia que queremos aplicar.
        asistenciasAlumno = asistenciasActualizadas.reduce((acc, asisUpdate) => {
            const fechaUpdate = new Date(asisUpdate.fecha);

            if (isNaN(fechaUpdate)) {
                // Lanzar error atrapado por el middleware
                const error = new Error(`Fecha inválida en asistencia: "${asisUpdate.fecha}"`);
                error.statusCode = 422; //errores en la sementica
                throw error;
            }
            const fechaISO = fechaUpdate.toISOString().slice(0, 10);

            const existe = acc.some(a => {
                const fechaExistenteISO = new Date(a.fecha).toISOString().slice(0, 10);
                return fechaExistenteISO === fechaISO;
            });

            if (existe) {
                return acc.map(a => {
                    const fechaExistenteISO = new Date(a.fecha).toISOString().slice(0, 10);
                    return fechaExistenteISO === fechaISO
                        ? { ...a, fecha: fechaUpdate, presente: asisUpdate.presente }
                        : a;
                });
            } else {
                return [...acc, { fecha: fechaUpdate, presente: asisUpdate.presente }];
            }
        }, asistenciasAlumno);
    }
    return asistenciasAlumno;
};

const sincronizarAlumnoConColecciones = async (alumno, dniViejo, next) => {
    const { dni } = alumno;

    await actualizarDniEnUsuarios(dniViejo, dni);
    await actualizarProfesores(alumno, dniViejo, next);
    await actualizarAlumnoEnMaterias (dniViejo, alumno.nombre, alumno.dni);

};

const actualizarAlumnoEnMaterias = async (dniViejo, nombreNuevo, dniNuevo) => {
    await Materia.updateMany(
        { "alumnos.dni": dniViejo }, // Todas las materias donde está este alumno
        {
            $set: {
                "alumnos.$[alumno].nombre": nombreNuevo,
                "alumnos.$[alumno].dni": dniNuevo
            }
        },
        {
            arrayFilters: [{ "alumno.dni": dniViejo }], // Solo actualiza el alumno correcto
        }
    );
};




const actualizarDniEnUsuarios = async (dniViejo, dniNuevo) => {
    await Usuario.updateMany(
        { hijos: dniViejo },
        { $set: { "hijos.$": dniNuevo } }
    );
};

// 🔸 Actualizar datos en profesores
const actualizarProfesores = async (alumno, dniViejo, next) => {
    const { nombre, dni, materias } = alumno;

    try {
        // Buscar profesores donde el alumno está registrado
        const profesores = await Profesor.find({ "materiasDictadas.alumnos.dni": dniViejo });

        await Promise.all(
            profesores.map(async (prof) => {

                let huboCambios = false;

                const materiasNuevas = prof.materiasDictadas.map((materiaDictada) => {
                    const materiaAlumno = materias.find((m) => m.nombre === materiaDictada.nombre);
                    if (!materiaAlumno) {
                        console.warn(`⚠️ No se encontró la materia ${materiaDictada.nombre} para el alumno ${nombre}`);
                        return materiaDictada;
                    }

                    // 🔹 Actualizar solo el alumno correspondiente
                    const alumnosActualizados = materiaDictada.alumnos.map((alumnoSub) =>
                        alumnoSub.dni === dniViejo
                            ? {
                                ...alumnoSub,
                                nombre,
                                dni,
                                notas: actualizarNotas(alumnoSub.notas, materiaAlumno.notas),
                                asistencias: actualizarAsistencias(alumnoSub.asistencias, materiaAlumno.asistencias, next),
                            }
                            : alumnoSub
                    );

                    // Chequear si hubo cambios
                    if (JSON.stringify(alumnosActualizados) !== JSON.stringify(materiaDictada.alumnos)) {
                        huboCambios = true;
                    }

                    // 🔹 No modificar profesor
                    return { ...materiaDictada, alumnos: alumnosActualizados };
                });

                if (huboCambios) {
                    prof.materiasDictadas = materiasNuevas;
                    prof.markModified("materiasDictadas");
                    await prof.save({ validateBeforeSave: false });
                    console.log(`✅ Profesor ${prof.nombre || prof._id} sincronizado.`);
                }
            })
        );
    } catch (err) {
        next(err); // pasa cualquier error al middleware
    }
};

module.exports = { actualizarAlumno };

