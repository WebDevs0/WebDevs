const pool = require("../db/pool");

async function findByEmail(email) {
  const { rows } = await pool.query(
    "SELECT id, first_name, last_name, email, password_hash, role FROM users WHERE email = $1",
    [email]
  );
  return rows[0] || null;
}

async function createUser({ firstName, lastName, email, passwordHash }) {
  const { rows } = await pool.query(
    `INSERT INTO users (first_name, last_name, email, password_hash)
     VALUES ($1, $2, $3, $4)
     RETURNING id, first_name, last_name, email, role`,
    [firstName, lastName, email, passwordHash]
  );
  return rows[0];
}

module.exports = { findByEmail, createUser };
