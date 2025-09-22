// src/controllers/usuarioController.js
const Profesor = require("../models/profesorModel");

const getAllProfesores = async (req, res) => {
  try {
    const profesores = await Profesor.find()
      .populate("usuarioId", "nombre email rol")      // traer datos del usuario
      .populate("materiasDictadas.materiaId", "nombre curso"); // traer datos de materias
    res.json(profesores);
  } catch (err) {
    res.status(500).json({ error: "Error al obtener Profesores" });
  }
};



// Obtener por ID

const getProfesorById = async (req, res) => {
    try {
        const profesor = await Profesor.findById(req.params.id);
        if (!profesor) {
            //404 -> El servidor no pudo encontrar el contenido solicitado
            res.status(404).json({ msg: "Profesor no encontrado" });

        } else {
            res.json(profesor);
        }

    } catch (err) {
        //500 -> El servidor ha encontrado una situación que no sabe cómo manejar
        res.status(500).json({ error: `Error al obtener el Profesor con id: ${req.params.id}` });
    }
};

// Crear nuevo
const createProfesor = async (req, res) => {
    try {
        const nuevoProfesor = new Profesor(req.body);
        await nuevoProfesor.save();
        //201 -> Petición exitosa. Se ha creado un nuevo recurso como resultado de ello
        res.status(201).json(nuevoProfesor);
    } catch (err) {
        //400 -> La solicitud no se pudo completar debido a un error del cliente
        res.status(400).json({ error: "Error al creae un Profesor, verifique los datos." });
    }
};

// Actualizar
const updateProfesor = async (req, res) => {
    try {
        const profesor = await Profesor.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true });
        if (!profesor) {
            //404 -> El servidor no pudo encontrar el contenido solicitado
            res.status(404).json({ msg: "Profesor no encontrado" });

        } else {
            res.json(profesor);
        }

    } catch (err) {
        //500 -> El servidor ha encontrado una situación que no sabe cómo manejar
        res.status(500).json({ error: `Error al obtener o actualizar el Profesor con id: ${req.params.id}` });
    }
};

// Eliminar
const deleteProfesor = async (req, res) => {
    try {
        const profesor = await Profesor.findByIdAndDelete(req.params.id);
        if (!profesor) {
            //404 -> El servidor no pudo encontrar el contenido solicitado
            res.status(404).json({ msg: "Profesor no encontrado" });

        } else {
            res.json({ msg: `Profesor con id ${req.params.id} eliminado correctamente` });
        }

    } catch (err) {
        //500 -> El servidor ha encontrado una situación que no sabe cómo manejar
        res.status(500).json({ error: `Error al obtener o borrar el Profesor con id: ${req.params.id}` });
    }
};

module.exports = {
    getAllProfesores,
    getProfesorById,
    createProfesor,
    updateProfesor,
    deleteProfesor,
};
