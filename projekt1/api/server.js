const config = {
    "realm": "myrealm",
    "auth-server-url": "http://localhost:8080/",
    "ssl-required": "external",
    "resource": "express-app",
    "verify-token-audience": false,
    "credentials": {
      "secret": "Q4QDcKqm39h51E8FZvm0pAu5DK5J2OUS"
    },
    "confidential-port": 0,
    "policy-enforcer": {
      "credentials": {}
    }
  }

const express = require("express");
const app = express();
const cors = require("cors");

const session = require('express-session');
const memoryStore = new session.MemoryStore();
const {NodeAdapter} = require("ef-keycloak-connect");
const keycloak = new NodeAdapter(config)


app.use(session({
    secret: 'secret1',
    resave: false,
    saveUninitialized: true,
    store: memoryStore
}));


process.env.NODE_TLS_REJECT_UNAUTHORIZED = 0


app.use(express.json());
app.use(cors({
  origin: "*", 
  credentials: true
}));

const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: 5432,
});

app.get("/notes", keycloak.protect(),  async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM notes ORDER BY id DESC");
    res.json(result.rows);
  } catch (e) {
    res.status(500).send(`Error fetching notes: ${e.message}`);
  }
});

app.get("/notes/:name", keycloak.protect(), async (req, res) => {
  const { name } = req.params;
  try {
    const result = await pool.query(
      "SELECT * FROM notes WHERE name = $1 ORDER BY id DESC",
      [name]
    );
    res.json(result.rows);
  } catch (e) {
    res.status(500).send(`Error fetching user notes: ${e.message}`);
  }
});

app.post("/notes", keycloak.protect(), async (req, res) => {
  try {
    const { name, note } = req.body;
    if (!name || !note) {
      return res.status(400).json({ error: "Missing 'name' or 'note' in body" });
    }

    const result = await pool.query(
      "INSERT INTO notes(name, note) VALUES($1, $2) RETURNING *",
      [name, note]
    );

    res.status(201).json(result.rows[0]);
  } catch (e) {
    res.status(500).send(`Error inserting note: ${e.message}`);
  }
});

app.get("/health", (req,res) => {
  res.status(200).send("UP");
})

app.listen(3001, () => console.log("Express running on port 3001"));
