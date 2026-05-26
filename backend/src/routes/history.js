const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {getHistory} = require("../controllers/historyController");


/**
 * @swagger
 * tags:
 *   name: History
 *   description: Endpoints for retrieving loot history per character, boss, and difficulty
 */

/**
 * @swagger
 * /api/history:
 *   get:
 *     summary: Get loot history for a specific character and boss
 *     tags: [History]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: characterId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the character
 *       - in: query
 *         name: bossId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the boss
 *       - in: query
 *         name: difficulty
 *         schema:
 *           type: string
 *           enum: [Easy, Normal, Hard]
 *         required: true
 *         description: Difficulty level of the fight
 *     responses:
 *       200:
 *         description: Loot history successfully retrieved
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 totalGold:
 *                   type: integer
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       total:
 *                         type: integer
 *                 rars:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       quality:
 *                         type: string
 *                       total:
 *                         type: integer
 *                 syngs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       quality:
 *                         type: string
 *                       total:
 *                         type: integer
 *                 drifs:
 *                   type: array
 *                   items:
 *                     type: object
 *                     properties:
 *                       name:
 *                         type: string
 *                       tier:
 *                         type: string
 *                       total:
 *                         type: integer
 *       400:
 *         description: Missing query parameters
 *       401:
 *         description: Unauthorized - missing or invalid token
 *       500:
 *         description: Server error
 */
router.get("/", authMiddleware, getHistory);

module.exports = router;
