// Sign in (login.html) and Create account (register.html), in the shared login folder
// Sends the form to the auth backend and goes to the right dashboard by role.

// Where the auth routes live once they're added to server.js
const AUTH_URL = "http://localhost:5001/api/auth";

// Where each role goes after signing in
// (paths are from the login folder)
const DASHBOARDS = {
    student: "../student_frontend/student_dashboard.html",
    staff: "../staffside/index.html",
    admin: "../staffside/index.html",
};

const form = document.querySelector("form");
const formError = document.getElementById("form-error");
const submitBtn = document.getElementById("submit-btn");
const isRegister = form.id === "register-form";

// The inputs on this page, by id (same names the backend uses)
const FIELDS = isRegister
    ? ["firstName", "lastName", "email", "confirmEmail", "password"]
    : ["email", "password"];

function value(id) {
    return document.getElementById(id).value;
}

// ---------- Error messages ----------
function setFieldError(id, message) {
    const input = document.getElementById(id);
    const error = document.getElementById(`${id}-error`);
    error.textContent = message || "";
    error.hidden = !message;
    input.setAttribute("aria-invalid", message ? "true" : "false");
}

function clearErrors() {
    FIELDS.forEach(function (id) {
        setFieldError(id, "");
    });
    formError.hidden = true;
}

function showFormError(message) {
    formError.textContent = message;
    formError.hidden = false;
}

// Quick checks before sending, using the same rules as the backend
function checkForm() {
    const errors = [];
    const email = value("email").trim().toLowerCase();
    const untEmail = /^[a-z0-9._%+-]+@my\.unt\.edu$/;

    if (isRegister) {
        if (!value("firstName").trim()) errors.push({ field: "firstName", message: "First name is required" });
        if (!value("lastName").trim()) errors.push({ field: "lastName", message: "Last name is required" });
    }

    if (!email) errors.push({ field: "email", message: "Email is required" });
    else if (!untEmail.test(email)) errors.push({ field: "email", message: "Email must be a @my.unt.edu address" });

    if (isRegister) {
        const confirm = value("confirmEmail").trim().toLowerCase();
        if (!confirm) errors.push({ field: "confirmEmail", message: "Please confirm your email" });
        else if (confirm !== email) errors.push({ field: "confirmEmail", message: "Emails do not match" });

        if (value("password").length < 8) errors.push({ field: "password", message: "Password must be at least 8 characters" });
    } else if (!value("password")) {
        errors.push({ field: "password", message: "Password is required" });
    }

    return errors;
}

// Shows a list of { field, message } errors and moves the cursor to the first one
function showErrors(errors) {
    errors.forEach(function (e) {
        if (FIELDS.includes(e.field)) {
            setFieldError(e.field, e.message);
        } else {
            showFormError(e.message);
        }
    });
    const first = errors.find(function (e) { return FIELDS.includes(e.field); });
    if (first) {
        document.getElementById(first.field).focus();
    }
}

// ---------- Submit ----------
form.addEventListener("submit", async function (event) {
    event.preventDefault();
    clearErrors();

    const errors = checkForm();
    if (errors.length) {
        showErrors(errors);
        return;
    }

    const body = {};
    FIELDS.forEach(function (id) {
        body[id] = id === "password" ? value(id) : value(id).trim();
    });

    submitBtn.disabled = true;
    const label = submitBtn.textContent;
    submitBtn.textContent = isRegister ? "Creating account..." : "Signing in...";

    try {
        const res = await fetch(`${AUTH_URL}/${isRegister ? "register" : "login"}`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(body),
        });
        const data = await res.json().catch(function () { return {}; });

        if (!res.ok) {
            // 400: rule broken, comes back as a list. 401/409: one message.
            if (data.errors) {
                showErrors(data.errors);
            } else {
                showFormError(data.error || "Something went wrong. Try again in a moment.");
            }
            return;
        }

        // Signed in: remember who it is for this browser tab, then go to their dashboard
        sessionStorage.setItem("resolveit-token", data.token);
        sessionStorage.setItem("resolveit-user", JSON.stringify(data.user));
        window.location.href = DASHBOARDS[data.user.role] || DASHBOARDS.student;
    } catch (err) {
        showFormError("Couldn't reach the server. Make sure server.js is running, then try again.");
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = label;
    }
});
