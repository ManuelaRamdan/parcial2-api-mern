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
        const { nombre, email, password, rol, hijos } = req.body;

        // Verificar si el usuario ya existe
        const usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            return res.status(400).json({ error: "El email ya está registrado" });
        }

        // Hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Crear nuevo usuario
        const nuevoUsuario = new Usuario({
            nombre,
            email,
            password: hashedPassword,
            rol,
            hijos
        });

        const savedUsuario = await nuevoUsuario.save();

        res.status(201).json({
            message: "Usuario registrado exitosamente",
            usuario: {
                id: savedUsuario._id,
                nombre: savedUsuario.nombre,
                email: savedUsuario.email,
                rol: savedUsuario.rol,
                hijos: savedUsuario.hijos
            },
        });

    } catch (err) {
        console.error("Error al crear usuario:", err);
        res.status(500).json({ error: "Error al crear usuario" });
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
        const { email, password } = req.body;

        // Buscar usuario por email
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            return res.status(400).json({ error: "Usuario no encontrado" });
        }

        // Verificar contraseña (comparar con hash)
        const isMatch = await bcrypt.compare(password, usuario.password);
        if (!isMatch) {
            return res.status(400).json({ error: "Contraseña incorrecta" });
        }

        // Generar token JWT
        const token = jwt.sign(
            { id: usuario._id, email: usuario.email, tipo: usuario.tipo },
            process.env.JWT_SECRET, // Ver .env o variable de entorno en produccion
            { expiresIn: "1h" } // 15 seg. para probar. Para que expire en 1 hora, colocar '1h'
        );

        res.json({
            message: "Login exitoso",
            token,
            usuario: {
                id: usuario._id,
                nombre: usuario.nombre,
                email: usuario.email,
                rol: usuario.rol,
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
