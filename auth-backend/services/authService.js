const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const users = require("../repositories/userRepository");

const SALT_ROUNDS = 12;

class AuthError extends Error {
  constructor(status, message) {
    super(message);
    this.status = status;
  }
}

function publicUser(u) {
  return { id: u.id, firstName: u.first_name, lastName: u.last_name, email: u.email, role: u.role };
}

function signToken(user) {
  return jwt.sign({ sub: user.id, role: user.role }, process.env.JWT_SECRET, { expiresIn: "8h" });
}

async function register({ firstName, lastName, email, password }) {
  if (await users.findByEmail(email)) {
    throw new AuthError(409, "An account with that email already exists");
  }
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  try {
    const user = await users.createUser({ firstName, lastName, email, passwordHash });
    return { user: publicUser(user), token: signToken(user) };
  } catch (err) {
    if (err.code === "23505") throw new AuthError(409, "An account with that email already exists");
    throw err;
  }
}

async function login({ email, password }) {
  const user = await users.findByEmail(email);
  // same message either way so nobody can check which emails exist
  const ok = user && (await bcrypt.compare(password, user.password_hash));
  if (!ok) throw new AuthError(401, "Invalid email or password");
  return { user: publicUser(user), token: signToken(user) };
}

module.exports = { register, login, AuthError };
