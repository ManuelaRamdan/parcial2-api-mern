// src/controllers/usuarioController.js
const Materia = require("../models/materiaModel");
const AppError = require("../utils/AppError");

// Obtener todos
const getAllMaterias = async (req, res, next) => {
    try {
        const materias = await Materia.find();
        res.json(materias);
    } catch (err) {
        //500 -> El servidor ha encontrado una situación que no sabe cómo manejar
        if (err instanceof AppError) {
            next(err);
        } else {
            next(new AppError(`Error al obtener Materias`, 500));
        }
    }
};

// Obtener por ID

const getMateriaById = async (req, res, next) => {
    try {
        const materia = await Materia.findById(req.params.id);
        if (!materia) {
            throw new AppError("Materia no encontrada", 404);

        } else {
            res.json(materia);
        }

    } catch (err) {
        //500 -> El servidor ha encontrado una situación que no sabe cómo manejar
        if (err instanceof AppError) {
            next(err);
        } else {
            next(new AppError(`Error al obtener el Materia con id: ${req.params.id}`, 500));
        }
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
        if (err instanceof AppError) {
            next(err);
        } else {
            next(new AppError("Error al creae un Materia, verifique los datos.", 400));
        }
    }
};

// Actualizar
const updateMateria = async (req, res,next) => {
    try {
        const materia = await Materia.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!materia) {
            //404 -> El servidor no pudo encontrar el contenido solicitado
            throw new AppError("Materia no encontrada", 404);

        } else {
            res.json(materia);
        }

    } catch (err) {
        //500 -> El servidor ha encontrado una situación que no sabe cómo manejar
                if (err instanceof AppError) {
            next(err);
        } else {
            next(new AppError(`Error al actualizar el Materia con id: ${req.params.id}`, 500));
        }
    }
};

// Eliminar
const deleteMateria = async (req, res,next) => {
    try {
        const materia = await Materia.findByIdAndDelete(req.params.id);
        if (!materia) {
            //404 -> El servidor no pudo encontrar el contenido solicitado
            throw new AppError("Materia no encontrada", 404);

        } else {
            res.json({ msg: `Materia con id ${req.params.id} eliminado correctamente` });
        }

    } catch (err) {
        //500 -> El servidor ha encontrado una situación que no sabe cómo manejar
        if (err instanceof AppError) {
            next(err);
        } else {
            next(new AppError(`Error al borrar el Materia con id: ${req.params.id}`, 500));
        }
    }
};

module.exports = {
    getAllMaterias,
    getMateriaById,
    createMateria,
    updateMateria,
    deleteMateria,
};
