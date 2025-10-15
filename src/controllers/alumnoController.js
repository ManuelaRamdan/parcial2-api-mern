// src/controllers/usuarioController.js
const Alumno = require("../models/alumnoModel");
const Profesor = require("../models/profesorModel");



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

/*
const actualizarDatosGenerales = async (dni, nombre) => {
    //Actualizá todos los documentos de la colección profesores que cumplan cierta condición
    //Modelo.updateMany(filtro, actualización, opciones)
    await Profesor.updateMany(
        //filtro
        { "materiasDictadas.alumnos.dni": dni },
        //actualización
        {
            //se usa el $ para q mongo se de cuanta que no es un dato si no q una instrucción
            //$set -> es un operador de actualización de MongoDB.
            // asigna un nuevo valor a uno o varios campos de un documento.
            $set: {
                // en todas las materias dictadas de este profesor, buscar todos los alumnos q su dni sea al mismo q el del alumno actualizado y actualizar su nombre y dni
                // $[] -> representa todos los elementos del array
                // $[identificador] -> representa los elementos del array que cumplen con una condición específica definida en arrayFilters
                "materiasDictadas.$[].alumnos.$[a].nombre": nombre,
                "materiasDictadas.$[].alumnos.$[a].dni": dni,
            },
        },
        {
            //le dice a MongoDB cuáles elementos de los arrays deben actualizarse
            //permite filtrar qué elementos del array se actualizan, usando un alias-> a
            arrayFilters: [{ "a.dni": dni }],
            runValidators: false // desactiva validaciones para campos no incluidos en la actualización
        }
    );
};

const actualizarNotasYAsistencias = async (dni, materias) => {
    if (!materias || !Array.isArray(materias) || materias.length === 0) {
        const error = new Error("No hay materias para actualizar");
        error.statusCode = 400;
        throw error;
    }
    for (const materiaBody of materias) {
        const { materiaId, nombre, notas, asistencias } = materiaBody;

        // Actualizar notas
        if (notas && Array.isArray(notas)) {
            for (const notaBody of notas) {
                const { tipo, nota } = notaBody;
                if (nota == null) continue;

                await Profesor.updateMany(
                    { "materiasDictadas.materiaId": materiaId },
                    {
                        $set: {
                            "materiasDictadas.$[m].alumnos.$[a].notas.$[n].nota": nota
                        }
                    },
                    {
                        arrayFilters: [
                            { "m.materiaId": materiaId },
                            { "a.dni": dni },
                            { "n.tipo": tipo }
                        ],
                        runValidators: false
                    }
                );
            }
        }

        // Actualizar asistencias
        if (asistencias && Array.isArray(asistencias)) {
            for (const asistenciaBody of asistencias) {
                const { fecha, presente } = asistenciaBody;
                if (fecha == null || presente == null) continue;

                await Profesor.updateMany(
                    { "materiasDictadas.materiaId": materiaId },
                    {
                        $set: {
                            "materiasDictadas.$[m].alumnos.$[a].asistencias.$[s].presente": presente
                        }
                    },
                    {
                        arrayFilters: [
                            { "m.materiaId": materiaId },
                            { "a.dni": dni },
                            { "s.fecha": new Date(fecha) }
                        ],
                        runValidators: false
                    }
                );
            }
        }
    }
};

const syncProfesorConAlumno = async (alumno, next) => {
    try {
        const { nombre, dni, materias } = alumno;
        await actualizarDatosGenerales(dni, nombre);
        await actualizarNotasYAsistencias(dni, materias, next);
    } catch (err) {
        next(err);
    }

    //await syncProfesorConAlumno(alumno, next);
};*/

const updateAlumno = async (req, res, next) => {
    try {
        const { id } = req.params; // id del alumno
        const actualizarDatos = req.body; // datos enviados

        const alumno = await Alumno.findById(id);
        if (!alumno) {
            const error = new Error("Alumno no encontrado");
            error.statusCode = 404;
            throw error;
        }

        if (actualizarDatos.nombre) {
            alumno.nombre = actualizarDatos.nombre;
        }
        if (actualizarDatos.curso) {
            alumno.curso = actualizarDatos.curso;
        }
        if (actualizarDatos.dni) {
            alumno.dni = actualizarDatos.dni;
        }




        //some es un método de arrays que devuelve true si al menos un elemento cumple la condición, y false si ninguno la cumple
        // de todas las materias que quiero actualizar quedate solo con las que ya tiene el alumno segun su nombre
        // Si se envían materias
        //Para cada materia que queremos actualizar, se procesa y retorna un resultado, que se almacena en resultados

        if (Array.isArray(actualizarDatos.materias)) {
            const materiasAlumno = alumno.materias || [];
            const materiasActualizar = actualizarDatos.materias;

            const resultados = materiasActualizar.map(materiaUpdate => {

                // ?. es encadenamiento opcional
                const nombreProfesor = materiaUpdate.profesor?.nombre || null;

                const materia = materiasAlumno.find(ma =>
                    ma.nombre === materiaUpdate.nombre &&
                    (!nombreProfesor || ma.profesor.nombre === nombreProfesor)
                );

                //? :operador ternario: condición ? valorSiTrue : valorSiFalse
                //si materiaUpdate.profesor existe y tiene nombre, lo usamos; si no, devuelve undefined en lugar de lanzar error.
                // ... -> copia todas las propiedades del objeto materia.profesor y luego sobrescribe la propiedad nombre
                const profesorActualizado = materiaUpdate.profesor?.nombre
                    ? { ...materia.profesor, nombre: materiaUpdate.profesor.nombre }
                    : materia.profesor;

                if (!materia) {
                    // Si la materia no se encuentra, devolvemos un aviso
                    return { nombre: materiaUpdate.nombre, error: "Materia no encontrada" };
                }


                const notasActualizadas = Array.isArray(materiaUpdate.notas)
                    // reduce es un método de arrays que itera sobre cada elemento y acumula un resultado
                    //acc -> acumulador: empieza siendo materia.notas (las notas actuales del alumno).
                    // notaUpdate -> cada nota que queremos actualizar

                    //lo que hace este reduce es: Recorrer las notas que queremos actualizar, 
                    //Revisar si la nota ya existe en las notas actuales, si existe la actualiza, si no existe la agrega

                    ? materiaUpdate.notas.reduce((acc, notaUpdate) => {
                        //Buscamos si en el acumulador acc ya hay una nota del mismo tipo (Parcial 1, Parcial 2)
                        const notaExistente = acc.find(n => n.tipo === notaUpdate.tipo);
                        // si existe una nota con el mismo tipo, buscamos todas las notas actuales
                        // si encontramos el tipo de notas que queremos actializar
                        // copiamos toda la nota existente (...n) y cambiamos la nota numerica
                        //Si no es la nota que queremos actualizar, la dejamos igual (: n).
                        if (notaExistente) {
                            acc = acc.map(n =>
                                n.tipo === notaUpdate.tipo ? { ...n, nota: notaUpdate.nota } : n
                            );
                        } else {
                            //spread operator -> copia todas las propiedades del objeto acc y luego agrega la nueva nota
                            acc = [...acc, notaUpdate];
                        }

                        return acc; // siempre retornamos el acumulador -> Sin ese return, reduce no sabría cuál es el nuevo acumulador y fallaría o devolvería undefined.
                    }, materia.notas)// Este es el valor inicial del acumulador acc en reduce
                    : materia.notas;// Si no se envían notas, mantenemos las actuales

                
                const asistenciasActualizadas = Array.isArray(materiaUpdate.asistencias)
                    ? materiaUpdate.asistencias.reduce((acc, asisUpdate) => {
                        // Convertir fechas a formato ISO para comparar solo la parte de la fecha (YYYY-MM-DD)
                        const fechaNueva = new Date(asisUpdate.fecha).toISOString().slice(0, 10);
                        const asistenciaExistente = acc.find(a => new Date(a.fecha).toISOString().slice(0, 10) === fechaNueva);

                        if (asistenciaExistente) {
                            // Actualizar la asistencia existente
                            acc = acc.map(a =>
                                new Date(a.fecha).toISOString().slice(0, 10) === fechaNueva
                                    ? { ...a, presente: asisUpdate.presente }
                                    : a
                            );
                        } else {
                            acc = [...acc, asisUpdate];
                        }

                        return acc; 
                    }, materia.asistencias)
                    : materia.asistencias;

                const nombreActualizado = materiaUpdate.nuevoNombre || materia.nombre;


                //copia todas las propiedades de un objeto  { nombre: ..., profesor: ..., 
                //notas: ..., asistencias: ... }) al objeto destino (materia).
                // modifica el objeto materia existente en lugar de crear uno nuevo

                Object.assign(materia, {
                    nombre: nombreActualizado,
                    profesor: profesorActualizado,
                    notas: notasActualizadas,
                    asistencias: asistenciasActualizadas,
                });

                
            });

            
        }



        // 🔹 Guardar los cambios
        await alumno.save();

        res.json({ message: "Alumno actualizado correctamente", alumno });
    } catch (err) {
        console.error(err);
        next(err);
    }
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
