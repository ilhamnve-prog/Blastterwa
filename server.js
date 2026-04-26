const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(bodyParser.json());
app.use(express.static("public"));

const db = new sqlite3.Database("./database.db");

db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    username TEXT,
    password TEXT,
    balance INTEGER DEFAULT 0
  )`);
});

  db.run(`CREATE TABLE IF NOT EXISTS transactions (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER,
  type TEXT,
  amount INTEGER,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)`);
app.post("/register", (req, res) => {
  const { username, password } = req.body;

  db.run(
    "INSERT INTO users (username, password) VALUES (?, ?)",
    [username, password],
    function (err) {
      if (err) return res.json({ status: "error" });
      res.json({ status: "ok" });
    }
  );
});
app.post("/login", (req, res) => {
  const { username, password } = req.body;

  db.get(
    "SELECT * FROM users WHERE username=? AND password=?",
    [username, password],
    (err, row) => {
      if (!row) return res.json({ status: "error" });
      res.json({ status: "ok", user: row });
    }
  );
});

app.get("/user/:id", (req, res) => {
  db.get("SELECT * FROM users WHERE id=?", [req.params.id], (err, row) => {
    res.json(row);
  });
});

app.post("/topup", (req, res) => {
  const { id, amount } = req.body;

  db.run(
    "UPDATE users SET balance = balance + ? WHERE id=?",
    [amount, id],
    () => {

      db.run(
        "INSERT INTO transactions (user_id, type, amount) VALUES (?, ?, ?)",
        [id, "topup", amount]
      );

      res.json({ status: "ok" });
    }
  );
});

app.listen(3000, () => console.log("Server jalan"));

