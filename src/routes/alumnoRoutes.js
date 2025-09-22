const express = require("express");
const router = express.Router();

const alumnoController = require("../controllers/alumnoController");

// CRUD
router.get("/", alumnoController.getAllAlumnos);
router.get("/:id", alumnoController.getAlumnoById);
router.post("/", alumnoController.createAlumno);
router.put("/:id", alumnoController.updateAlumno);
router.delete("/:id", alumnoController.deleteAlumno);

module.exports = router;