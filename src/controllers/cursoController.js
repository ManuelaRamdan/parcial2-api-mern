// src/controllers/usuarioController.js
const Curso = require("../models/cursoModel");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const paginate = require("../utils/paginar");

const filtrarAlumnosActivos = (curso) => ({
    ...curso.toObject(),
    alumnos: curso.alumnos.filter(a => a.activo)
});

const getAllCursos = async (req, res, next) => {
    try {
        const result = await paginate(Curso, req, { sort: { nombre: 1 } });

        const cursosFiltradas = result.data.map(filtrarAlumnosActivos);

        res.json({
            cursos: cursosFiltradas,
            pagination: result.pagination
        });
    } catch (err) {
        next(err);
    }
};

const getCursoById = async (req, res, next) => {
    try {
        const curso = await Curso.findById(req.params.id);
        if (!curso) {
            const error = new Error("Curso no encontrado");
            error.statusCode = 404;
            throw error;
        }
        res.json(filtrarAlumnosActivos(curso));
    } catch (err) {
        next(err);
    }
};

const obtenerCursosPorProfesor = async (profesorId) => {
    return Curso.find({ 'profesor.id': ObjectId.createFromHexString(profesorId) });
};

const getCursoByProfe = async (req, res, next) => {
    try {
        const cursos = await obtenerCursosPorProfesor(req.user.profesorId);
        if (cursos.length === 0) {
            const error = new Error("No se encontraron cursos para este profesor");
            error.statusCode = 404;
            throw error;
        }
        res.json(cursos.map(filtrarAlumnosActivos));
    } catch (err) {
        next(err);
    }
};

const getCursoByIdProfe = async (req, res, next) => {
    try {
        const cursos = await obtenerCursosPorProfesor(req.params.id);
        if (cursos.length === 0) {
            const error = new Error("No se encontraron cursos para este profesor");
            error.statusCode = 404;
            throw error;
        }
        res.json(cursos.map(filtrarAlumnosActivos));
    } catch (err) {
        next(err);
    }
};


module.exports = {
    getAllCursos,
    getCursoById,
    getCursoByProfe,
    getCursoByIdProfe
};