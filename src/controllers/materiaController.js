// src/controllers/usuarioController.js
const Materia = require("../models/materiaModel");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const paginate = require("../utils/paginar");

const getAllMaterias = async (req, res, next) => {
    try {
        const result = await paginate(Materia, req, {
            sort: { nombre: 1 },
        });

        // Filtrar solo alumnos activos dentro de cada materia
        const materiasFiltradas = result.data.map(materia => ({
            ...materia.toObject(),
            alumnos: materia.alumnos.filter(alumno => alumno.activo === true),
        }));

        res.json({
            materias: materiasFiltradas,
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
            const materiaFiltrada = {
                ...materia.toObject(),
                alumnos: materia.alumnos.filter(alumno => alumno.activo === true)
            };

            res.json(materiaFiltrada);
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
            const materiaFiltrada = {
                ...materia.toObject(),
                alumnos: materia.alumnos.filter(alumno => alumno.activo === true)
            };

            res.json(materiaFiltrada);
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
            const materiaFiltrada = {
                ...materia.toObject(),
                alumnos: materia.alumnos.filter(alumno => alumno.activo === true)
            };

            res.json(materiaFiltrada);
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
