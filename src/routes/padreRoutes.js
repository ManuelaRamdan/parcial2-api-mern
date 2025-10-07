const express = require("express");
const router = express.Router();

const padreController = require("./../controllers/padreController");
const {authenticateToken} = require("./../middlewares/authMiddelware");
const {isPadre} = require("./../middlewares/verificarRolMiddelware");

// CRUD
router.get("/", [authenticateToken, isPadre], padreController.getAllHijos);
router.get("/:id", [authenticateToken, isPadre], padreController.getAllHijos);

module.exports = router;