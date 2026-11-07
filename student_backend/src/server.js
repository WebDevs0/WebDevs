require("dotenv").config({ path: require("path").join(__dirname, "../../.env") });
const express = require("express");
const cors = require("cors");
const { Pool } = require("pg");

const app = express();
app.use(cors());
app.use(express.json());

const db = new Pool({ connectionString: process.env.DATABASE_URL });
const PORT = process.env.PORT || 5001;

const STUDENT_ID = 1;

const CATEGORIES = ["account", "network", "hardware", "software", "other"];
const PRIORITIES = ["low", "medium", "high"];

app.get("/api/ticket-options", (req, res) => {
  res.json({ categories: CATEGORIES, priorities: PRIORITIES });
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
