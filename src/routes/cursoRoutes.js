const express = require("express");
const router = express.Router();

const cursoController = require("./../controllers/cursoController");
const {authenticateToken} = require("./../middlewares/authMiddelware");
const {isAdmin, isProfe} = require("./../middlewares/verificarRolMiddelware");

// CRUD

router.get("/profe", [authenticateToken, isProfe], cursoController.getCursoByProfe);
router.get("/profe/:id", [authenticateToken, isAdmin], cursoController.getCursoByIdProfe);
router.get("/", [authenticateToken, isAdmin], cursoController.getAllCursos);
router.get("/:id", [authenticateToken, isAdmin], cursoController.getCursoById);

module.exports = router;