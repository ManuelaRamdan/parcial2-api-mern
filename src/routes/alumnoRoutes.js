const express = require("express");
const router = express.Router();

const alumnoController = require("../controllers/alumnoController");
const {authenticateToken} = require("./../middlewares/authMiddelware");
const {isAdmin, noPadre} = require("./../middlewares/verificarRolMiddelware");

// CRUD
router.get("/", [authenticateToken, isAdmin], alumnoController.getAllAlumnos);
router.post("/", [authenticateToken, isAdmin], alumnoController.createAlumno);
router.put("/:id", [authenticateToken, noPadre], alumnoController.updateAlumno);

//solo obtener info del alumno y el nombre de sus materias
router.get("/:id", [authenticateToken],alumnoController.getAlumnoById);


router.delete("/:id", [authenticateToken, isAdmin], alumnoController.deleteAlumno);

module.exports = router;