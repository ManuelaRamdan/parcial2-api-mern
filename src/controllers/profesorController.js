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

module.exports = {
    getAllProfesores,
    getProfesorById
};
