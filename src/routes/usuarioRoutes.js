const express = require("express");
const router = express.Router();

const usuarioController = require("./../controllers/usuarioController");
const {authenticateToken} = require("./../middlewares/authMiddelware");
const {isAdmin} = require("./../middlewares/verificarRolMiddelware");

// CRUD
//usuarioController.getAllUsuarios -> liga la ruta con la función del controlador
router.get("/", [authenticateToken, isAdmin],usuarioController.getAllUsuarios);
router.get("/:id", [authenticateToken, isAdmin], usuarioController.getUsuarioById);
router.post("/register", [authenticateToken, isAdmin], usuarioController.createUsuario);
router.post("/login", usuarioController.loginUsuario);

module.exports = router;