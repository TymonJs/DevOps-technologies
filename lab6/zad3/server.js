const express = require('express');
const mysql = require('mysql2');
const app = express();

const db = mysql.createConnection({
  host: 'database', // nazwa kontenera
  user: 'root',
  password: 'password',
  database: 'testdb'
});

app.get('/', (req, res) => {
  db.query('SELECT * FROM users', (err, results) => {
    if (err) return res.send(err.message);
    res.send(JSON.stringify(results));
  });
});

app.listen(5000, () => {
  console.log('Backend running on 5000');
});
