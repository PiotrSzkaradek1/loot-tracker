const db = require("../db");

/**
 * Pobiera absolutnie wszystkie przedmioty z tabeli items
 */
const getItemsList = async (req, res) => {
  try {
    const result = await db.query("SELECT id, name FROM public.items ORDER BY name ASC");
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error("Błąd w getItemsList:", err);
    return res.status(500).json({ message: "Nie udało się pobrać przedmiotów z bazy danych" });
  }
};

/**
 * Pobiera ceny użytkownika przefiltrowane po wybranym serwerze
 */
const getUserPrices = async (req, res) => {
  const userId = req.user.id;
  const { server } = req.query; // Pobieramy serwer przekazany w query stringu (?server=...)

  if (!server) {
    return res.status(400).json({ message: "Parametr 'server' jest wymagany" });
  }

  try {
    const result = await db.query(
      "SELECT item_id, price FROM public.user_pricelists WHERE user_id = $1 AND server = $2",
      [userId, server]
    );
    return res.status(200).json(result.rows);
  } catch (err) {
    console.error("Błąd w getUserPrices:", err);
    return res.status(500).json({ message: "Błąd podczas pobierania cen użytkownika" });
  }
};

/**
 * Masowy zapis lub aktualizacja (Upsert) cen przedmiotów dla danego serwera
 */
const savePricesBulk = async (req, res) => {
  const userId = req.user.id;
  const { server, prices } = req.body; 
  // Oczekujemy struktury: { server: 'Thanar', prices: [{ item_id: 1, price: 100 }, ...] }

  if (!server || !prices || !Array.isArray(prices)) {
    return res.status(400).json({ message: "Niepoprawny format danych żądania" });
  }

  try {
    await db.query("BEGIN");

    for (const entry of prices) {
      const { item_id, price } = entry;
      
      // UPSERT bazujący na kluczu unique_user_server_item
      await db.query(
        `INSERT INTO public.user_pricelists (user_id, server, item_id, price)
         VALUES ($1, $2, $3, $4)
         ON CONFLICT (user_id, server, item_id)
         DO UPDATE SET price = EXCLUDED.price`,
        [userId, server, item_id, price]
      );
    }

    await db.query("COMMIT");
    return res.status(200).json({ message: "Cennik serwera został pomyślnie zaktualizowany" });
  } catch (err) {
    await db.query("ROLLBACK");
    console.error("Błąd w savePricesBulk:", err);
    return res.status(500).json({ message: "Wewnętrzny błąd serwera podczas zapisu zmian" });
  }
};

module.exports = {
  getItemsList,
  getUserPrices,
  savePricesBulk
};