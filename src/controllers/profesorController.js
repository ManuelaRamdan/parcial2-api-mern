
const Profesor = require("../models/profesorModel");

const paginate = require("../utils/paginar");

const { actualizarAlumno } = require("../service/alumnoService");
const Materia = require('../models/materiaModel');

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


const actualizarNotasAsistenciasDelAlumno = async (req, res, next) => {
  try {
    const alumnoId = req.params.id;
    const { materias } = req.body;
    const profesorId = req.user.id;

    if (!Array.isArray(materias) || materias.length === 0) {
      const error = new Error("Debe enviarse un arreglo de materias para actualizar");
      error.statusCode = 400;
      throw error;
    }

    // Validar campos permitidos
    const campoNoPermitido = materias.find(m => {
      const claves = Object.keys(m);
      return claves.some(k => !["nombre", "curso", "profesor", "notas", "asistencias"].includes(k));
    });
    if (campoNoPermitido) {
      const error = new Error("Solo se pueden enviar nombre, curso, profesor, notas y asistencias");
      error.statusCode = 403;
      throw error;
    }

    // Traer las materias que dicta este profesor
    const materiasDelProfe = await Materia.find({
      "profesor._id": profesorId
    }).select("nombre curso"); // solo necesitamos nombre y curso

    // Verificar que las materias que quiere modificar están dentro de las del profesor
    const materiasInvalidas = materias.filter(m =>
      !materiasDelProfe.some(md => md.nombre === m.nombre && md.curso === m.curso)
    );
    if (materiasInvalidas.length > 0) {
      const error = new Error("Solo se pueden modificar materias que dicta el profesor logueado");
      error.statusCode = 403;
      throw error;
    }

    // Preparar datos permitidos
    const datosPermitidos = {
      materias: materias.map(m => ({
        nombre: m.nombre,
        curso: m.curso,
        profesor: m.profesor,
        notas: Array.isArray(m.notas) ? m.notas : [],
        asistencias: Array.isArray(m.asistencias) ? m.asistencias : [],
      })),
    };


    const alumnoActualizado = await actualizarAlumno(alumnoId, datosPermitidos);

    res.status(200).json({
      message: "Notas y asistencias actualizadas correctamente",
      alumno: alumnoActualizado,
    });

  } catch (error) {
    next(error);
  }
};




module.exports = {
  getAllProfesores,
  getProfesorById,
  actualizarNotasAsistenciasDelAlumno
};
