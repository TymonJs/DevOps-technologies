const express = require("express");
const app = express();
app.use(express.json());

const cors = require('cors');
app.use(cors({ origin: "http://localhost" }));

const { auth } = require('express-oauth2-jwt-bearer');

const issuerBaseURL = "http://keycloak:8080/realms/myrealm";
const jwksUri = "http://keycloak:8080/realms/myrealm/protocol/openid-connect/certs";
const audience = ["account"];

const checkJwt = auth({
  audience: audience,
  issuer: "http://localhost/auth/realms/myrealm",
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
    const roles = req.auth.payload.realm_access?.roles || [];
    const isAdmin = roles.includes('admin');
    
    let result;
    if (isAdmin) {
      result = await pool.query("SELECT * FROM notes ORDER BY id DESC LIMIT 10");
    } else {
      const username = req.auth.payload.preferred_username;
      if (!username) {
        return res.status(400).json({ error: "Username not found in token." });
      }
      result = await pool.query(
        "SELECT * FROM notes WHERE name = $1 ORDER BY id DESC",
        [username]
      );
    }
    res.json(result.rows);
  } catch (e) {
    res.status(500).json({ error: `Error fetching notes: ${e.message}` });
  }
});

app.post("/notes", checkJwt, async (req, res) => {
  try {
    const { note } = req.body; 
    const name = req.auth.payload.preferred_username;

    if (!name || !note) {
      return res.status(400).json({ error: "Missing 'note' in body or username in token" });
    }
    const result = await pool.query(
      "INSERT INTO notes(name, note) VALUES($1, $2) RETURNING *",
      [name, note]
    );
    res.status(201).json(result.rows[0]);
  } catch (e) {
    res.status(500).json({ error: `Error inserting note: ${e.message}` });
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

app.listen(3001, () => console.log("Express running on 3001"));