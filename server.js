const express = require('express');
const mysql = require('mysql2');
const ngrok = require('ngrok'); 
require('dotenv').config();

const app = express();
app.use(express.json());

// MySQL Database connection
const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASSWORD,
  database: process.env.DB_NAME,
});

db.connect((err) => {
  if (err) {
    console.error('Error connecting to MySQL:', err);
    return;
  }
  console.log('Connected to MySQL!');
});


app.get('/', (req, res) => {
    res.send('Welcome to the Google Sheets Sync API');
  });

// Endpoint to handle data from Google Sheets
app.post('/sync', (req, res) => {
    const { data, action } = req.body;
  
    if (action === 'update') {
      const query = `UPDATE users SET name = ?, email = ?, age = ?, country = ? WHERE id = ?`;
      db.query(query, [data[1], data[2], data[3], data[4], data[0]], (err, result) => {
        if (err) {
          console.error('Error updating data:', err);
          return res.status(500).send('Database error');
        }
        res.send('Data updated successfully');
      });
    } else if (action === 'insert') {
      const query = `INSERT INTO users (id, name, email, age, country) VALUES (?, ?, ?, ?, ?)`;
      db.query(query, [data[0], data[1], data[2], data[3], data[4]], (err, result) => {
        if (err) {
          console.error('Error inserting data:', err);
          return res.status(500).send('Database error');
        }
        res.send('Data inserted successfully');
      });
    } else if (action === 'delete') {
      const query = `DELETE FROM users WHERE id = ?`;
      db.query(query, [data[0]], (err, result) => {
        if (err) {
          console.error('Error deleting data:', err);
          return res.status(500).send('Database error');
        }
        res.send('Data deleted successfully');
      });
    } else {
      res.status(400).send('Invalid action');
    }
  });


const port = process.env.PORT || 3000;
app.listen(port, async () => {
  console.log(`Server running on port ${port}`);
  const url = await ngrok.connect(port); 
  console.log(`Ngrok URL: ${url}`);
});