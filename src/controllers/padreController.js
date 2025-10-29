const Usuario = require("../models/usuarioModel");
const Alumno = require("../models/alumnoModel");

const obtenerHijosActivosPorPadre = async (idPadre) => {
  const padre = await Usuario.findById(idPadre);

  if (!padre) {
    const error = new Error("Padre no encontrado");
    error.statusCode = 404;
    throw error;
  }

  const hijosActivos = padre.hijos.filter(h => h.activo);

  const dnisHijos = hijosActivos.map(h => h.dni);

  const alumnos = await Alumno.find({ dni: { $in: dnisHijos }, activo: true });

  const hijosInfo = alumnos.map(a => ({
    id: a._id,
    nombre: a.nombre,
    dni: a.dni
  }));

  return { padre: padre.nombre, hijos: hijosInfo };
};

const getAllHijos = async (req, res, next) => {
  try {
    const idPadre = req.user.id; // viene del JWT
    const resultado = await obtenerHijosActivosPorPadre(idPadre);
    res.json(resultado);
  } catch (err) {
    next(err);
  }
};

const getAllHijosByID = async (req, res, next) => {
  try {
    const resultado = await obtenerHijosActivosPorPadre(req.params.id);
    res.json(resultado);
  } catch (err) {
    next(err);
  }
};


module.exports = { getAllHijos, getAllHijosByID };
