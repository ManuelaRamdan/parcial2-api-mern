// src/controllers/usuarioController.js
const Materia = require("../models/materiaModel");
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;


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

// Crear nuevo
const createMateria = async (req, res, next) => {
    try {
        const nuevoMateria = new Materia(req.body);
        await nuevoMateria.save();
        //201 -> Petición exitosa. Se ha creado un nuevo recurso como resultado de ello
        res.status(201).json(nuevoMateria);
    } catch (err) {
        //400 -> La solicitud no se pudo completar debido a un error del cliente
        next(err);
    }
};

// Actualizar
const updateMateria = async (req, res, next) => {
    try {
        const materia = await Materia.findByIdAndUpdate(req.params.id, req.body, {
            new: true,
            runValidators: true,
        });
        if (!materia) {
            //404 -> El servidor no pudo encontrar el contenido solicitado
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

// Eliminar
const deleteMateria = async (req, res, next) => {
    try {
        const materia = await Materia.findByIdAndDelete(req.params.id);
        if (!materia) {
            //404 -> El servidor no pudo encontrar el contenido solicitado
            const error = new Error("Materia no encontrada");
            error.statusCode = 404;
            throw error;
        } else {
            res.json({
                msg: `Materia con id ${req.params.id} eliminado correctamente`,
            });
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
    getMateriaByIdProfe,
    createMateria,
    updateMateria,
    deleteMateria,
};
