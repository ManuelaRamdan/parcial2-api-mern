const express = require("express");
const router = express.Router();

const profesorController = require("../controllers/profesorController");
const {authenticateToken} = require("./../middlewares/authMiddelware");
const {isAdmin, isProfe} = require("./../middlewares/verificarRolMiddelware");


router.get("/",[authenticateToken, isAdmin], profesorController.getAllProfesores);
router.get("/:id", [authenticateToken, isAdmin],profesorController.getProfesorById);
router.put("/:id", [authenticateToken, isProfe], profesorController.actualizarNotasAsistenciasDelAlumno);

module.exports = router;