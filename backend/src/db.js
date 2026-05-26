const { Pool } = require("pg");

const pool = new Pool({
  user: "postgres",
  host: "db",
  database: "db_admin",
  password: "haslo",
  port: 5432,
});

const query = (text, params) => pool.query(text, params);

module.exports = { query };
