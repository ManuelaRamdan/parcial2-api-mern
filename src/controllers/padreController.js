const Usuario = require("../models/usuarioModel");
const Alumno = require("../models/alumnoModel");

const getAllHijos = async (req, res, next) => {
  try {
    // Obtener el padre desde el JWT
    const idPadre = req.user.id;
    const padre = await Usuario.findOne({ _id: idPadre, rol: "padre" });

    if (!padre) {
      const error = new Error("Padre no encontrado");
      error.statusCode = 404;
      return next(error);
    }

    // Buscar los alumnos cuyos DNI estén en el array padre.hijos
    const hijos = await Alumno.find({ dni: { $in: padre.hijos } });

    // Mapear solo la info que queremos mostrar
    const hijosInfo = hijos.map(h => ({
      id: h._id,
      nombre: h.nombre
    }));

    res.json({
      padre: padre.nombre,
      hijos: hijosInfo
    });
  } catch (err) {
    next(err);
  }
};

module.exports = { getAllHijos };
