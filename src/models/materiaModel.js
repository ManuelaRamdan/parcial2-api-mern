// src/models/materiaModel.js
const mongoose = require("mongoose");



const materiaShema = new mongoose.Schema({
    nombre: { type: String, required: true },
    cargaHoraria: { type: Number, required: true },
    contenido: { type: String, required: true },
    nivel: { type: Number, required: true },
    curso: {
        id: { type: mongoose.Schema.Types.ObjectId, ref: "Curso", required: true },
        division: { type: String, required: true },
        anio: { type: Number, required: true }
    }
});



const Materia = mongoose.model("Materia", materiaShema);

module.exports = Materia;