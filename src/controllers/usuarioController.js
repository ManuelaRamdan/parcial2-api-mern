// src/controllers/usuarioController.js
const Usuario = require("../models/usuarioModel");
const AppError = require("../utils/AppError");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");

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

// Crear nuevo hacer esto de nuevo con bycript
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


const loginUsuario = async (req, res) => {
    try {
        const { mail, clave } = req.body;

        // Buscar usuario por email
        const usuario = await Usuario.findOne({ mail });
        if (!usuario) {
            return res.status(400).json({ error: "Usuario no encontrado" });
        }

        // Verificar contraseña (comparar con hash)
        const isMatch = await bcrypt.compare(clave, usuario.clave);
        if (!isMatch) {
            return res.status(400).json({ error: "Contraseña incorrecta" });
        }

        // Generar token JWT
        const token = jwt.sign(
            { id: usuario._id, mail: usuario.mail, tipo: usuario.tipo },
            process.env.JWT_SECRET, // Ver .env o variable de entorno en produccion
            { expiresIn: "15000" } // 15 seg. para probar. Para que expire en 1 hora, colocar '1h'
        );

        res.json({
            message: "Login exitoso",
            token,
            usuario: {
                id: usuario._id,
                nombre: usuario.perfil.nombre,
                email: usuario.mail,
                tipo: usuario.tipo,
            },
        });
    } catch (err) {
        console.error("Error en login:", err);
        res.status(500).json({ error: "Error en el servidor" });
    }
};

module.exports = {
    getAllUsuarios,
    getUsuarioById,
    createUsuario,
    updateUsuario,
    deleteUsuario,
    loginUsuario
};
