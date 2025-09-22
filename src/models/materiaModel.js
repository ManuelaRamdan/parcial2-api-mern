// src/models/materiaModel.js
const mongoose = require("mongoose");


const materiaShema = new mongoose.Schema({
    nombre: { type: String, required: true },
    curso: { type: String, required: true, unique: true },
    profesor: {
        _id: { type: mongoose.Schema.Types.ObjectId, ref: "Profesor", required: true },
        nombre: { type: String, required: true }
    }
});

const Materia = mongoose.model("Materia", materiaShema);

module.exports = Materia;