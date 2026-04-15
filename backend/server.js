const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "studysphere_secret";

/* 💾 DATABASE */
const db = new sqlite3.Database("./studysphere.db");

/* TABLE USERS */
db.run(`
CREATE TABLE IF NOT EXISTS users (
id INTEGER PRIMARY KEY AUTOINCREMENT,
username TEXT UNIQUE,
password TEXT
)
`);

/* TABLE TASKS */
db.run(`
CREATE TABLE IF NOT EXISTS tasks (
id INTEGER PRIMARY KEY AUTOINCREMENT,
title TEXT,
user_id INTEGER
)
`);

/* 🔐 REGISTER */
app.post("/register", async (req, res) => {
const { username, password } = req.body;

const hash = await bcrypt.hash(password, 10);

db.run(
"INSERT INTO users (username, password) VALUES (?,?)",
[username, hash],
(err) => {
if (err) return res.status(400).json({ message: "User exists" });
res.json({ message: "created" });
}
);
});

/* 🔑 LOGIN */
app.post("/login", (req, res) => {
const { username, password } = req.body;

db.get(
"SELECT * FROM users WHERE username = ?",
[username],
async (err, user) => {
if (!user) return res.status(400).json({ message: "No user" });

const ok = await bcrypt.compare(password, user.password);
if (!ok) return res.status(400).json({ message: "Wrong password" });

const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "2h" });

res.json({ token });
}
);
});

/* 🔒 AUTH MIDDLEWARE */
function auth(req, res, next){
const token = req.headers.authorization;
if(!token) return res.status(401).json({message:"no token"});

try{
const data = jwt.verify(token, SECRET);
req.user = data;
next();
}catch{
res.status(401).json({message:"invalid token"});
}
}

/* 📌 GET TASKS (USER ONLY) */
app.get("/tasks", auth, (req, res) => {
db.all(
"SELECT * FROM tasks WHERE user_id = ?",
[req.user.id],
(err, rows) => {
res.json(rows);
}
);
});

/* ➕ ADD TASK */
app.post("/tasks", auth, (req, res) => {
db.run(
"INSERT INTO tasks (title, user_id) VALUES (?,?)",
[req.body.title, req.user.id],
function () {
res.json({ id: this.lastID });
}
);
});

/* 🚀 START */
app.listen(3000, () => {
console.log("Server running http://localhost:3000");
});