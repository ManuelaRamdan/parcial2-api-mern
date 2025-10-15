// src/controllers/usuarioController.js
const Materia = require("../models/materiaModel");

// Obtener todos
const getAllMaterias = async (req, res, next) => {
    try {
        const materias = await Materia.find();
        res.json(materias);
    } catch (err) {
        //500 -> El servidor ha encontrado una situación que no sabe cómo manejar
        next(err);

    }
};

// Obtener por ID

const getMateriaById = async (req, res, next) => {
    try {
        const materia = await Materia.findById(req.params.id);
        if (!materia) {
            const error = new Error("Materia no encontrada");
            error.statusCode = 404;
            throw error;

        } else {
            res.json(materia);
        }

    } catch (err) {
        //500 -> El servidor ha encontrado una situación que no sabe cómo manejar
        next(err);
    }
};





module.exports = {
    getAllMaterias,
    getMateriaById
};
