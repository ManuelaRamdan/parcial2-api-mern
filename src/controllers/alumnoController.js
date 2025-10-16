// src/controllers/usuarioController.js
const Alumno = require("../models/alumnoModel");
const Profesor = require("../models/profesorModel");
const Usuario = require("../models/usuarioModel");



const getAllAlumnos = async (req, res, next) => {
    try {
        const alumnos = await Alumno.find();
        res.json(alumnos);
    } catch (err) {
        //500 -> El servidor ha encontrado una situación que no sabe cómo manejar
        next(err);
    }
};

//404 -> El servidor no pudo encontrar el contenido solicitado

const getAlumnoById = async (req, res, next) => {
    try {
        const alumno = await Alumno.findById(req.params.id);
        if (!alumno) {
            const error = new Error("Alumno no encontrado");
            error.statusCode = 404;
            throw error;
        }

        res.json(alumno);


    } catch (err) {
        next(err);

    }
};


const createAlumno = async (req, res, next) => {
    try {
        const nuevoAlumno = new Alumno(req.body);
        await nuevoAlumno.save();
        //201 -> Petición exitosa. Se ha creado un nuevo recurso como resultado de ello
        res.status(201).json(nuevoAlumno);
    } catch (err) {
        //400 -> La solicitud no se pudo completar debido a un error del cliente
        const error = new Error("Error al crear un alumno, verifique los datos.");
        error.statusCode = 400;
        next(error);
    }
};

const updateAlumno = async (req, res, next) => {
    try {
        const { id } = req.params;
        const actualizarDatos = req.body;

        const alumno = await Alumno.findById(id);
        if (!alumno) {
            const error = new Error("Alumno no encontrado");
            error.statusCode = 404;
            throw next(error);
        }

        const dniViejo = alumno.dni;

        // Actualizar datos básicos
        if (actualizarDatos.nombre) alumno.nombre = actualizarDatos.nombre;
        if (actualizarDatos.curso) alumno.curso = actualizarDatos.curso;
        if (actualizarDatos.dni) alumno.dni = actualizarDatos.dni;

        // Actualizar materias
        if (Array.isArray(actualizarDatos.materias)) {
            alumno.materias = alumno.materias.map((materia) => {
                const materiaUpdate = actualizarDatos.materias.find(m => m.nombre === materia.nombre);
                if (!materiaUpdate) return materia; // no hay cambios en esta materia

                const notasActualizadas = actualizarNotas(materia.notas, materiaUpdate.notas);
                const asistenciasActualizadas = actualizarAsistencias(materia.asistencias, materiaUpdate.asistencias, next);

                return {
                    ...materia,
                    nombre: materiaUpdate.nuevoNombre || materia.nombre,
                    profesor: materiaUpdate.profesor || materia.profesor, // si hay cambio de profesor
                    notas: notasActualizadas,
                    asistencias: asistenciasActualizadas,
                };
            });
        }

        await alumno.save();

        // 🔹 Sincronizar en usuarios y profesores
        await sincronizarAlumnoConColecciones(alumno, dniViejo, next);

        res.json({ message: "Alumno actualizado correctamente", alumno });
    } catch (err) {
        console.error(err);
        next(err); // middleware maneja los errores
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
    await actualizarProfesores( alumno, dniViejo, next);

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

    // Buscar profesores donde el alumno está registrado
    const profesores = await Profesor.find({ "materiasDictadas.alumnos.dni": dniViejo });

    await Promise.all(
        profesores.map(async (prof) => {
            if (!Array.isArray(prof.materiasDictadas)) {
                console.warn(`⚠️ Profesor ${prof.nombre} no tiene materiasDictadas definidas`);
                return;
            }

            let huboCambios = false;

            const materiasNuevas = prof.materiasDictadas.map((materiaDictada) => {
                const materiaAlumno = materias.find((m) => m.nombre === materiaDictada.nombre);
                if (!materiaAlumno) {
                    console.log(`⚠️ No se encontró la materia ${materiaDictada.nombre} para el alumno ${nombre}`);
                    return materiaDictada;
                }

                // Actualizar alumnos
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

                // Actualizar profesor si cambió (con validaciones)
                let profActual = materiaDictada.profesor;
                if (
                    materiaAlumno?.profesor &&
                    materiaAlumno.profesor?.nombre &&
                    materiaDictada.profesor?.nombre &&
                    materiaAlumno.profesor.nombre !== materiaDictada.profesor.nombre
                ) {
                    profActual = materiaAlumno.profesor;
                    huboCambios = true;
                }

                // Chequear cambios en alumnos
                if (JSON.stringify(alumnosActualizados) !== JSON.stringify(materiaDictada.alumnos)) {
                    huboCambios = true;
                }

                return { ...materiaDictada, alumnos: alumnosActualizados, profesor: profActual };
            });

            if (huboCambios) {
                prof.materiasDictadas = materiasNuevas;
                prof.markModified("materiasDictadas");
                await prof.save({ validateBeforeSave: false });
                console.log(`✅ Profesor ${prof.nombre || prof._id} sincronizado.`);
            }
        })
    );
};










/*const getDetalleMateriaByMateriaId = async (req, res, next) => {
    try {
        const alumno = await Alumno.findById(req.params.id);
        if (!alumno) {
            const error = new Error("Alumno no encontrado");
            error.statusCode = 404;
            throw error;
        }
 
        const materia = alumno.materias.find(m => m.materiaId.toString() === req.params.materiaId);
        if (!materia) {
            const error = new Error("Materia no encontrada");
            error.statusCode = 404;
            throw error;
        }
 
        res.json({
            nombre: materia.nombre,
            profesor: materia.profesor,
            notas: materia.notas,
            asistencias: materia.asistencias
        });
    } catch (err) {
        next(err);
 
    }
};*/



const deleteAlumno = async (req, res, next) => {
    try {
        const alumno = await Alumno.findByIdAndDelete(req.params.id);
        if (!alumno) {
            //404 -> El servidor no pudo encontrar el contenido solicitado
            const error = new Error("Alumno no encontrado");
            error.statusCode = 404;
            throw error;

        } else {
            res.json({ msg: `Alumno con id ${req.params.id} eliminado correctamente` });
        }

    } catch (err) {
        //500 -> El servidor ha encontrado una situación que no sabe cómo manejar
        next(err);
    }
};

module.exports = {
    getAllAlumnos,
    getAlumnoById,
    createAlumno,
    updateAlumno,
    deleteAlumno
};
