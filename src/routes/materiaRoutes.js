const express = require("express");
const router = express.Router();

const materiaController = require("./../controllers/materiaController");

// CRUD
router.get("/", materiaController.getAllMaterias);
router.get("/:id", materiaController.getMateriaById);

module.exports = router;