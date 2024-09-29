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

// sync data from MySQL to Google Sheets
function syncFromDatabaseToSheet() {
    
    const query = 'SELECT * FROM users';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error fetching data from MySQL:', err);
            return;
        }

        if (results.length > 0) {
            console.log('Data fetched from MySQL:', results);
            // Convert MySQL rows to a 2D array format for Google Sheets
            const sheetData = results.map(row => [row.id, row.name, row.email, row.age, row.country]);
            // Update Google Sheets with the fetched data
            const sheets = google.sheets({ version: 'v4', auth: oAuth2Client });
            const spreadsheetId = '11RoLZiROJvJ-N3ebwIglAIJMmFrCySPgNYPk1pbWDAg';
            const range = 'Sheet1!A2:E'; // Update range from A2 onward to leave headers intact

            sheets.spreadsheets.values.update({
                spreadsheetId,
                range,
                valueInputOption: 'RAW',
                resource: { values: sheetData },
            }, (err, res) => {
                if (err) return console.error('The API returned an error:', err);
                console.log('Google Sheet successfully updated with data from MySQL!');
            });
        } else {
            console.log('No data found in MySQL.');
        }
    });
}


syncFromDatabaseToSheet();