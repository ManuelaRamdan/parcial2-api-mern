const express = require("express");
const router = express.Router();

const materiaController = require("./../controllers/materiaController");
const {authenticateToken} = require("./../middlewares/authMiddelware");
const {isAdmin} = require("./../middlewares/verificarRolMiddelware");

// CRUD
router.get("/", [authenticateToken, isAdmin], materiaController.getAllMaterias);
router.get("/:id", [authenticateToken, isAdmin], materiaController.getMateriaById);

module.exports = router;