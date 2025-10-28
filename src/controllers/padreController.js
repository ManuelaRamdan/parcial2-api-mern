const Usuario = require("../models/usuarioModel");
const Alumno = require("../models/alumnoModel");

const getAllHijos = async (req, res, next) => {
  try {
    // Obtener el padre desde el JWT
    const idPadre = req.user.id;
    const padre = await Usuario.findById(idPadre);

    if (!padre) {
      const error = new Error("Padre no encontrado");
      error.statusCode = 404;
      return next(error);
    }

    // Filtrar solo los hijos activos
    const hijosActivos = padre.hijos.filter(h => h.activo);

    // Extraer los DNIs activos
    const dnisHijos = hijosActivos.map(h => h.dni);

    // Buscar los alumnos correspondientes
    const alumnos = await Alumno.find({ dni: { $in: dnisHijos }, activo: true });

    // Mapear solo la info que queremos mostrar
    const hijosInfo = alumnos.map(a => ({
      id: a._id,
      nombre: a.nombre,
      dni: a.dni
    }));

    res.json({
      padre: padre.nombre,
      hijos: hijosInfo
    });
  } catch (err) {
    next(err);
  }
};


const getAllHijosByID = async (req, res, next) => {
  try {
    // Buscar el padre por ID recibido por parámetro
    const padre = await Usuario.findById(req.params.id);

    if (!padre) {
      const error = new Error("Padre no encontrado");
      error.statusCode = 404;
      return next(error);
    }

    // Filtrar solo los hijos activos
    const hijosActivos = padre.hijos.filter(h => h.activo);

    // Extraer los DNIs activos
    const dnisHijos = hijosActivos.map(h => h.dni);

    // Buscar los alumnos correspondientes
    const alumnos = await Alumno.find({ dni: { $in: dnisHijos }, activo: true });

    // Mapear la información relevante
    const hijosInfo = alumnos.map(a => ({
      id: a._id,
      nombre: a.nombre,
      dni: a.dni
    }));

    res.json({
      padre: padre.nombre,
      hijos: hijosInfo
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllHijos, getAllHijosByID };
