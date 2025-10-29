// src/controllers/usuarioController.js
const Usuario = require("../models/usuarioModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");



const paginate = require("../utils/paginar");

const getAllUsuarios = async (req, res, next) => {
    try {
        const result = await paginate(Usuario, req, {
            // excluimos el campo password de todos los usuarios
            select: "-password"
        });

        // Filtramos los hijos inactivos si el rol es padre
        const usuariosProcesados = result.data.map(u => {
            const usuario = u.toObject();
            if (usuario.rol === "padre" && Array.isArray(usuario.hijos)) {
                usuario.hijos = usuario.hijos.filter(h => h.activo);
            }
            return usuario;
        });

        res.json({
            usuarios: usuariosProcesados,
            pagination: result.pagination
        });
    } catch (err) {
        next(err);
    }
};


// Obtener por ID
const getUsuarioById = async (req, res, next) => {
    try {
        const usuario = await Usuario.findById(req.params.id).select("-password");

        if (!usuario) {
            const error = new Error("Usuario no encontrado");
            error.statusCode = 404;
            throw error;
        }

        // Filtrar hijos activos solo si es padre
        let usuarioObj = usuario.toObject();
        if (usuarioObj.rol === "padre" && Array.isArray(usuarioObj.hijos)) {
            usuarioObj.hijos = usuarioObj.hijos.filter(h => h.activo);
        }

        res.json(usuarioObj);
    } catch (err) {
        next(err);
    }
};


// Crear nuevo hacer esto de nuevo con bycript
const createUsuario = async (req, res, next) => {
    try {
        const { nombre, email, password, rol, hijos } = req.body;

        // Verificar si el usuario ya existe
        const usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            const error = new Error("El email ya está registrado");
            error.statusCode = 400;
            throw error;
        }

        // Hashear la contraseña
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        let hijosFormateados = [];
        if (rol === "padre" && Array.isArray(hijos)) {
            hijosFormateados = hijos.map(h => {
                if (typeof h === "string") {
                    return { dni: h, activo: true };
                }

                // Si ya viene como objeto, validamos campos
                return {
                    dni: h.dni,
                    activo: h.activo !== undefined ? h.activo : true
                };
            });
        }

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
        next(err);
    }
};


const loginUsuario = async (req, res, next) => {
    try {
        const { email, password } = req.body;

        // Buscar usuario por email
        const usuario = await Usuario.findOne({ email });
        if (!usuario) {
            const error = new Error("Usuario no encontrado");
            error.statusCode = 404;
            throw error;
        }

        // Verificar contraseña (comparar con hash)
        const isMatch = await bcrypt.compare(password, usuario.password);
        if (!isMatch) {
            const error = new Error("Contraseña incorrecta");
            error.statusCode = 400;
            throw error;
        }

        // Generar token JWT
        const token = jwt.sign(
            { id: usuario._id, email: usuario.email, rol: usuario.rol, profesorId: usuario.profesorId ? usuario.profesorId.toString() : null, nombre: usuario.nombre },
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
                profesorId: usuario.profesorId ? usuario.profesorId.toString() : null,
                nombre: usuario.nombre
            }
        });
    } catch (err) {
        next(err);

    };
};

module.exports = {
    getAllUsuarios,
    getUsuarioById,
    createUsuario,
    loginUsuario
};

