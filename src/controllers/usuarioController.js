// src/controllers/usuarioController.js
const Usuario = require("../models/usuarioModel");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const Alumno = require("../models/alumnoModel");
const Profesor = require("../models/profesorModel");

const paginate = require("../utils/paginar");

const filtrarHijosActivos = (usuarioDoc) => {
    const usuario = usuarioDoc.toObject ? usuarioDoc.toObject() : usuarioDoc;

    if (usuario.rol === "padre" && Array.isArray(usuario.hijos)) {
        usuario.hijos = usuario.hijos.filter(hijo => hijo.activo);
    }

    delete usuario.password;

    return usuario;
};


const getAllUsuarios = async (req, res, next) => {
    try {
        const { rol } = req.query;
        const filtro = rol ? { rol: rol } : {};
        const result = await paginate(Usuario, req, { query: filtro,select: "-password" });

        const usuariosProcesados = result.data.map(filtrarHijosActivos);

        res.json({
            usuarios: usuariosProcesados,
            pagination: result.pagination
        });
    } catch (err) {
        next(err);
    }
};


const getUsuarioById = async (req, res, next) => {
    try {
        const usuario = await Usuario.findById(req.params.id).select("-password");

        if (!usuario) {
            const error = new Error("Usuario no encontrado");
            error.statusCode = 404;
            throw error;
        }

        const usuarioFiltrado = filtrarHijosActivos(usuario);
        res.json(usuarioFiltrado);

    } catch (err) {
        next(err);
    }
};



// Crear nuevo hacer esto de nuevo con bycript
const createUsuario = async (req, res, next) => {
    try {
        const { nombre, email, password, rol, hijos, profesorId } = req.body;

        // Verificar si el usuario ya existe
        const usuarioExistente = await Usuario.findOne({ email });
        if (usuarioExistente) {
            const error = new Error("El email ya está registrado");
            error.statusCode = 400;
            throw error;
        }

        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);
        let hijosFormateados = [];
        if (rol === "padre" && Array.isArray(hijos)) {
            hijosFormateados = hijos.map(h => typeof h === "string" ?
                { dni: h, activo: true } :
                { dni: h.dni, activo: h.activo !== undefined ? h.activo : true }
            );

            const dnis = hijosFormateados.map(h => h.dni);

            // Verificar que los alumnos existan
            const alumnosExistentes = await Alumno.find({ dni: { $in: dnis } });

            if (alumnosExistentes.length !== dnis.length) {
                const error = new Error("Algún DNI asignado no corresponde a un alumno existente");
                error.statusCode = 400;
                throw error;
            }

            // Verificar que los alumnos no estén asignados a otro usuario
            const usuariosConEsosHijos = await Usuario.find({ "hijos.dni": { $in: dnis } });

            if (usuariosConEsosHijos.length > 0) {
                const error = new Error("Alguno de los alumnos ya está asignado a otro usuario padre");
                error.statusCode = 400;
                throw error;
            }
        }

        let profesorIdValido = null;
        if (rol === "profesor") {
            if (!profesorId) {
                const error = new Error("Profesor debe tener un profesorId asignado");
                error.statusCode = 400;
                throw error;
            }
            const profesorExistente = await Profesor.findById(profesorId);
            if (!profesorExistente) {
                const error = new Error("El profesor indicado no existe");
                error.statusCode = 400;
                throw error;
            }

            const usuarioConEseProfesor = await Usuario.findOne({ profesorId });
            if (usuarioConEseProfesor) {
                const error = new Error("Ese profesor ya está asignado a otro usuario");
                error.statusCode = 400;
                throw error;
            }
            profesorIdValido = profesorId;
        }

        const nuevoUsuario = new Usuario({
            nombre,
            email,
            password: hashedPassword,
            rol,
            hijos: hijosFormateados,
            profesorId: profesorIdValido
        });

        const savedUsuario = await nuevoUsuario.save();

        res.status(201).json({
            message: "Usuario registrado exitosamente",
            usuario: {
                id: savedUsuario._id,
                nombre: savedUsuario.nombre,
                email: savedUsuario.email,
                rol: savedUsuario.rol,
                hijos: savedUsuario.hijos,
                profesorId: savedUsuario.profesorId
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
    loginUsuario,getAllPadre
};

