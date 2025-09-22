const express = require("express");
const router = express.Router();

const profesorController = require("../controllers/profesorController");

// CRUD
router.get("/", profesorController.getAllProfesores);
router.get("/:id", profesorController.getProfesorById);
router.post("/", profesorController.createProfesor);
router.put("/:id", profesorController.updateProfesor);
router.delete("/:id", profesorController.deleteProfesor);

module.exports = router;