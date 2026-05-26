const db = require('../db');

const getAllBosses = async (req, res) => {
  try {
    const queryText = `
      SELECT id, name, tier, min_syng, max_syng, has_easy, has_normal, has_hard 
      FROM bosses 
      ORDER BY id ASC
    `;
    
    const result = await db.query(queryText);
    
    res.json(result.rows);
  } catch (error) {
    console.error('Błąd podczas pobierania bossów:', error);
    res.status(500).json({ message: 'Błąd serwera podczas pobierania listy bossów' });
  }
};

module.exports = {
  getAllBosses
};