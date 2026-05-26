const db = require("../db");

/*GET /api/history?characterId=...&bossId=...&difficulty=...*/
async function getHistory(req, res) {
  try {
    const userId = req.user.id;
    const { characterId, bossId, difficulty } = req.query;

    if (!characterId || !bossId || !difficulty) {
      return res.status(400).json({
        message: "Brakuje parametrów"
      });
    }

    /* ===== GOLD ===== */
    const goldResult = await db.query(
      `
      SELECT COALESCE(SUM(g.amount), 0) AS total
      FROM records r
      JOIN characters c ON r.character_id = c.id
      LEFT JOIN record_gold g ON g.record_id = r.id
      WHERE
        c.user_id = $1
        AND r.character_id = $2
        AND r.boss_id = $3
        AND r.difficulty = $4
      `,
      [userId, characterId, bossId, difficulty]
    );

    /* ===== ITEMS ===== */
    const itemsResult = await db.query(
      `
      SELECT i.name, SUM(ri.amount) AS total
      FROM records r
      JOIN characters c ON r.character_id = c.id
      JOIN record_items ri ON ri.record_id = r.id
      JOIN items i ON i.id = ri.item_id
      WHERE
        c.user_id = $1
        AND r.character_id = $2
        AND r.boss_id = $3
        AND r.difficulty = $4
      GROUP BY i.name
      ORDER BY i.name
      `,
      [userId, characterId, bossId, difficulty]
    );

    /* ===== RARS ===== */
    const rarsResult = await db.query(
      `
      SELECT ra.name, rr.quality, COUNT(*) AS total
      FROM records r
      JOIN characters c ON r.character_id = c.id
      JOIN record_rars rr ON rr.record_id = r.id
      JOIN rars ra ON ra.id = rr.rar_id
      WHERE
        c.user_id = $1
        AND r.character_id = $2
        AND r.boss_id = $3
        AND r.difficulty = $4
      GROUP BY ra.name, rr.quality
      ORDER BY ra.name, rr.quality
      `,
      [userId, characterId, bossId, difficulty]
    );

    /* ===== SYNERGETICS ===== */
    const syngResult = await db.query(
      `
      SELECT rs.tier AS quality, COUNT(*) AS total
      FROM records r
      JOIN characters c ON r.character_id = c.id
      JOIN record_synergetics rs ON rs.record_id = r.id
      WHERE
        c.user_id = $1
        AND r.character_id = $2
        AND r.boss_id = $3
        AND r.difficulty = $4
      GROUP BY rs.tier
      ORDER BY rs.tier
      `,
      [userId, characterId, bossId, difficulty]
    );

    /* ===== DRIFS ===== */
    const drifsResult = await db.query(
      `
      SELECT d.name, rd.tier, COUNT(*) AS total
      FROM records r
      JOIN characters c ON r.character_id = c.id
      JOIN record_drifs rd ON rd.record_id = r.id
      JOIN drifs d ON d.id = rd.drif_id
      WHERE
        c.user_id = $1
        AND r.character_id = $2
        AND r.boss_id = $3
        AND r.difficulty = $4
      GROUP BY d.name, rd.tier
      ORDER BY d.name, rd.tier
      `,
      [userId, characterId, bossId, difficulty]
    );

    res.json({
      totalGold: goldResult.rows[0].total,
      items: itemsResult.rows,
      rars: rarsResult.rows,
      syngs: syngResult.rows,
      drifs: drifsResult.rows
    });

  } catch (err) {
    console.error("History error:", err);
    res.status(500).json({ message: "Błąd serwera" });
  }
}

module.exports = {
  getHistory
};
