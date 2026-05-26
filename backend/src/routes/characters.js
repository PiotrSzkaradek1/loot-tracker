const express = require("express");
const router = express.Router();
const { getAllCharacters, getCharactersByUserId, getCharactersGroupByLevel, addCharacter, getCharactersByUser } = require("../controllers/charactersController");
const authMiddleware = require("../middleware/authMiddleware");


/**
 * @swagger
 * tags:
 *   name: Characters
 *   description: Characters management
 */

/**
 * @swagger
 * /api/characters/me:
 *   get:
 *     summary: Get characters of logged user
 *     tags: [Characters]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of user characters
 *       401:
 *         description: Unauthorized
 */
router.get("/me", authMiddleware, getCharactersByUser);


/**
 * @swagger
 * /api/characters/group/level:
 *   get:
 *     summary: Get number of characters grouped by level
 *     tags: [Characters]
 *     responses:
 *       200:
 *         description: Characters grouped by level
 */
router.get("/group/level", getCharactersGroupByLevel);


/**
 * @swagger
 * /api/characters:
 *   get:
 *     summary: Get all characters
 *     tags: [Characters]
 *     responses:
 *       200:
 *         description: List of all characters
 */
router.get('/', getAllCharacters);


/**
 * @swagger
 * /api/characters/{user_id}:
 *   get:
 *     summary: Get characters by user ID
 *     tags: [Characters]
 *     parameters:
 *       - in: path
 *         name: user_id
 *         schema:
 *           type: integer
 *         required: true
 *         description: User ID
 *     responses:
 *       200:
 *         description: List of characters
 *       400:
 *         description: Invalid ID
 *       404:
 *         description: Not found
 */
router.get("/:user_id", getCharactersByUserId);


/**
 * @swagger
 * /api/characters:
 *   post:
 *     summary: Create new character
 *     tags: [Characters]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - name
 *               - level
 *               - profession
 *               - server
 *             properties:
 *               name:
 *                 type: string
 *               level:
 *                 type: integer
 *               profession:
 *                 type: string
 *               server:
 *                 type: string
 *     responses:
 *       201:
 *         description: Character created
 *       400:
 *         description: Missing fields
 *       401:
 *         description: Unauthorized
 */
router.post("/", authMiddleware, addCharacter);

module.exports = router;
