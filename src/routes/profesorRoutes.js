const express = require("express");
const router = express.Router();

const profesorController = require("../controllers/profesorController");
const {authenticateToken} = require("./../middlewares/authMiddelware");
const {isAdmin, isProfe} = require("./../middlewares/verificarRolMiddelware");


router.put("/alumno/dni/:dni", [authenticateToken, isProfe], profesorController.actualizarNotasAsistenciasDelAlumno);
router.get("/me", [authenticateToken, isProfe], profesorController.profeGetMiInfo);
router.get("/:id", [authenticateToken, isAdmin],profesorController.getProfesorById);
router.get("/",[authenticateToken, isAdmin], profesorController.getAllProfesores);

module.exports = router;