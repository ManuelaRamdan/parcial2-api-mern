// src/controllers/usuarioController.js
const Usuario = require("../models/usuarioModel");
const AppError = require("../utils/AppError");

// Obtener todos
const getAllUsuarios = async (req, res, next) => {
    try {
        const usuarios = await Usuario.find();
        res.json(usuarios);
    } catch (err) {
        //500 -> El servidor ha encontrado una situación que no sabe cómo manejar
        if (err instanceof AppError) {
            next(err);
        } else {
            next(new AppError("Error al obtener usuarios", 500));
        }
    }
};

// Obtener por ID

const getUsuarioById = async (req, res, next) => {
    try {
        const usuario = await Usuario.findById(req.params.id);
        if (!usuario) {
            //404 -> El servidor no pudo encontrar el contenido solicitado
            throw new AppError("Usuario no encontrado", 404);
        } else {
            res.json(usuario);
        }

    } catch (err) {
        //500 -> El servidor ha encontrado una situación que no sabe cómo manejar
        if (err instanceof AppError) {
            next(err);
        } else {
            next(new AppError(`Error al obtener el usuario con id: ${req.params.id}`, 500));
        }
    }
};

// Crear nuevo
const createUsuario = async (req, res, next) => {
    try {
        const nuevoUsuario = new Usuario(req.body);
        await nuevoUsuario.save();
        //201 -> Petición exitosa. Se ha creado un nuevo recurso como resultado de ello
        res.status(201).json(nuevoUsuario);
    } catch (err) {
        //400 -> La solicitud no se pudo completar debido a un error del cliente
        if (err instanceof AppError) {
            next(err);
        } else {
            next(new AppError("Error al crear un usuario, verifique los datos.", 400));
        }
    }
};


const updateUsuario = async (req, res, next) => {
    try {
        const usuario = await Usuario.findByIdAndUpdate(
            req.params.id,
            req.body,
            { new: true, runValidators: true }
        );

        if (!usuario) {
            throw new AppError("Usuario no encontrado", 404);

        }

        // Podés hacer algo similar para otras colecciones si es necesario

        res.json(usuario);
    } catch (err) {
        if (err instanceof AppError) {
            next(err);
        } else {                
            next(new AppError(`Error al actualizar el usuario con id: ${req.params.id}`, 500));
        }
    }
};

// Eliminar
const deleteUsuario = async (req, res, next) => {
    try {
        const usuario = await Usuario.findByIdAndDelete(req.params.id);
        if (!usuario) {
            //404 -> El servidor no pudo encontrar el contenido solicitado
            throw new AppError("Usuario no encontrado", 404);
        } else {
            res.json({ msg: `Usuario con id ${req.params.id} eliminado correctamente` });
        }

    } catch (err) {
        //500 -> El servidor ha encontrado una situación que no sabe cómo manejar
        if (err instanceof AppError) {
            next(err);
        } else {                
            next(new AppError(`Error al obtener o borrar el usuario con id: ${req.params.id}`, 500));
        }
    }
};

module.exports = {
    getAllUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario,
};
