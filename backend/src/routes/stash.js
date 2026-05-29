const express = require("express");
const router = express.Router();
const { getStashInitData, getStashStats } = require("../controllers/stashController");
const authMiddleware = require("../middleware/authMiddleware");

// Pobieranie listy postaci i spisu struktur dungeon/boss pod selektory
router.get("/init", authMiddleware, getStashInitData);

// Pobieranie statystyk przefiltrowanych na podstawie parametrów query
router.get("/stats", authMiddleware, getStashStats);

module.exports = router;