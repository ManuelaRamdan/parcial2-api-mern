// src/models/usuarioModel.js
const mongoose = require("mongoose");

const usuarioSchema = new mongoose.Schema({
  nombre: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  rol: { type: String, enum: ["padre", "profesor", "administrador"], required: true },
  profesorId: { type: mongoose.Schema.Types.ObjectId, ref: "Profesor" },
  hijos: [{
    dni: { type: String, required: true },
    activo: { type: Boolean, default: true }
  }] 
});
const Usuario = mongoose.model("Usuario", usuarioSchema);

module.exports = Usuario;
