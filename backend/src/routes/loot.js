const express = require("express");
const router = express.Router();
const {getLootData, saveLoot} = require("../controllers/lootController")

const authMiddleware = require("../middleware/authMiddleware");


/**
 * @swagger
 * tags:
 *   name: Loot
 *   description: Endpoints for retrieving and saving loot
 */

/**
 * @swagger
 * /api/loot/loot-data:
 *   get:
 *     summary: Get loot data for a boss and the user's last character
 *     tags: [Loot]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: query
 *         name: bossId
 *         schema:
 *           type: integer
 *         required: true
 *         description: ID of the boss
 *     responses:
 *       200:
 *         description: Loot data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 boss:
 *                   type: object
 *                 character:
 *                   type: object
 *                 bossData:
 *                   type: object
 *                   properties:
 *                     min_syng:
 *                       type: integer
 *                     max_syng:
 *                       type: integer
 *                     tier:
 *                       type: string
 *                 items:
 *                   type: array
 *                   items:
 *                     type: object
 *                 rars:
 *                   type: array
 *                   items:
 *                     type: object
 *                 drifs:
 *                   type: array
 *                   items:
 *                     type: object
 *       400:
 *         description: Missing bossId or no characters for user
 *       404:
 *         description: Boss not found
 *       500:
 *         description: Server error
 */
router.get("/loot-data", authMiddleware, getLootData);

/**
 * @swagger
 * /api/loot/records:
 *   post:
 *     summary: Save loot for a boss fight
 *     tags: [Loot]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               boss:
 *                 type: object
 *               character:
 *                 type: object
 *               gold:
 *                 type: integer
 *               tracks:
 *                 type: array
 *                 items:
 *                   type: object
 *               items:
 *                 type: object
 *               cart:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     type:
 *                       type: string
 *                       enum: [rar, syng, drif]
 *                     id:
 *                       type: integer
 *                     quality:
 *                       type: string
 *                     tier:
 *                       type: string
 *     responses:
 *       200:
 *         description: Loot saved successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                 recordId:
 *                   type: integer
 *       500:
 *         description: Failed to save loot
 */
router.post("/records", authMiddleware, saveLoot);


module.exports = router;