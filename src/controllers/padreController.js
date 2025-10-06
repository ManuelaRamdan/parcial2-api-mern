const Usuario = require("../models/usuarioModel");
const Alumno = require("../models/alumnoModel");

const getAllHijos = async (req, res, next) => {
  try {
    const idPadre = req.params.id;
    const padre = await Usuario.findOne({ _id: idPadre, rol: "padre" });
    if (!padre) {
      const error = new Error("Padre no encontrado");
      error.statusCode = 404;
      throw error;
    }

    // Buscar los alumnos cuyos DNI estén en el array padre.hijos
    //$in -> operador de MongoDB que se usa para verificar si un valor está dentro de un array
    // se usa {} pq cada vez que usas $in debe ir dentro de un objeto
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
    //500 -> El servidor ha encontrado una situación que no sabe cómo manejar

    next(err);

  }
};

module.exports = { getAllHijos };