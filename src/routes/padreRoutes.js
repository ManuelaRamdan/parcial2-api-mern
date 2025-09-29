const express = require("express");
const router = express.Router();

const padreController = require("./../controllers/padreController");

// CRUD
router.get("/:id", padreController.getAllHijos);

module.exports = router;