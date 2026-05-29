const db = require("../db");

/**
 * Pobiera dane inicjalizacyjne dla widoku Stash:
 * - Wszystkie postacie zalogowanego użytkownika
 * - Wszystkie dungeony wraz z przypisanymi do nich bossami
 */
const getStashInitData = async (req, res) => {
  try {
    const userId = req.user.id;

    // 1. Pobieramy postacie użytkownika
    const charactersRes = await db.query(
      `SELECT id, name, level, profession, server FROM characters WHERE user_id = $1 ORDER BY created_at DESC`,
      [userId]
    );

    // 2. Pobieramy dungeony
    const dungeonsRes = await db.query(
      `SELECT id, name, has_easy, has_normal, has_hard FROM dungeons ORDER BY id ASC`
    );

    // 3. Pobieramy bossów
    const bossesRes = await db.query(
      `SELECT id, name, dungeon_id, tier FROM bosses ORDER BY id ASC`
    );

    // Mapujemy bossów do odpowiednich dungeonów, aby frontend miał gotową strukturę
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
 * Pobiera zagregowane statystyki lootu dla wybranej postaci, poziomu trudności
 * oraz konkretnego bossa LUB całego dungeona.
 */
const getStashStats = async (req, res) => {
  try {
    const { characterId, difficulty, bossId, dungeonId } = req.query;

    if (!characterId || !difficulty) {
      return res.status(400).json({ message: "Brak wymaganych parametrów (characterId, difficulty)" });
    }

    if (!bossId && !dungeonId) {
      return res.status(400).json({ message: "Musisz podać bossId lub dungeonId" });
    }

    // Przygotowanie warunku filtrującego w SQL dla bossów/dungeonów
    let filterQuery = "";
    const queryParams = [characterId, difficulty.toLowerCase()];

    if (bossId) {
      filterQuery = "AND r.boss_id = $3";
      queryParams.push(bossId);
    } else {
      // Jeśli sprawdzamy cały dungeon, filtrujemy po podległych mu bossach
      filterQuery = "AND b.dungeon_id = $3";
      queryParams.push(dungeonId);
    }

    // 1. Ogólne statystyki: Liczba zabójstw (rekordów), suma złota, suma tropów
    // Robimy LEFT JOIN, bo w niektórych zabójstwach mogło nie spaść złoto lub tropy
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
      WHERE r.character_id = $1 AND LOWER(r.difficulty) = $2
      ${filterQuery}
      `,
      queryParams
    );

    const stats = generalStatsRes.rows[0];

    // Jeśli nie ma żadnych wpisów (0 zabójstw), zwracamy czystą strukturę bez odpytywania o przedmioty
    if (stats.total_kills === 0) {
      return res.json({
        general: stats,
        items: [],
        rars: [],
        synergetics: [],
        drifs: []
      });
    }

    // Sub-zapytanie identyfikujące ID rekordów należących do tej grupy (ułatwi nam kolejne zapytania)
    const baseRecordsQuery = `
      SELECT r.id 
      FROM records r
      JOIN bosses b ON r.boss_id = b.id
      WHERE r.character_id = $1 AND LOWER(r.difficulty) = $2
      ${filterQuery}
    `;

    // 2. Zagregowane przedmioty zwykłe (items) wraz z nazwami
    const itemsRes = await db.query(
      `
      SELECT ri.item_id, i.name, SUM(ri.amount)::int as total_amount
      FROM record_items ri
      JOIN items i ON ri.item_id = i.id
      WHERE ri.record_id IN (${baseRecordsQuery})
      GROUP BY ri.item_id, i.name
      ORDER BY total_amount DESC
      `,
      queryParams
    );

    // 3. Zagregowane rary (rars) wraz z jakością i nazwami
    const rarsRes = await db.query(
      `
      SELECT rr.rar_id, r.name, rr.quality, COUNT(*)::int as count
      FROM record_rars rr
      JOIN rars r ON rr.rar_id = r.id
      WHERE rr.record_id IN (${baseRecordsQuery})
      GROUP BY rr.rar_id, r.name, rr.quality
      ORDER BY r.name ASC, rr.quality DESC
      `,
      queryParams
    );

    // 4. Zagregowane synergetyki (synergetics)
    const synergeticsRes = await db.query(
      `
      SELECT rs.tier, COUNT(*)::int as count
      FROM record_synergetics rs
      WHERE rs.record_id IN (${baseRecordsQuery})
      GROUP BY rs.tier
      ORDER BY rs.tier DESC
      `,
      queryParams
    );

    // 5. Zagregowane drify (drifs) wraz z nazwami
    const drifsRes = await db.query(
      `
      SELECT rd.drif_id, d.name, rd.tier, COUNT(*)::int as count
      FROM record_drifs rd
      JOIN drifs d ON rd.drif_id = d.id
      WHERE rd.record_id IN (${baseRecordsQuery})
      GROUP BY rd.drif_id, d.name, rd.tier
      ORDER BY d.name ASC, rd.tier DESC
      `,
      queryParams
    );

    // Zwracamy pełną paczkę analityczną
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