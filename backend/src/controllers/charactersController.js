const db = require("../db");

const getAllCharacters = async (req, res) => {
  try {
    const result = await db.query('SELECT * FROM characters');
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};
const getCharactersByUserId = async (req, res) => {
  const userId = parseInt(req.params.user_id);

  if (isNaN(userId)) {
    return res.status(400).json({ message: "Invalid user_id" });
  }

  try {
    const result = await db.query(
      "SELECT * FROM characters WHERE user_id = $1",
      [userId]
    );

    if (result.rows.length === 0) {
      return res.status(404).json({ message: "No characters found" });
    }

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error", error: err.message });
  }
};

const getCharactersByUser = async (req, res) => {
  const userId = req.user.id;

  try {
    const result = await db.query(
      "SELECT * FROM characters WHERE user_id = $1",
      [userId]
    );

    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};


const getCharactersGroupByLevel = async (req, res) => {
  try {
    const result = await db.query(`SELECT level, COUNT(*) 
    FROM characters
    GROUP BY level
    ORDER BY level;
    `);
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'Server error' });
  }
};

const addCharacter = async (req, res) => {
  const userId = req.user.id;
  const { name, level, profession, server } = req.body;

  if (!name || !level || !profession || !server) {
    return res.status(400).json({ message: "Brak wymaganych pól" });
  }

  try {
    const result = await db.query(
      `INSERT INTO characters (user_id, name, level, profession, server)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [userId, name, level, profession, server]
    );

    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd serwera" });
  }
};


module.exports = { 
  getAllCharacters,
  getCharactersByUserId,
  getCharactersGroupByLevel,
  addCharacter,
  getCharactersByUser
  };
