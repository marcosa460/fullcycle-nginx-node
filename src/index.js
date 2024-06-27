const express = require('express');
const mysql = require('mysql');
const app = express();
const port = 3000;

const config = {
  host: 'db',
  user: 'root',
  password: 'root',
  database: 'nodedb'
};

const connection = mysql.createConnection(config);

const createTableQuery = `
  CREATE TABLE IF NOT EXISTS people (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL
  )
`;

connection.query(createTableQuery);

app.get('/', (req, res) => {
  const insertQuery = `INSERT INTO people(name) values('Full Cycle Rocks!')`;
  connection.query(insertQuery, (err, result) => {
    if (err) throw err;

    connection.query('SELECT name FROM people', (err, rows) => {
      if (err) throw err;
      let names = '<ul>';
      rows.forEach(row => {
        names += `<li>${row.name}</li>`;
      });
      names += '</ul>';
      res.send(`<h1>Full Cycle Rocks!</h1>${names}`);
    });
  });
});

app.listen(port, () => {
  console.log('Running on port ' + port);
});
