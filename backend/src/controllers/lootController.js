const db = require("../db");

/* ================= GET DATA ================= */
const getLootData = async (req, res) => {
  try {
    const userId = req.user.id;
    const { dungeonId } = req.query; // Odbieramy ?dungeonId=X z frontendu

    if (!dungeonId) {
      return res.status(400).json({ message: "Brak parametru dungeonId" });
    }

    /* 1. Pobieramy ostatnią postać użytkownika */
    const charRes = await db.query(
      `SELECT * FROM characters WHERE user_id = $1 ORDER BY created_at DESC LIMIT 1`,
      [userId]
    );
    if (!charRes.rows.length) {
      return res.status(400).json({ message: "Brak stworzonych postaci" });
    }
    const character = charRes.rows[0];

    /* 2. Pobieramy dane wybranego dungeona */
    const dungeonRes = await db.query(
      `SELECT * FROM dungeons WHERE id = $1`,
      [dungeonId]
    );
    if (!dungeonRes.rows.length) {
      return res.status(404).json({ message: "Dungeon nie istnieje" });
    }
    const dungeon = dungeonRes.rows[0];

    /* 3. Pobieramy WSZYSTKICH bossów przypisanych do tego dungeona */
    const bossesRes = await db.query(
      `SELECT * FROM bosses WHERE dungeon_id = $1 ORDER BY id ASC`,
      [dungeonId]
    );
    const bosses = bossesRes.rows;

    // Jeśli dungeon jest pusty i nie ma bossów, zwracamy pustą strukturę
    if (!bosses.length) {
      return res.json({ character, dungeon, bosses: [], items: {}, rars: {}, drifs: [] });
    }

    // Wyciągamy tablicę ID wszystkich bossów z tego dungeona (np. [1, 2])
    const bossIds = bosses.map(b => b.id);

    /* 4. Pobieramy przedmioty (items) dla wszystkich tych bossów na raz */
    const itemsRes = await db.query(
      `
      SELECT i.*, bi.boss_id
      FROM items i
      JOIN boss_items bi ON i.id = bi.item_id
      WHERE bi.boss_id = ANY($1)
      `,
      [bossIds]
    );

    /* 5. Pobieramy rary dla wszystkich tych bossów na raz */
    const rarsRes = await db.query(
      `SELECT * FROM rars WHERE boss_id = ANY($1)`,
      [bossIds]
    );

    /* 6. Drify (są globalne dla całej gry) */
    const drifsRes = await db.query(`SELECT * FROM drifs`);

    // Grupowanie przedmiotów i rarów po boss_id, żeby frontend miał super łatwo
    const itemsByBoss = {};
    const rarsByBoss = {};

    bossIds.forEach(id => {
      itemsByBoss[id] = itemsRes.rows.filter(item => item.boss_id === id);
      rarsByBoss[id] = rarsRes.rows.filter(rar => rar.boss_id === id);
    });

    // Wysyłamy kompletną paczkę danych do LootingView
    res.json({
      character,
      dungeon,
      bosses,
      items: itemsByBoss,
      rars: rarsByBoss,
      drifs: drifsRes.rows
    });

  } catch (err) {
    console.error("Błąd w getLootData:", err);
    res.status(500).json({ message: "Błąd pobierania danych dungeona" });
  }
};

/* ================= SAVE ================= */
const saveLoot = async (req, res) => {
  try {
    const userId = req.user.id;
    const { boss, character, gold, tracks, items, cart } = req.body;

    // Rozpocznij transakcję
    await db.query("BEGIN");

    // 1. GLÓWNY REKORD (RECORDS)
    const recordRes = await db.query(
      `
      INSERT INTO records (character_id, boss_id, difficulty)
      VALUES ($1, $2, $3)
      RETURNING id
      `,
      [character.id, boss.id, boss.difficulty || "Normal"]
    );

    const recordId = recordRes.rows[0].id;

    // 2. ZŁOTO (Zapisujemy tylko jeśli gracz coś zebrał)
    if (gold > 0) {
      await db.query(
        `INSERT INTO record_gold (record_id, amount) VALUES ($1, $2)`,
        [recordId, gold]
      );
    }

    // 3. TROPY (Zapis do nowej tabeli record_tracks)
    if (tracks > 0) {
      await db.query(
        `INSERT INTO record_tracks (record_id, amount) VALUES ($1, $2)`,
        [recordId, tracks]
      );
    }

    // 4. PRZEDMIOTY ZWYKŁE (ITEMS)
    for (const itemId in items) {
      const amount = items[itemId];
      if (amount > 0) {
        await db.query(
          `INSERT INTO record_items (record_id, item_id, amount) VALUES ($1, $2, $3)`,
          [recordId, itemId, amount]
        );
      }
    }

    // 5. KOSZYK (RARY / SYNG / DRIFS)
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

    // Zatwierdzenie całej transakcji w bazie danych
    await db.query("COMMIT");

    res.json({ message: "Loot zapisany", recordId });
  } catch (err) {
    // Jeśli jakikolwiek INSERT się wyłoży, cofnięcie transakcji
    await db.query("ROLLBACK");
    console.error(err);
    res.status(500).json({ message: "Nie udało się zapisać loota" });
  }
};

module.exports = { getLootData, saveLoot };