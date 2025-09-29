// src/controllers/usuarioController.js
const Alumno = require("../models/AlumnoModel");
const AppError = require("../utils/AppError");



const getAllAlumnos = async (req, res, next) => {
    try {
        const alumnos = await Alumno.find();
        res.json(alumnos);
    } catch (err) {
        //500 -> El servidor ha encontrado una situación que no sabe cómo manejar
        next(new AppError("Error al obtener alumnos", 500));
    }
};

//404 -> El servidor no pudo encontrar el contenido solicitado

const getAlumnoById = async (req, res, next) => {
    try {
        const alumno = await Alumno.findById(req.params.id);
        if (!alumno) {
            throw new AppError("Alumno no encontrado", 404);
        }

        const materias = alumno.materias.map(m => ({ id: m.materiaId, nombre: m.nombre }));

        res.json({
            id: alumno._id,
            nombre: alumno.nombre,
            curso: alumno.curso,
            materias
        });
    } catch (err) {
        if (err instanceof AppError) {
            next(err);
        } else {
            next(new AppError(`Error al obtener el alumno con id: ${req.params.id}`, 500));
        }
    }
};


const createAlumno = async (req, res,next) => {
    try {
        const nuevoAlumno = new Alumno(req.body);
        await nuevoAlumno.save();
        //201 -> Petición exitosa. Se ha creado un nuevo recurso como resultado de ello
        res.status(201).json(nuevoAlumno);
    } catch (err) {
        //400 -> La solicitud no se pudo completar debido a un error del cliente
        next(new AppError("Error al crear un alumno, verifique los datos.", 400));
    }
};


const updateAlumno = async (req, res,next) => {
    try {
        const alumno = await Alumno.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        //404 -> El servidor no pudo encontrar el contenido solicitado
        if (!alumno) throw new AppError("Alumno no encontrado", 404);

        res.json(alumno);
    } catch (err) {
        next(err instanceof AppError ? err : new AppError(`Error al actualizar el alumno con id: ${req.params.id}`, 500));
    }
};


const getDetalleMateriaByMateriaId = async (req, res,next) => {
    try {
        const alumno = await Alumno.findById(req.params.id);
        if (!alumno) throw new AppError("Alumno no encontrado", 404);

        const materia = alumno.materias.find(m => m.materiaId.toString() === req.params.materiaId);
        if (!materia) throw new AppError("Materia no encontrada para este alumno", 404);

        res.json({
            nombre: materia.nombre,
            profesor: materia.profesor,
            notas: materia.notas,
            asistencias: materia.asistencias
        });
    } catch (err) {
        next(err instanceof AppError ? err : new AppError("Error al obtener detalle de la materia", 500));
    }
};



/*const deleteAlumno = async (req, res) => {
    try {
        const alumno = await Alumno.findByIdAndDelete(req.params.id);
        if (!alumno) {
            //404 -> El servidor no pudo encontrar el contenido solicitado
            res.status(404).json({ msg: "Alumno no encontrado" });

        } else {
            res.json({ msg: `Alumno con id ${req.params.id} eliminado correctamente` });
        }

    } catch (err) {
        //500 -> El servidor ha encontrado una situación que no sabe cómo manejar
        res.status(500).json({ error: `Error al obtener o borrar el Alumno con id: ${req.params.id}` });
    }
};*/

module.exports = {
    getAllAlumnos,
    getAlumnoById,
    createAlumno,
    updateAlumno,
    getDetalleMateriaByMateriaId
};
