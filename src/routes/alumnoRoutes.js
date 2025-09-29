const express = require("express");
const router = express.Router();

const alumnoController = require("../controllers/alumnoController");

// CRUD
router.get("/", alumnoController.getAllAlumnos);
router.post("/", alumnoController.createAlumno);
router.put("/:id", alumnoController.updateAlumno);

//solo obtener info del alumno y el nombre de sus materias
router.get("/:id", alumnoController.getAlumnoById);

// Obtener detalles de una materia de un alumno (profesor, notas, asistencias)
router.get("/:id/materias/:materiaId", alumnoController.getDetalleMateriaByMateriaId);


//router.delete("/:id", alumnoController.deleteAlumno);

module.exports = router;