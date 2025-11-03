// src/controllers/usuarioController.js
const Materia = require("../models/materiaModel");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const paginate = require("../utils/paginar");

const filtrarAlumnosActivos = (materia) => ({
    ...materia.toObject(),
    alumnos: materia.alumnos.filter(a => a.activo)
});

const getAllMaterias = async (req, res, next) => {
    try {
        const result = await paginate(Materia, req, { sort: { nombre: 1 } });

        const materiasFiltradas = result.data.map(filtrarAlumnosActivos);

        res.json({
            materias: materiasFiltradas,
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
        res.json(filtrarAlumnosActivos(materia));
    } catch (err) {
        next(err);
    }
};

const obtenerMateriasPorProfesor = async (profesorId) => {
    return Materia.find({ 'profesor.id': ObjectId.createFromHexString(profesorId) });
};

const getMateriaByProfe = async (req, res, next) => {
    try {
        const materias = await obtenerMateriasPorProfesor(req.user.profesorId);
        if (materias.length === 0) {
            const error = new Error("No se encontraron materias para este profesor");
            error.statusCode = 404;
            throw error;
        }
        res.json(materias.map(filtrarAlumnosActivos));
    } catch (err) {
        next(err);
    }
};

const getMateriaByIdProfe = async (req, res, next) => {
    try {
        const materias = await obtenerMateriasPorProfesor(req.params.id);
        if (materias.length === 0) {
            const error = new Error("No se encontraron materias para este profesor");
            error.statusCode = 404;
            throw error;
        }
        res.json(materias.map(filtrarAlumnosActivos));
    } catch (err) {
        next(err);
    }
};


module.exports = {
    getAllMaterias,
    getMateriaById,
    getMateriaByProfe,
    getMateriaByIdProfe
};
