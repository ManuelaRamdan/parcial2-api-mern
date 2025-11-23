// src/controllers/usuarioController.js
const Materia = require("../models/materiaModel");
const mongoose = require("mongoose");

const paginate = require("../utils/paginar");



const getAllMaterias = async (req, res, next) => {
    try {
        const result = await paginate(Materia, req, { sort: { nombre: 1 } });
        res.json({
            materias: result.data,
            pagination: result.pagination
        });
    } catch (err) {
        next(err);
    }
};

const getMateriaById = async (req, res, next) => {
    try {
        const materia = await Materia.findById(req.params.id);
        if (!materia) {
            const error = new Error("Materia no encontrada");
            error.statusCode = 404;
            throw error;
        }
        res.json(materia);
    } catch (err) {
        next(err);
    }
};



module.exports = {
    getAllMaterias,
    getMateriaById
};
