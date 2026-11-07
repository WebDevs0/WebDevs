const { validateRegister, validateLogin } = require("../validators/authValidator");
const authService = require("../services/authService");

async function register(req, res, next) {
  const { errors, data } = validateRegister(req.body || {});
  if (errors.length) return res.status(400).json({ errors });
  try {
    const result = await authService.register(data);
    res.status(201).json(result);
  } catch (err) {
    if (err instanceof authService.AuthError) return res.status(err.status).json({ error: err.message });
    next(err);
  }
}

async function login(req, res, next) {
  const { errors, data } = validateLogin(req.body || {});
  if (errors.length) return res.status(400).json({ errors });
  try {
    const result = await authService.login(data);
    res.json(result);
  } catch (err) {
    if (err instanceof authService.AuthError) return res.status(err.status).json({ error: err.message });
    next(err);
  }
}

module.exports = { register, login };
