const db = require("../db");


/* ================= GET DATA ================= */

const getLootData = async (req, res) => {

  try {

    const userId = req.user.id;

    /* Ostatnia postać użytkownika */

    const charRes = await db.query(
      `
      SELECT *
      FROM characters
      WHERE user_id = $1
      ORDER BY created_at DESC
      LIMIT 1
      `,
      [userId]
    );

    if (!charRes.rows.length) {
      return res.status(400).json({ message: "Brak postaci" });
    }

    const character = charRes.rows[0];


    /* Boss (na razie losowy / pierwszy) */


    const bossId = req.query.bossId;

    if (!bossId) {
    return res.status(400).json({
        message: "Brak bossId"
    });
    }

    const bossRes = await db.query(
    `SELECT * FROM bosses WHERE id = $1`,
    [bossId]
    );

    if (!bossRes.rows.length) {
    return res.status(404).json({
        message: "Boss nie istnieje"
    });
    }

    const boss = bossRes.rows[0];


    /* Dane bossa */

    const bossData = {
      min_syng: boss.min_syng,
      max_syng: boss.max_syng,
      tier: boss.tier
    };


    /* Itemy bossa */

    const itemsRes = await db.query(
      `
      SELECT i.*
      FROM items i
      JOIN boss_items bi ON i.id = bi.item_id
      WHERE bi.boss_id = $1
      `,
      [boss.id]
    );


    /* Rary */

    const rarsRes = await db.query(
      `
      SELECT *
      FROM rars
      WHERE boss_id = $1
      `,
      [boss.id]
    );


    /* Drify */

    const drifsRes = await db.query(
      `SELECT * FROM drifs`
    );


    res.json({

      boss,
      character,

      bossData,

      items: itemsRes.rows,
      rars: rarsRes.rows,
      drifs: drifsRes.rows

    });

  }
  catch (err) {

    console.error(err);

    res.status(500).json({
      message: "Błąd pobierania danych"
    });

  }

};

/* ================= SAVE ================= */

const saveLoot = async (req, res) => {
  try {
    const userId = req.user.id;

    const { boss, character, gold, tracks, items, cart } = req.body;

    // Rozpocznij transakcję
    await db.query("BEGIN");

    // RECORD
    const recordRes = await db.query(
      `
      INSERT INTO records (character_id, boss_id, difficulty)
      VALUES ($1, $2, $3)
      RETURNING id
      `,
      [character.id, boss.id, boss.difficulty || "normal"]
    );

    const recordId = recordRes.rows[0].id;

    // GOLD
    await db.query(
      `INSERT INTO record_gold (record_id, amount) VALUES ($1, $2)`,
      [recordId, gold]
    );

    // ITEMS
    for (const itemId in items) {
      const amount = items[itemId];
      if (amount > 0) {
        await db.query(
          `INSERT INTO record_items (record_id, item_id, amount) VALUES ($1, $2, $3)`,
          [recordId, itemId, amount]
        );
      }
    }

    // CART (RARS / SYNG / DRIFS)
    for (const el of cart) {
      if (el.type === "rar") {
        await db.query(
          `INSERT INTO record_rars (record_id, rar_id, quality) VALUES ($1, $2, $3)`,
          [recordId, el.id, el.quality]
        );
      }
      if (el.type === "syng") {
        await db.query(
          `INSERT INTO record_synergetics (record_id, tier) VALUES ($1, $2)`,
          [recordId, el.quality]
        );
      }
      if (el.type === "drif") {
        await db.query(
          `INSERT INTO record_drifs (record_id, drif_id, tier) VALUES ($1, $2, $3)`,
          [recordId, el.id, el.tier]
        );
      }
    }

    // Zatwierdzenie transakcji
    await db.query("COMMIT");

    res.json({ message: "Loot zapisany", recordId });
  } catch (err) {
    // Wycofanie transakcji w razie błędu
    await db.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ message: "Nie udało się zapisać loota" });
  }
};


module.exports = {getLootData, saveLoot}