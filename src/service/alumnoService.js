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

        // Detectar si es profesor (solo actualizar notas/asistencias)
        const esProfesor = actualizarDatos.materias?.some(m => m.profesor);
        
        // Admin: actualizar nombre y dni
        if (!esProfesor) {
            if (actualizarDatos.dni && actualizarDatos.dni !== dniViejo) {
                const alumnoExistente = await Alumno.findOne({ dni: actualizarDatos.dni });
                if (alumnoExistente) {
                    const error = new Error(`Ya existe un alumno con el DNI ${actualizarDatos.dni}.`);
                    error.statusCode = 409;
                    throw error;
                }
                alumno.dni = actualizarDatos.dni;
            }

            // Actualizar solo nombre y dni
            if (actualizarDatos.nombre) alumno.nombre = actualizarDatos.nombre;
        }

        // Actualizar materias (notas y asistencias)
        if (Array.isArray(actualizarDatos.materias)) {
            alumno.materias = alumno.materias.map((materia) => {
                // Encontrar la materia que se quiere actualizar
                const materiaUpdate = actualizarDatos.materias.find((m) => {
                    if (esProfesor) {
                        // Para profesor: validar _id, curso y profesor
                        return (
                        m._id.toString() === materia._id.toString() &&
                        m.curso === materia.curso &&
                        m.profesor === materia.profesor.nombre
                        );
                    } else {
                        // Para admin: coincidir por nombre
                        return m.nombre === materia.nombre;
                    }
                });

                if (!materiaUpdate) return materia;

                // Actualizar notas y asistencias según corresponda
                return {
                ...materia,
                notas: actualizarNotas(materia.notas, materiaUpdate.notas),
                asistencias: actualizarAsistencias(materia.asistencias, materiaUpdate.asistencias, next),
                };
            });
        }

        await alumno.save();

        // Sincronizar cambios solo si es admin
        // Sincronizar cambios de nombre/dni en usuarios, materias y profesores
        if (!esProfesor) await sincronizarAlumnoConColecciones(alumno, dniViejo, next);

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
    await actualizarAlumnoEnMaterias(dniViejo, alumno.nombre, alumno.dni);

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

// Actualizar datos en profesores
const actualizarProfesores = async (alumno, dniViejo, next) => {
    const { nombre, dni, materias } = alumno;

    try {
        //obtener todos los documentos Profesor cuyo array materiasDictadas contenga un subdocumento alumnos con dni === dniViejo
        const profesores = await Profesor.find({ "materiasDictadas.alumnos.dni": dniViejo });

        //usa Promise.all para actualizar múltiples profesores en paralelo.
        // promise para ejecutar varias operaciones asincronicas una por profesor y esperar a que todas terminen para seguir
        await Promise.all(
            profesores.map(prof => procesarProfesor(prof, alumno, dniViejo, next))
        );

        // profesores es un array de todos los profesores donde aparece ese alumno.
        // con map, se va profe por profesor y se ejecuta la funcion procesarProfesor que devuelve una promesa que resuelve cuando el await prof.save() termina o lanza un error.
        // Termina map y te queda un array de promesas pendientes
        // promise. all recibe ese array y espera que se resulvan las promesas pendientes.
        // cuando termina devuelve el array con los resultados que son underfined pq procesarProfesor no devuelve nada, es solo para saber que no hubo error
        // si hay un error se lo lanza al middelware de errores

        // sin promise.all, llega el primer prof.save y termina sin pasar por el siguiente promesa, pero con promise.all todos los prof.save se hacen el paralelo no secuencial 

    } catch (err) {
        next(err); // pasa cualquier error al middleware
    }
};

const procesarProfesor = async (prof, alumno, dniViejo, next) => {
    const { nombre, dni, materias } = alumno;
    let huboCambios = false;

    //prof.materiasDictadas es un array con todas las materias que dicta ese profesor
    //map devuelve un nuevo array con los resultados de la funcion y lo guarda en materias nuevas 
    const materiasNuevas = prof.materiasDictadas.map(materiaDictada => {
        //busca el primer elemento que cumpla esa condicion
        const materiaAlumno = materias.find(m => m.nombre === materiaDictada.nombre);

        // con ... copia todas las propiedades de materiaDictada en materiaActualizada permitiendo modificar la copia 
        let materiaActualizada = { ...materiaDictada };

        //si el alumno cursa ese materia 
        if (materiaAlumno) {
            // materiaDictada.alumnos es el array de alumnos que tiene esta materia en el profesor
            // map -> recorre cada alumno (alumnoSub) y genera un nuevo array (nuevosAlumnos).
            const nuevosAlumnos = materiaDictada.alumnos.map(alumnoSub => {

                // con ... copia todas las propiedades de alumnoSub en alumnoActualizado permitiendo modificar la copia 
                let alumnoActualizado = { ...alumnoSub };

                const esElAlumno = alumnoSub.dni === dniViejo;
                if (esElAlumno) {

                    const nuevasNotas = actualizarNotas(alumnoSub.notas, materiaAlumno.notas);
                    const nuevasAsistencias = actualizarAsistencias(alumnoSub.asistencias, materiaAlumno.asistencias, next);

                    //_.isEqual es una función de Lodash -> libreria de js
                    //comparar dos valores en profundidad y devuelve true si son iguales, por eso tiene !
                    //
                    //cambio -> indica si hay algo que actualizar en el alumno
                    const cambio =
                        alumnoSub.nombre !== nombre ||
                        alumnoSub.dni !== dni ||
                        !_.isEqual(alumnoSub.notas, nuevasNotas) ||
                        !_.isEqual(alumnoSub.asistencias, nuevasAsistencias);

                    if (cambio) {
                        huboCambios = true;

                        // alumnoActualizado es un nuevo objeto que mantiene todo lo que no cambió y actualiza lo que cambió.

                        alumnoActualizado = {
                            // copiamos las propiedades de alumnoSub al nuevo objeto y despues las sobre escribimos con las nuevas cosas
                            ...alumnoSub,
                            nombre,
                            dni,
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
        // reemplazamos el array original (prof.materiasDictadas) por el nuevo
        prof.materiasDictadas = materiasNuevas;
        // se usa markModified pq cuando se hace cambios en algo anidados mongoose no los guarda, pero pobiendo eso sabe que os tiene que guardar cuando se haga el prof.save()
        prof.markModified("materiasDictadas");
        await prof.save();
    }
};




module.exports = { actualizarAlumno };

