const express = require('express');
const router = express.Router();
const bossesController = require('../controllers/bossesController');
const authMiddleware = require('../middleware/authMiddleware');

router.get('/', authMiddleware, bossesController.getAllBosses);
router.get("/dungeons", authMiddleware, bossesController.getDungeons);

module.exports = router;