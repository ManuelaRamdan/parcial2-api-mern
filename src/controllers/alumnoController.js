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

const syncProfesorConAlumno = async (alumno) => {
    try {
        const { nombre, dni, materias } = alumno;

        await Profesor.updateMany(
            { "materiasDictadas.alumnos.dni": dni },
            {
                $set: {
                    "materiasDictadas.$[].alumnos.$[a].nombre": nombre,
                    "materiasDictadas.$[].alumnos.$[a].dni": dni,
                },
            },
            {
                arrayFilters: [{ "a.dni": dni }],
            }
        );

        if (materias && Array.isArray(materias)) {
            for (const materia of materias) {
                await Profesor.updateMany(
                    { "materiasDictadas.materiaId": materia.materiaId },
                    {
                        $set: {
                            "materiasDictadas.$[m].alumnos.$[a].notas": materia.notas,
                            "materiasDictadas.$[m].alumnos.$[a].asistencias":
                                materia.asistencias,
                        },
                    },
                    {
                        arrayFilters: [
                            { "m.materiaId": materia.materiaId },
                            { "a.dni": dni },
                        ],
                    }
                );
            }
        }
    } catch (error) {
        console.error("❌ Error sincronizando profesores:", error);
    }
};



const updateAlumno = async (req, res, next) => {
    try {
        const alumno = await Alumno.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        //404 -> El servidor no pudo encontrar el contenido solicitado
        if (!alumno) {
            const error = new Error("Alumno no encontrado");
            error.statusCode = 404;
            throw error;
        }
        await syncProfesorConAlumno(alumno);

        res.json({
            message: "Alumno actualizado correctamente",
            alumno,
        });
    } catch (err) {
        next(err);
    }
};


const getDetalleMateriaByMateriaId = async (req, res, next) => {
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
};



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
    getDetalleMateriaByMateriaId,
    deleteAlumno
};
