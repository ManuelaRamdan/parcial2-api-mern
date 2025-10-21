const express = require("express");
const router = express.Router();

const materiaController = require("./../controllers/materiaController");
const {authenticateToken} = require("./../middlewares/authMiddelware");
const {isProfe} = require("./../middlewares/verificarRolMiddelware");
const {isAdmin} = require("./../middlewares/verificarRolMiddelware");

// CRUD
router.get("/profe", [authenticateToken, isProfe], materiaController.getMateriaByProfe);//PARA PROFESORES TIRA SUS MATERIAS ID SACADO DEL TOKEN
router.get("/profe/:id", [authenticateToken, isAdmin], materiaController.getMateriaByIdProfe);//PARA ADMINS PONES EL ID DE PROFE QUE QUERES VER

router.get("/", materiaController.getAllMaterias);
router.get("/:id", materiaController.getMateriaById);

module.exports = router;