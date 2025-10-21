// src/controllers/usuarioController.js
const Materia = require("../models/materiaModel");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;


const paginate = require("../utils/paginar");

const getAllMaterias = async (req, res, next) => {
    try {

        const curso = req.query.curso; // ejemplo: /api/materias?curso=2A

        const query = curso ? { curso } : {}; // si no viene, muestra todas

        const result = await paginate(Materia, req, {
            query,
            sort: { nombre: 1 },
        });

        res.json({
            materias: result.data,
            pagination: result.pagination
        });
    } catch (err) {
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

const getMateriaByProfe = async (req, res, next) => {
    try {
        const profesorId = req.user.profesorId;
        console.log(profesorId);
        const materias = await Materia.find({ 'profesor.id': ObjectId.createFromHexString(profesorId) });
        if (!materias || materias.length === 0) {
            const error = new Error("No se encontraron materias para este profesor");
            error.statusCode = 404;
            throw error;
        } else {
            res.json(materias);
        }
    } catch (err) {
        //500 -> El servidor ha encontrado una situación que no sabe cómo manejar
        next(err);
    }
};

const getMateriaByIdProfe = async (req, res, next) => {
    try {
        const profesorId = req.params.id;
        console.log(profesorId);
        const materias = await Materia.find({ 'profesor.id': ObjectId.createFromHexString(profesorId) });
        if (!materias || materias.length === 0) {
            const error = new Error("No se encontraron materias para este profesor");
            error.statusCode = 404;
            throw error;
        } else {
            res.json(materias);
        }
    } catch (err) {
        //500 -> El servidor ha encontrado una situación que no sabe cómo manejar
        next(err);
    }
};


module.exports = {
    getAllMaterias,
    getMateriaById,
    getMateriaByProfe,
    getMateriaByIdProfe
};
