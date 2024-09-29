const fs = require('fs');
const { google } = require('googleapis');
const mysql = require('mysql2');
require('dotenv').config(); // If using dotenv

// Load client secrets from a local file (credentials.json).
const credentials = JSON.parse(fs.readFileSync('credentials.json'));

// Load the token from the token.json file.
const token = JSON.parse(fs.readFileSync('token.json'));

// Set up OAuth2 client using the credentials and token.
const { client_secret, client_id, redirect_uris } = credentials.installed;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);
oAuth2Client.setCredentials(token);

// Database connection
const db = mysql.createConnection({
    host: process.env.DB_HOST,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME
});

db.connect((err) => {
    if (err) {
        console.error('Error connecting to MySQL:', err);
        return;
    }
    console.log('Connected to MySQL!');
});

// Function to read data from Google Sheets.
function readSheet() {
    const sheets = google.sheets({ version: 'v4', auth: oAuth2Client });

    // Replace with your actual spreadsheet ID and range.
    const spreadsheetId = '11RoLZiROJvJ-N3ebwIglAIJMmFrCySPgNYPk1pbWDAg';
    const range = 'Sheet1!A1:E'; // Example range

    sheets.spreadsheets.values.get({ spreadsheetId, range }, (err, res) => {
        if (err) return console.error('The API returned an error: ' + err);

        const rows = res.data.values;
        if (rows.length) {
            console.log('Data from Google Sheets:');
            rows.forEach((row) => {
                console.log(`${row.join(', ')}`);
                // Perform upsert for each row in Google Sheets
                upsertIntoDatabase(row);
            });

            // Perform deletion of rows that are not in Google Sheets
            deleteMissingRows(rows);
        } else {
            console.log('No data found.');
        }
    });
}

// Function to upsert (insert or update) data into the MySQL database with error handling
function upsertIntoDatabase(row) {
    const query = `
        INSERT INTO users (id, name, email, age, country) 
        VALUES (?, ?, ?, ?, ?)
        ON DUPLICATE KEY UPDATE name = VALUES(name), email = VALUES(email), age = VALUES(age), country = VALUES(country)`;

    db.query(query, row, (err, result) => {
        if (err) {
            console.error('Error upserting data into the database:', err);
            return;
        }
        console.log('Data upserted successfully:', result);
    });
}

// Function to delete rows from the MySQL database that are missing in Google Sheets
function deleteMissingRows(sheetData) {
    // Extract all the ids from the Google Sheet data (make sure to convert to a consistent type, like integer or string)
    const sheetIds = sheetData.map(row => parseInt(row[0])); // Assuming IDs are integers

    // Query to get all ids from the database
    db.query('SELECT id FROM users', (err, result) => {
        if (err) {
            console.error('Error fetching data from the database:', err);
            return;
        }

        // Get the list of database IDs
        const dbIds = result.map(row => row.id);
        console.log('IDs in Database:', dbIds);
        console.log('IDs in Google Sheet:', sheetIds);

        // Find ids present in the database but missing from the sheet
        const idsToDelete = dbIds.filter(dbId => !sheetIds.includes(dbId));

        console.log('IDs to be deleted:', idsToDelete);

        // Delete each missing id from the database
        idsToDelete.forEach(id => {
            db.query('DELETE FROM users WHERE id = ?', [id], (deleteErr, deleteResult) => {
                if (deleteErr) {
                    console.error(`Error deleting row with id: ${id}`, deleteErr);
                    return;
                }
                console.log(`Row with id ${id} deleted from the database.`);
            });
        });
    });
}

// Call the function to read data from the sheet.
readSheet();