
const Profesor = require("../models/profesorModel");

const paginate = require("../utils/paginar");

const { actualizarAlumno } = require("../service/alumnoService");
const Curso = require('../models/cursoModel');
const mongoose = require("mongoose");
const ObjectId = mongoose.Types.ObjectId;

const filtrarAlumnosActivos = (profesor) => {
  const profObj = profesor?.toObject ? profesor.toObject() : (profesor || {});

  // 🔹 Asegurarse de que materiasDictadas sea un array
  const materias = Array.isArray(profObj.materiasDictadas)
    ? profObj.materiasDictadas
    : [];

  const materiasFiltradas = materias.map(materia => {
    const materiaObj = materia?.toObject ? materia.toObject() : (materia || {});
    const alumnos = Array.isArray(materiaObj.alumnos) ? materiaObj.alumnos : [];

    const alumnosActivos = alumnos
      .filter(a => a && a.activo === true)
      .map(a => ({
        ...a,
        asistencias: Array.isArray(a.asistencias) ? a.asistencias : [],
        notas: Array.isArray(a.notas) ? a.notas : []
      }));

    return {
      ...materiaObj,
      alumnos: alumnosActivos
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
    const profesorId = req.user.profesorId;

    if (!Array.isArray(materias) || materias.length === 0) {
      const error = new Error("Debe enviarse un arreglo de materias para actualizar");
      error.statusCode = 400;
      throw error;
    }

    
    const campoNoPermitido = materias.find(m => {
      const claves = Object.keys(m);
      return claves.some(
        k =>
          ![
            "idCurso",
            "nombreCurso",
            "division",
            "nivel",
            "anio",
            "notas",
            "asistencias",
          ].includes(k)
        );
      });
      
      if (campoNoPermitido) {
        const error = new Error(
          "Solo se pueden enviar idCurso, nombreCurso, division, nivel, anio,  notas y asistencias"
        );
        error.statusCode = 403;
        throw error;
      }
      
      const materiasDelProfe = await Curso.find({
        "profesor.id": ObjectId.createFromHexString(profesorId),
      }).select("idCurso nombreMateria division nivel anio");
      
    const materiasInvalidas = materias.filter(m => {
      return !materiasDelProfe.some(md =>
        m.idCurso
          ? md._id?.toString() === m.idCurso
          : md.nombreMateria === m.nombreMateria &&
          md.division === m.division &&
          md.nivel === m.nivel &&
          md.anio === m.anio
      );
    });

    if (materiasInvalidas.length > 0) {
      const error = new Error("Solo se pueden modificar materias que dicta el profesor logueado");
      error.statusCode = 403;
      throw error;
    }

    const datosPermitidos = {
      materias: materias.map(m => ({
        idCurso: m.idCurso,
        nombreMateria: m.nombreMateria,
        division: m.division,
        nivel: m.nivel,
        anio: m.anio,
        profesor: { _id: profesorId, nombre: m.profesor?.nombre || "" },
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

const profeGetMiInfo = async (req, res, next) => {
  try {
    const profesorId = req.user.profesorId;

    if (!profesorId) {
      const error = new Error("El usuario no tiene un profesor asignado");
      error.statusCode = 403;
      throw error;
    }

    const profesor = await Profesor.findById(profesorId);

    if (!profesor) {
      const error = new Error("Profesor no encontrado");
      error.statusCode = 404;
      throw error;
    }

    const filtrado = filtrarAlumnosActivos(profesor);
    res.json(filtrado);

  } catch (err) {
    next(err);
  }
};






module.exports = {
  getAllProfesores,
  getProfesorById,
  actualizarNotasAsistenciasDelAlumno,
  profeGetMiInfo
};
