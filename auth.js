const fs = require('fs');
const readline = require('readline');
const { google } = require('googleapis');

// Load client secrets from a local file (credentials.json).
const credentials = JSON.parse(fs.readFileSync('credentials.json'));

const { client_secret, client_id, redirect_uris } = credentials.installed;
const oAuth2Client = new google.auth.OAuth2(client_id, client_secret, redirect_uris[0]);

// Define scopes for Google Sheets API.
const SCOPES = ['https://www.googleapis.com/auth/spreadsheets'];

// Generate an authorization URL
const authUrl = oAuth2Client.generateAuthUrl({
  access_type: 'offline',
  scope: SCOPES,
});

console.log('Authorize this app by visiting this URL:', authUrl);

// Create a readline interface to get the authorization code.
const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout,
});

rl.question('Enter the code from the page here: ', (code) => {
  rl.close();
  oAuth2Client.getToken(code, (err, token) => {
    if (err) return console.error('Error retrieving access token', err);

    // Save the token to a file for future use.
    fs.writeFileSync('token.json', JSON.stringify(token));
    console.log('Token saved to token.json');
  });
});