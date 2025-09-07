// src/controllers/materiaController.js
const Materia = require("../models/materiaModel");


function getAllMaterias(req, res) {
  const materias = Materia.getAll();
  res.json(materias);
}

function getMateriaById(req, res) {
  const id = parseInt(req.params.id);
  const materia = Materia.getById(id);
  if (!materia) return res.status(404).json({ error: "Materia no encontrado" });
  res.json(materia);
}

function createMateria(req, res) {
  const result = Materia.create(req.body);
  if (result.error) return res.status(400).json(result);
  res.status(201).json(result);
}

function updateMateria(req, res) {
  const id = parseInt(req.params.id);
  const result = Materia.update(id, req.body);
  if (result.error) return res.status(404).json(result);
  res.json(result);
}

function deleteMateria(req, res) {
  const result = Materia.remove(req.params.id);
  if (!result) return res.status(404).json({ error: "Materia no encontrado" });
  res.json({ message: "Materia eliminado" });
}


// Exportar todas las funciones
module.exports = {getAllMaterias, getMateriaById, createMateria, updateMateria, deleteMateria};
