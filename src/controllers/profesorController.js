// src/controllers/usuarioController.js
const Profesor = require("../models/profesorModel");

const paginate = require("../utils/paginar");

const getAllProfesores = async (req, res, next) => {
  try {
    const result = await paginate(Profesor, req);

    // Filtrar alumnos activos en cada materia de cada profesor
    const profesoresFiltrados = result.data.map(prof => {
      const materiasFiltradas = prof.materiasDictadas.map(materia => ({
        ...materia.toObject ? materia.toObject() : materia,
        alumnos: materia.alumnos.filter(alumno => alumno.activo === true)
      }));

      return {
        ...prof.toObject(),
        materiasDictadas: materiasFiltradas
      };
    });

    res.json({
      profesores: profesoresFiltrados,
      pagination: result.pagination
    });
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
    } else {
      const materiasFiltradas = profesor.materiasDictadas.map(materia => ({
        ...materia.toObject ? materia.toObject() : materia,
        alumnos: materia.alumnos.filter(alumno => alumno.activo === true)
      }));

      const profesorFiltrado = {
        ...profesor.toObject(),
        materiasDictadas: materiasFiltradas
      };

      res.json(profesorFiltrado);
    }

  } catch (err) {
    //500 -> El servidor ha encontrado una situación que no sabe cómo manejar
    next(err);
  }
};

module.exports = {
  getAllProfesores,
  getProfesorById
};
