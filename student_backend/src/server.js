//the setup reads the .env file that hold the datanase address
const path = require("path");
require("dotenv").config({ path: path.join(__dirname, "../.env") });
require("dotenv").config({ path: path.join(__dirname, "../../.env") });
//loads the tool the server uses
const express = require("express"); //build the server 
const cors = require("cors"); // let the website talk to the server
const { Pool } = require("pg"); //connect to postgres database

const app = express();
app.use(cors());
app.use(express.json());

const db = new Pool({ connectionString: process.env.DATABASE_URL });
const PORT = process.env.PORT || 5001; //connect the database andruns the server on port 5001 if no port is specified in the .env file

const STUDENT_ID = 1; //every ticket is saved under student 1 because the login does not exist yet

const CATEGORIES = ["account", "network", "hardware", "software", "other"];
const PRIORITIES = ["low", "medium", "high"];
//Samuel part 


//tickets comes back newest first with name and email attached
//endpoint GET/api/tickets-options
app.get("/api/ticket-options", (req, res) => {
  res.json({ categories: CATEGORIES, priorities: PRIORITIES });
});
app.get("/api/tickets", async (req, res) => {
  try {
    const result = await db.query(
      `SELECT t.id, t.title, t.description, t.category, t.priority, t.status, t.created_at, u.id AS requester_id, u.first_name || ' ' || u.last_name AS requester_name, u.email AS requester_email 
    FROM tickets t
    JOIN users u ON u.id = t.student_id
    ORDER BY t.created_at DESC`
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Could not fetch tickets" });
  }
});

//student dashboard. Student can view their own tickets.
//endpoint GET/api/student-tickets
app.get("/api/student-tickets", async (req, res) => {
  try {
    const result = await db.query(
      `SELECT id, title, description, category, priority, status, created_at
       FROM tickets
       WHERE student_id = $1
       ORDER BY created_at DESC`,
      [STUDENT_ID]
    );
    res.json(result.rows);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Could not fetch student tickets" });
  }
});


  // Submit a ticket
app.post("/api/tickets", async (req, res) => {
  const title = (req.body.title || "").trim();
  const description = (req.body.description || "").trim();
  const category = req.body.category || "other";
  const priority = req.body.priority || "medium";

  if (!title || !description) {
    return res.status(400).json({ error: "Title and description are required" });
  }
  if (title.length > 200) {
    return res.status(400).json({ error: "Title must be 200 characters or less" });
  }
  if (!CATEGORIES.includes(category)) {
    return res.status(400).json({ error: "Invalid category" });
  }
  if (!PRIORITIES.includes(priority)) {
    return res.status(400).json({ error: "Invalid priority" });
  }

  try {
    const result = await db.query(
      `INSERT INTO tickets (student_id, title, description, category, priority)
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [STUDENT_ID, title, description, category, priority]
    );
    res.status(201).json(result.rows[0]);
  } catch (err) {
    console.error(err.message);
    res.status(500).json({ error: "Could not save ticket" });
  }
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
