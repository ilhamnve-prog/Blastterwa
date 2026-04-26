// ===============================
// FULL LOGIN REGISTER SYSTEM
// Node.js + Express + SQLite
// READY TO RUN (HP / Termux / Render)
// ===============================

const express = require("express");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const session = require("express-session");
const bodyParser = require("body-parser");
const cors = require("cors");

const app = express();
const PORT = process.env.PORT || 3000;

// ===============================
// MIDDLEWARE
// ===============================
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(session({
  secret: "kunci_rahasia_login",
  resave: false,
  saveUninitialized: false
}));

// ===============================
// DATABASE SQLITE
// ===============================
const db = new sqlite3.Database("database.db");

db.run(`
CREATE TABLE IF NOT EXISTS users (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  email TEXT UNIQUE,
  password TEXT,
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP
)
`);

// ===============================
// HOME
// ===============================
app.get("/", (req, res) => {
  res.send("API LOGIN REGISTER AKTIF");
});

// ===============================
// REGISTER
// ===============================
app.post("/register", (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.json({ status: "error", message: "Email dan password wajib" });
  }

  const hash = bcrypt.hashSync(password, 10);

  db.run(
    "INSERT INTO users (email, password) VALUES (?, ?)",
    [email, hash],
    function (err) {
      if (err) {
        return res.json({ status: "error", message: "Email sudah terdaftar" });
      }
      res.json({ status: "ok", message: "Register berhasil" });
    }
  );
});

// ===============================
// LOGIN
// ===============================
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.get("SELECT * FROM users WHERE email = ?", [email], (err, user) => {
    if (!user) {
      return res.json({ status: "error", message: "User tidak ditemukan" });
    }

    const valid = bcrypt.compareSync(password, user.password);

    if (!valid) {
      return res.json({ status: "error", message: "Password salah" });
    }

    req.session.user = {
      id: user.id,
      email: user.email
    };

    res.json({ status: "ok", message: "Login berhasil" });
  });
});

// ===============================
// CEK LOGIN
// ===============================
app.get("/me", (req, res) => {
  if (!req.session.user) {
    return res.json({ loggedIn: false });
  }

  res.json({ loggedIn: true, user: req.session.user });
});

// ===============================
// LOGOUT
// ===============================
app.post("/logout", (req, res) => {
  req.session.destroy();
  res.json({ status: "ok", message: "Logout berhasil" });
});

// ===============================
// START SERVER
// ===============================
app.listen(PORT, () => {
  console.log("Server jalan di port " + PORT);
});
  
