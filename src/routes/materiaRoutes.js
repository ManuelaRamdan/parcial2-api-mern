const express = require("express");
const router = express.Router();

const materiaController = require("../controllers/materiaController");

// CRUD
router.get("/", materiaController.getAllMaterias);
router.get("/:id", materiaController.getMateriaById);
router.post("/", materiaController.createMateria);
router.put("/:id", materiaController.updateMateria);
router.delete("/:id", materiaController.deleteMateria);

module.exports = router;