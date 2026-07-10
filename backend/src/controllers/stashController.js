const db = require("../db");

/**
 * Pobiera dane inicjalizacyjne dla widoku Stash
 */
const getStashInitData = async (req, res) => {
  try {
    const userId = req.user.id;

    const charactersRes = await db.query(
      `SELECT id, name, level, profession, server FROM characters WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );

    const dungeonsRes = await db.query(
      `SELECT id, name, has_easy, has_normal, has_hard FROM dungeons ORDER BY id ASC`
    );

    const bossesRes = await db.query(
      `SELECT id, name, dungeon_id, tier FROM bosses ORDER BY id ASC`
    );

    const dungeons = dungeonsRes.rows.map(dungeon => {
      return {
        ...dungeon,
        bosses: bossesRes.rows.filter(boss => boss.dungeon_id === dungeon.id)
      };
    });

    res.json({
      characters: charactersRes.rows,
      dungeons
    });
  } catch (err) {
    console.error("Błąd w getStashInitData:", err);
    res.status(500).json({ message: "Błąd pobierania danych inicjalizacyjnych magazynu" });
  }
};

/**
 * Pobiera zagregowane statystyki lootu oraz podciąga spersonalizowany cennik użytkownika
 */
const getStashStats = async (req, res) => {
  try {
    const { characterId, difficulty, bossId, dungeonId } = req.query;
    const userId = req.user.id;

    if (!characterId || !difficulty) {
      return res.status(400).json({ message: "Brak wymaganych parametrów (characterId, difficulty)" });
    }

    if (!bossId && !dungeonId) {
      return res.status(400).json({ message: "Musisz podać bossId lub dungeonId" });
    }

    // 0. Wyciągamy nazwę serwera wybranej postaci, by dopasować ceny
    const charRes = await db.query("SELECT server FROM characters WHERE id = $1 AND user_id = $2", [characterId, userId]);
    if (charRes.rows.length === 0) {
      return res.status(404).json({ message: "Postać nie należy do zalogowanego użytkownika" });
    }
    const serverName = charRes.rows[0].server;

    // Budujemy dynamiczny warunek WHERE na podstawie filtrów z frontendu
    let filterQuery = "WHERE r.character_id = $1 AND LOWER(r.difficulty) = $2";
    const queryParams = [characterId, difficulty.toLowerCase()];

    if (bossId) {
      filterQuery += " AND r.boss_id = $3";
      queryParams.push(bossId);
    } else {
      filterQuery += " AND b.dungeon_id = $3";
      queryParams.push(dungeonId);
    }

    // 1. Ogólne statystyki: Liczba zabójstw, suma złota, suma tropów
    const generalStatsRes = await db.query(
      `
      SELECT 
        COUNT(DISTINCT r.id)::int as total_kills,
        COALESCE(SUM(rg.amount), 0)::int as total_gold,
        COALESCE(SUM(rt.amount), 0)::int as total_tracks
      FROM records r
      JOIN bosses b ON r.boss_id = b.id
      LEFT JOIN record_gold rg ON r.id = rg.record_id
      LEFT JOIN record_tracks rt ON r.id = rt.record_id
      ${filterQuery}
      `,
      queryParams
    );

    const stats = generalStatsRes.rows[0];

    if (stats.total_kills === 0) {
      return res.json({
        general: stats,
        items: [],
        rars: [],
        synergetics: [],
        drifs: []
      });
    }

    // Przygotowanie niezależnych parametrów dla kolejnych zapytań (zapobiega konfliktom indeksów $1, $2...)
    // Kolejność w tablicy poniżej: $1 = characterId, $2 = difficulty, $3 = (bossId LUL dungeonId), $4 = userId, $5 = serverName
    const extendedParams = [...queryParams, userId, serverName];
    const itemFilterCondition = bossId ? "AND r.boss_id = $3" : "AND b.dungeon_id = $3";

    // 2. Zagregowane przedmioty zwykłe + CENA
    const itemsRes = await db.query(
      `
      SELECT 
        ri.item_id, 
        i.name, 
        SUM(ri.amount)::int as total_amount,
        COALESCE(up.price, 0)::int as price
      FROM record_items ri
      JOIN records r ON ri.record_id = r.id
      JOIN bosses b ON r.boss_id = b.id
      JOIN items i ON ri.item_id = i.id
      LEFT JOIN user_pricelists up ON up.item_id = ri.item_id 
                                  AND up.user_id = $4 
                                  AND up.server = $5
      WHERE r.character_id = $1 AND LOWER(r.difficulty) = $2 ${itemFilterCondition}
      GROUP BY ri.item_id, i.name, up.price
      ORDER BY total_amount DESC
      `,
      extendedParams
    );

    // 3. Zagregowane rary + CENA
    const rarsRes = await db.query(
      `
      SELECT 
        rr.rar_id, 
        r_dict.name, 
        rr.quality, 
        COUNT(*)::int as count,
        COALESCE(up.price, 0)::int as price
      FROM record_rars rr
      JOIN records r ON rr.record_id = r.id
      JOIN bosses b ON r.boss_id = b.id
      JOIN rars r_dict ON rr.rar_id = r_dict.id
      LEFT JOIN user_pricelists up ON up.item_id = rr.rar_id 
                                  AND up.user_id = $4 
                                  AND up.server = $5
      WHERE r.character_id = $1 AND LOWER(r.difficulty) = $2 ${itemFilterCondition}
      GROUP BY rr.rar_id, r_dict.name, rr.quality, up.price
      ORDER BY r_dict.name ASC, rr.quality DESC
      `,
      extendedParams
    );

    // 4. Zagregowane synergetyki + CENA
    const synergeticsRes = await db.query(
      `
      SELECT 
        rs.tier, 
        COUNT(*)::int as count,
        COALESCE(up.price, 0)::int as price
      FROM record_synergetics rs
      JOIN records r ON rs.record_id = r.id
      JOIN bosses b ON r.boss_id = b.id
      LEFT JOIN user_pricelists up ON up.item_id = rs.tier 
                                  AND up.user_id = $4 
                                  AND up.server = $5
      WHERE r.character_id = $1 AND LOWER(r.difficulty) = $2 ${itemFilterCondition}
      GROUP BY rs.tier, up.price
      ORDER BY rs.tier DESC
      `,
      extendedParams
    );

    // 5. Zagregowane drify + CENA
    const drifsRes = await db.query(
      `
      SELECT 
        rd.drif_id, 
        d.name, 
        rd.tier, 
        COUNT(*)::int as count,
        COALESCE(up.price, 0)::int as price
      FROM record_drifs rd
      JOIN records r ON rd.record_id = r.id
      JOIN bosses b ON r.boss_id = b.id
      JOIN drifs d ON rd.drif_id = d.id
      LEFT JOIN user_pricelists up ON up.item_id = rd.drif_id 
                                  AND up.user_id = $4 
                                  AND up.server = $5
      WHERE r.character_id = $1 AND LOWER(r.difficulty) = $2 ${itemFilterCondition}
      GROUP BY rd.drif_id, d.name, rd.tier, up.price
      ORDER BY d.name ASC, rd.tier DESC
      `,
      extendedParams
    );

    res.json({
      general: stats,
      items: itemsRes.rows,
      rars: rarsRes.rows,
      synergetics: synergeticsRes.rows,
      drifs: drifsRes.rows
    });

  } catch (err) {
    console.error("Błąd w getStashStats:", err);
    res.status(500).json({ message: "Błąd generowania statystyk magazynu" });
  }
};

module.exports = {
  getStashInitData,
  getStashStats
};