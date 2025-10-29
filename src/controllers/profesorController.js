
const Profesor = require("../models/profesorModel");

const paginate = require("../utils/paginar");

const filtrarAlumnosActivos = (profesor) => {
  const profObj = profesor && profesor.toObject ? profesor.toObject() : (profesor || {});

  const materias = Array.isArray(profObj.materiasDictadas) ? profObj.materiasDictadas : [];

  const materiasFiltradas = materias.map(materia => {
    const matObj = materia && materia.toObject ? materia.toObject() : (materia || {});
    const alumnos = Array.isArray(matObj.alumnos) ? matObj.alumnos : [];

    return {
      ...matObj,
      alumnos: alumnos.filter(alumno => alumno && alumno.activo === true)
    };
  });

  return {
    ...profObj,
    materiasDictadas: materiasFiltradas
  };
};


const getAllProfesores = async (req, res, next) => {
  try {
    const result = await paginate(Profesor, req);

    const profesoresFiltrados = result.data.map(filtrarAlumnosActivos);

    res.json({
      profesores: profesoresFiltrados,
      pagination: result.pagination
    });
  } catch (err) {
    next(err);
  }
};

const getProfesorById = async (req, res, next) => {
  try {
    const profesor = await Profesor.findById(req.params.id);

    if (!profesor) {
      const error = new Error("Profesor no encontrado");
      error.statusCode = 404;
      throw error;
    }

    const profesorFiltrado = filtrarAlumnosActivos(profesor);

    res.json(profesorFiltrado);
  } catch (err) {
    next(err);
  }
};


module.exports = {
  getAllProfesores,
  getProfesorById
};
