// Validates signup and login input 
const UNT_EMAIL = /^[a-z0-9._%+-]+@my\.unt\.edu$/i;

function clean(value) {
  return typeof value === "string" ? value.trim() : "";
}

function validateRegister(body) {
  const errors = [];
  const firstName = clean(body.firstName);
  const lastName = clean(body.lastName);
  const email = clean(body.email).toLowerCase();
  const confirmEmail = clean(body.confirmEmail).toLowerCase();
  const password = typeof body.password === "string" ? body.password : "";

  if (!firstName) errors.push({ field: "firstName", message: "First name is required" });
  else if (!NAME.test(firstName)) errors.push({ field: "firstName", message: "First name has invalid characters" });

  if (!lastName) errors.push({ field: "lastName", message: "Last name is required" });
  else if (!NAME.test(lastName)) errors.push({ field: "lastName", message: "Last name has invalid characters" });

  if (!email) errors.push({ field: "email", message: "Email is required" });
  else if (!UNT_EMAIL.test(email)) errors.push({ field: "email", message: "Email must be a @my.unt.edu address" });

  if (!confirmEmail) errors.push({ field: "confirmEmail", message: "Please confirm your email" });
  else if (email !== confirmEmail) errors.push({ field: "confirmEmail", message: "Emails do not match" });

  if (password.length < 8) errors.push({ field: "password", message: "Password must be at least 8 characters" });

  return { errors, data: { firstName, lastName, email, password } };
}

function validateLogin(body) {
  const errors = [];
  const email = clean(body.email).toLowerCase();
  const password = typeof body.password === "string" ? body.password : "";

  if (!UNT_EMAIL.test(email)) errors.push({ field: "email", message: "Email must be a @my.unt.edu address" });
  if (!password) errors.push({ field: "password", message: "Password is required" });

  return { errors, data: { email, password } };
}

module.exports = { validateRegister, validateLogin, UNT_EMAIL };
