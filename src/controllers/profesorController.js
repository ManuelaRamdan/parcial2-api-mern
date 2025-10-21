// src/controllers/usuarioController.js
const Profesor = require("../models/profesorModel");

const getAllProfesores = async (req, res, next) => {
  try {
    const profesores = await Profesor.find();
    res.json(profesores);
  } catch (err) {
    next(err);
  }
};



// Obtener por ID

const getProfesorById = async (req, res, next) => {
  try {
    const profesor = await Profesor.findById(req.params.id);
    if (!profesor) {
      //404 -> El servidor no pudo encontrar el contenido solicitado
      const error = new Error("Profesor no encontrado");
      error.statusCode = 404;
      throw error;

    } 
      
    res.json(profesor);
    

  } catch (err) {
    //500 -> El servidor ha encontrado una situación que no sabe cómo manejar
    next(err);
  }
};

module.exports = {
  getAllProfesores,
  getProfesorById
};
