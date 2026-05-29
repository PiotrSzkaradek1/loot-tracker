const db = require('../db');

const getAllBosses = async (req, res) => {
  try {
    const result = await db.query(
      `
      SELECT id, name, tier, min_syng, max_syng, dungeon_id 
      FROM bosses 
      ORDER BY id ASC
      `
    );
    res.json(result.rows);
  } catch (err) {
    console.error("Błąd podczas pobierania bossów:", err);
    res.status(500).json({ message: "Błąd serwera" });
  }
};

const getDungeons = async (req, res) => {
  try {
    const result = await db.query("SELECT * FROM dungeons ORDER BY id ASC");
    res.json(result.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd serwera podczas pobierania dungeonów" });
  }
};

module.exports = {
  getAllBosses,
  getDungeons
};