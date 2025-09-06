// src/controllers/usuarioController.js
const Usuario = require("../models/usuarioModel");


function getAllUsuarios(req, res) {
  const usuarios = Usuario.getAll();
  res.json(usuarios);
}

function getUsuarioById(req, res) {
  const id = parseInt(req.params.id);
  const usuario = Usuario.getById(id);
  if (!usuario) return res.status(404).json({ error: "Usuario no encontrado" });
  res.json(usuario);
}

function createUsuario(req, res) {
  const result = Usuario.create(req.body);
  if (result.error) return res.status(400).json(result);
  res.status(201).json(result);
}

function updateUsuario(req, res) {
  const id = parseInt(req.params.id);
  const result = Usuario.update(id, req.body);
  if (result.error) return res.status(404).json(result);
  res.json(result);
}

function deleteUsuario(req, res) {
  const result = Usuario.remove(req.params.id);
  if (!result) return res.status(404).json({ error: "Usuario no encontrado" });
  res.json({ message: "Usuario eliminado" });
}


// Exportar todas las funciones
module.exports = {getAllUsuarios, getUsuarioById, createUsuario, updateUsuario, deleteUsuario};
