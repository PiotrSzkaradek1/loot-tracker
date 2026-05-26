const jwt = require("jsonwebtoken");
const bcrypt = require("bcrypt");
const db = require("../db");

const SECRET = process.env.JWT_SECRET || "secret";

// Funkcja generująca token
function signToken(payload) {
  return jwt.sign(payload, SECRET, { expiresIn: "1h" });
}

// Endpoint logowania
async function login(req, res) {
  const { email, password } = req.body;

  try {
    const result = await db.query("SELECT * FROM users WHERE email = $1", [email]);
    const user = result.rows[0];

    if (!user) return res.status(401).json({ message: "Nieprawidłowy email lub hasło" });

    const validPassword = await bcrypt.compare(password, user.password_hash);
    if (!validPassword) return res.status(401).json({ message: "Nieprawidłowy email lub hasło" });

    const token = signToken({ id: user.id, role: user.role });
    res.json({ token });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd serwera" });
  }
}

// Endpoint profilu
async function getProfile(req, res) {
  try {
    const result = await db.query(
      "SELECT id, email, role, created_at FROM users WHERE id = $1",
      [req.user.id]
    );
    const user = result.rows[0];
    if (!user) return res.status(404).json({ message: "Nie znaleziono użytkownika" });

    res.json(user);
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd serwera" });
  }
}

// Endpoint rejestracji
async function createUser(req, res) {
      const { email, password, role } = req.body;

  if (!email || !password || !role) {
    return res.status(400).json({ message: "Podaj email, hasło i rolę" });
  }


  try {

    const existingUser = await db.query(
      "SELECT id FROM users WHERE email = $1",
      [email]
    );

    if (existingUser.rows.length > 0) {
      return res.status(409).json({
        message: "Użytkownik z takim adresem email już istnieje",
      });
    }
    // Hashowanie hasła
    const password_hash = await bcrypt.hash(password, 10);

    // Wstawienie do bazy
    const result = await db.query(
      "INSERT INTO users (email, password_hash, role) VALUES ($1, $2, $3) RETURNING id, email, role",
      [email, password_hash, role]
    );

    res.status(201).json({ user: result.rows[0] });
  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Błąd serwera" });
  }
}

module.exports = { login, getProfile, createUser };
