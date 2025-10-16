const express = require("express");
const router = express.Router();

const padreController = require("./../controllers/padreController");
const {authenticateToken} = require("./../middlewares/authMiddelware");
const {isPadre, isAdmin} = require("./../middlewares/verificarRolMiddelware");

// CRUD
router.get("/", [authenticateToken, isPadre, isAdmin], padreController.getAllHijos);
router.get("/:id", [authenticateToken, isPadre, isAdmin], padreController.getAllHijos);

module.exports = router;