const express = require("express");
const router = express.Router();
const {getAllUsuarios,getUsuarioById,createUsuario,updateUsuario,deleteUsuario} = require("../controllers/usuarioController");

// GET todos los usuarios
router.get("/", (req, res) => {
  res.json(getAllUsuarios());
});

// GET usuario por ID
router.get("/:id", (req, res) => {
  const result = getUsuarioById(parseInt(req.params.id));
  if (result.error) return res.status(404).json(result);
  res.json(result);
});

// POST crear usuario
router.post("/", (req, res) => {
  const result = createUsuario(req.body);
  if (result.error) return res.status(400).json(result);
  res.status(201).json(result);
});

// PUT actualizar usuario
router.put("/:id", (req, res) => {
  const result = updateUsuario(parseInt(req.params.id), req.body);
  if (result.error) return res.status(404).json(result);
  res.json(result);
});

// DELETE eliminar usuario
router.delete("/:id", (req, res) => {
  const result = deleteUsuario(parseInt(req.params.id));
  if (result.error) return res.status(404).json(result);
  res.json(result);
});

module.exports = router;
