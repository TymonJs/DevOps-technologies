const express = require("express");
const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors({ origin: "http://localhost:3000" }));

const { auth } = require('express-oauth2-jwt-bearer');

const issuerBaseURL = "http://keycloak:8080/realms/myrealm";
const jwksUri = "http://keycloak:8080/realms/myrealm/protocol/openid-connect/certs";
const audience = ["account"];

const checkJwt = auth({
  audience: audience,
  issuer: "http://localhost:8080/realms/myrealm",
  issuerBaseURL: issuerBaseURL,
  jwksUri: jwksUri,
  tokenSigningAlg: 'RS256'
});

process.env.NODE_TLS_REJECT_UNAUTHORIZED = "0";

const { Pool } = require("pg");

const pool = new Pool({
  host: process.env.POSTGRES_HOST,
  user: process.env.POSTGRES_USER,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
  port: 5432,
});

app.get("/notes", checkJwt, async (req, res) => {
  try {
    const result = await pool.query("SELECT * FROM notes ORDER BY id DESC");
    res.json(result.rows);
  } catch (e) {
    res.status(500).send(`Error fetching notes: ${e.message}`);
  }
});

app.get("/notes/:name", checkJwt, async (req, res) => {
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

app.post("/notes", checkJwt, async (req, res) => {
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

app.get("/health", (req, res) => {
  res.status(200).send("UP");
});

app.use(function (err, req, res, next) {
  if (err.name === 'UnauthorizedError') {
    res.status(401).json({ message: err.message || 'Invalid token' });
  } else if (err.code && err.status) {
     res.status(err.status).json({ message: err.message, code: err.code });
  }
  else {
    res.status(err.status || 500).json({ message: err.message || 'Internal server error' });
  }
});

app.listen(3001, () => console.log("Express running on port 3001"));