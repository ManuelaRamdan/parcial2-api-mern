const express = require("express");
const router = express.Router();

const usuarioController = require("./../controllers/usuarioController");

// CRUD
//usuarioController.getAllUsuarios -> liga la ruta con la función del controlador
router.get("/", usuarioController.getAllUsuarios);
router.get("/:id", usuarioController.getUsuarioById);
router.post("/register", usuarioController.createUsuario);
router.post("/login", usuarioController.loginUsuario);
router.put("/:id", usuarioController.updateUsuario);
router.delete("/:id", usuarioController.deleteUsuario);

module.exports = router;