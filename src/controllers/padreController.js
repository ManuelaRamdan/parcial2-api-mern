const Usuario = require("../models/usuarioModel");
const AppError = require("../utils/AppError");

const getAllHijos = async (req, res, next) => {
  try {
    const idPadre = req.params.id;
    const padre = await Usuario.findOne({ _id: idPadre, rol: "padre" }).populate("hijos", "_id nombre");
    if (!padre) {
      throw new AppError("Padre no encontrado", 404);
    }

    res.json({
      padre: padre.nombre,
      hijos: padre.hijos.map(h => ({ id: h._id, nombre: h.nombre, })),
    });
  } catch (err) {
    //500 -> El servidor ha encontrado una situación que no sabe cómo manejar
    if (err instanceof AppError) {
      next(err);
    } else {
      next(new AppError("Error al obtener usuarios", 500));
    }
  }
};

module.exports = { getAllHijos };