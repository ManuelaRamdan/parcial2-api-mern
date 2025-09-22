// src/controllers/usuarioController.js
const Materia = require("../models/materiaModel");

// Obtener todos
const getAllMaterias = async (req, res) => {
    try {
        const materias = await Materia.find();
        res.json(materias);
    } catch (err) {
        //500 -> El servidor ha encontrado una situación que no sabe cómo manejar
        res.status(500).json({ error: "Error al obtener Materias" });
    }
};

// Obtener por ID

const getMateriaById = async (req, res) => {
    try {
        const materia = await Materia.findById(req.params.id);
        if (!materia) {
            //404 -> El servidor no pudo encontrar el contenido solicitado
            res.status(404).json({ msg: "Materia no encontrado" });

        } else {
            res.json(materia);
        }

    } catch (err) {
        //500 -> El servidor ha encontrado una situación que no sabe cómo manejar
        res.status(500).json({ error: `Error al obtener el Materia con id: ${req.params.id}` });
    }
};

// Crear nuevo
const createMateria = async (req, res) => {
    try {
        const nuevoMateria = new Materia(req.body);
        await nuevoMateria.save();
        //201 -> Petición exitosa. Se ha creado un nuevo recurso como resultado de ello
        res.status(201).json(nuevoMateria);
    } catch (err) {
        //400 -> La solicitud no se pudo completar debido a un error del cliente
        res.status(400).json({ error: "Error al creae un Materia, verifique los datos." });
    }
};

// Actualizar
const updateMateria = async (req, res) => {
    try {
        const materia = await Materia.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!materia) {
            //404 -> El servidor no pudo encontrar el contenido solicitado
            res.status(404).json({ msg: "Materia no encontrado" });

        } else {
            res.json(materia);
        }

    } catch (err) {
        //500 -> El servidor ha encontrado una situación que no sabe cómo manejar
        res.status(500).json({ error: `Error al obtener o actualizar el Materia con id: ${req.params.id}` });
    }
};

// Eliminar
const deleteMateria = async (req, res) => {
    try {
        const materia = await Materia.findByIdAndDelete(req.params.id);
        if (!materia) {
            //404 -> El servidor no pudo encontrar el contenido solicitado
            res.status(404).json({ msg: "Materia no encontrado" });

        } else {
            res.json({ msg: `Materia con id ${req.params.id} eliminado correctamente` });
        }

    } catch (err) {
        //500 -> El servidor ha encontrado una situación que no sabe cómo manejar
        res.status(500).json({ error: `Error al obtener o borrar el Materia con id: ${req.params.id}` });
    }
};

module.exports = {
    getAllMaterias,
    getMateriaById,
    createMateria,
    updateMateria,
    deleteMateria,
};
