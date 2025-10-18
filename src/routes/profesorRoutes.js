const express = require("express");
const router = express.Router();

const profesorController = require("../controllers/profesorController");
const {authenticateToken} = require("./../middlewares/authMiddelware");
const {isAdmin} = require("./../middlewares/verificarRolMiddelware");


router.get("/",[authenticateToken, isAdmin], profesorController.getAllProfesores);
router.get("/:id", [authenticateToken, isAdmin],profesorController.getProfesorById);

// CRUD
//router.post("/", profesorController.createProfesor);
//router.put("/:id", profesorController.updateProfesor);
//router.delete("/:id", profesorController.deleteProfesor);

module.exports = router;