// src/controllers/usuarioController.js
const Alumno = require("../models/AlumnoModel");


const getAllAlumnos = async (req, res) => {
    try {
        const alumnos = await Alumno.find();
        res.json(alumnos);
    } catch (err) {
        //500 -> El servidor ha encontrado una situación que no sabe cómo manejar
        res.status(500).json({ error: "Error al obtener Alumnos" });
    }
};



const getAlumnoById = async (req, res) => {
    try {
        const alumno = await Alumno.findById(req.params.id);
        if (!alumno) {
            //404 -> El servidor no pudo encontrar el contenido solicitado
            res.status(404).json({ msg: "Alumno no encontrado" });

        } else {
            // Solo nombre, curso y materias con id y nombre
            const materias = alumno.materias.map(m => ({ id: m.materiaId, nombre: m.nombre }));
            res.json({
                id: alumno._id,
                nombre: alumno.nombre,
                curso: alumno.curso,
                materias
            });

        }

    } catch (err) {
        //500 -> El servidor ha encontrado una situación que no sabe cómo manejar
        res.status(500).json({ error: `Error al obtener el Alumno con id: ${req.params.id}` });
    }
};


const createAlumno = async (req, res) => {
    try {
        const nuevoAlumno = new Alumno(req.body);
        await nuevoAlumno.save();
        //201 -> Petición exitosa. Se ha creado un nuevo recurso como resultado de ello
        res.status(201).json(nuevoAlumno);
    } catch (err) {
        //400 -> La solicitud no se pudo completar debido a un error del cliente
        res.status(400).json({ error: "Error al creae un Alumno, verifique los datos." });
    }
};


const updateAlumno = async (req, res) => {
    try {
        const alumno = await Alumno.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!alumno) {
            //404 -> El servidor no pudo encontrar el contenido solicitado
            res.status(404).json({ msg: "Alumno no encontrado" });

        } else {
            res.json(alumno);
        }

    } catch (err) {
        //500 -> El servidor ha encontrado una situación que no sabe cómo manejar
        res.status(500).json({ error: `Error al obtener o actualizar el Alumno con id: ${req.params.id}` });
    }
};


const getDetalleMateriaByMateriaId = async (req, res) => {
    try {
        const alumno = await Alumno.findById(req.params.id);
        if (!alumno) {
            //404 -> El servidor no pudo encontrar el contenido solicitado
            return res.status(404).json({ msg: "Alumno no encontrado" });
        }
        const materia = alumno.materias.find(m => m.materiaId.toString() === req.params.materiaId);
        if (!materia) {
            //404 -> El servidor no pudo encontrar el contenido solicitado
            return res.status(404).json({ msg: "Materia no encontrada para este alumno" });
        }
        res.json({
        nombre: materia.nombre,
        profesor: materia.profesor,
        notas: materia.notas,
        asistencias: materia.asistencias
        });
    } catch (err) {
        //500 -> El servidor ha encontrado una situación que no sabe cómo manejar
        res.status(500).json({ error: "Error al obtener Alumnos" });
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
