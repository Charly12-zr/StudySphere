const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "studysphere_secret";

<<<<<<< HEAD
/* 💾 DATABASE */
const db = new sqlite3.Database("./studysphere.db");

/* TABLE USERS */
=======
/* =========================
DATABASE
========================= */
const db = new sqlite3.Database("./studysphere.db");

/* USERS */
>>>>>>> backend-auth
db.run(`
CREATE TABLE IF NOT EXISTS users (
id INTEGER PRIMARY KEY AUTOINCREMENT,
username TEXT UNIQUE,
password TEXT
)
`);

<<<<<<< HEAD
/* TABLE TASKS */
=======
/* PROFILES */
db.run(`
CREATE TABLE IF NOT EXISTS profiles (
id INTEGER PRIMARY KEY AUTOINCREMENT,
user_id INTEGER UNIQUE,
bio TEXT DEFAULT '',
avatar TEXT DEFAULT ''
)
`);

/* TASKS */
>>>>>>> backend-auth
db.run(`
CREATE TABLE IF NOT EXISTS tasks (
id INTEGER PRIMARY KEY AUTOINCREMENT,
title TEXT,
user_id INTEGER
)
`);

<<<<<<< HEAD
/* 🔐 REGISTER */
=======
/* =========================
HOME ROUTE (TEST NAVIGATEUR)
========================= */
app.get("/", (req, res) => {
res.send("StudySphere API OK 🚀");
});

/* =========================
REGISTER
========================= */
>>>>>>> backend-auth
app.post("/register", async (req, res) => {
const { username, password } = req.body;

const hash = await bcrypt.hash(password, 10);

db.run(
"INSERT INTO users (username, password) VALUES (?,?)",
[username, hash],
<<<<<<< HEAD
(err) => {
if (err) return res.status(400).json({ message: "User exists" });
res.json({ message: "created" });
=======
function (err) {
if (err) return res.status(400).json({ message: "User exists" });

db.run("INSERT INTO profiles (user_id) VALUES (?)", [this.lastID]);

res.json({ message: "User created" });
>>>>>>> backend-auth
}
);
});

<<<<<<< HEAD
/* 🔑 LOGIN */
=======
/* =========================
LOGIN
========================= */
>>>>>>> backend-auth
app.post("/login", (req, res) => {
const { username, password } = req.body;

db.get(
"SELECT * FROM users WHERE username = ?",
[username],
async (err, user) => {
<<<<<<< HEAD
if (!user) return res.status(400).json({ message: "No user" });
=======
if (!user) return res.status(400).json({ message: "No user found" });
>>>>>>> backend-auth

const ok = await bcrypt.compare(password, user.password);
if (!ok) return res.status(400).json({ message: "Wrong password" });

const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "2h" });

res.json({ token });
}
);
});

<<<<<<< HEAD
/* 🔒 AUTH MIDDLEWARE */
=======
/* =========================
AUTH MIDDLEWARE
========================= */
>>>>>>> backend-auth
function auth(req, res, next){
const token = req.headers.authorization;
if(!token) return res.status(401).json({message:"no token"});

try{
<<<<<<< HEAD
const data = jwt.verify(token, SECRET);
req.user = data;
=======
req.user = jwt.verify(token, SECRET);
>>>>>>> backend-auth
next();
}catch{
res.status(401).json({message:"invalid token"});
}
}

<<<<<<< HEAD
/* 📌 GET TASKS (USER ONLY) */
app.get("/tasks", auth, (req, res) => {
db.all(
"SELECT * FROM tasks WHERE user_id = ?",
[req.user.id],
(err, rows) => {
res.json(rows);
=======
/* =========================
PROFILE GET
========================= */
app.get("/profile", auth, (req, res) => {
db.get(
`SELECT u.username, p.bio, p.avatar
FROM users u
JOIN profiles p ON u.id = p.user_id
WHERE u.id = ?`,
[req.user.id],
(err, data) => {
res.json(data);
>>>>>>> backend-auth
}
);
});

<<<<<<< HEAD
/* ➕ ADD TASK */
=======
/* =========================
PROFILE UPDATE
========================= */
app.put("/profile", auth, (req, res) => {
const { bio, avatar } = req.body;

db.run(
"UPDATE profiles SET bio=?, avatar=? WHERE user_id=?",
[bio, avatar, req.user.id],
() => res.json({ message: "Profile updated" })
);
});

/* =========================
TASKS GET
========================= */
app.get("/tasks", auth, (req, res) => {
db.all(
"SELECT * FROM tasks WHERE user_id=?",
[req.user.id],
(err, rows) => res.json(rows)
);
});

/* =========================
TASKS ADD
========================= */
>>>>>>> backend-auth
app.post("/tasks", auth, (req, res) => {
db.run(
"INSERT INTO tasks (title, user_id) VALUES (?,?)",
[req.body.title, req.user.id],
function () {
res.json({ id: this.lastID });
}
);
});

<<<<<<< HEAD
/* 🚀 START */
app.listen(3000, () => {
console.log("Server running http://localhost:3000");
});
=======
/* =========================
START SERVER
========================= */
app.listen(3000, () => {
console.log("Server running http://localhost:3000");
});
>>>>>>> backend-auth
