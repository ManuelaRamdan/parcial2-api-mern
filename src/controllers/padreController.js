const Usuario = require("../models/usuarioModel");

const getAllHijos = async (req, res, next) => {
  try {
    const idPadre = req.params.id;
    const padre = await Usuario.findOne({ _id: idPadre, rol: "padre" }).populate("hijos", "_id nombre");
    if (!padre) {
      const error = new Error("Padre no encontrado");
      error.statusCode = 404;
      throw error;
    }

    res.json({
      padre: padre.nombre,
      hijos: padre.hijos.map(h => ({ dni: h.dni, nombre: h.nombre, })),
    });
  } catch (err) {
    //500 -> El servidor ha encontrado una situación que no sabe cómo manejar

    next(err);

  }
};

module.exports = { getAllHijos };