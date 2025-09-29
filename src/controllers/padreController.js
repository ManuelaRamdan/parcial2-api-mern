const Usuario = require("../models/usuarioModel");

const getAllHijos = async (req, res) => {
    try {
        const idPadre = req.params.id;
        const padre = await Usuario.findOne({ _id: idPadre, rol: "padre" }).populate("hijos", "_id nombre");
        if (!padre) {
        return res.status(404).json({ error: "Padre no encontrado" });
      }

      res.json({padre: padre.nombre,
        hijos: padre.hijos.map(h => ({id: h._id,nombre: h.nombre,})),
      });
    } catch (err) {
        //500 -> El servidor ha encontrado una situación que no sabe cómo manejar
        res.status(500).json({ error: "Error al obtener usuarios" });
    }
};

module.exports = {getAllHijos};