# SheetFlow

**SheetFlow** is a modern data synchronization tool designed to effortlessly sync data between Google Sheets and a MySQL database. It supports real-time updates, inserts, deletions, and ensures consistency between both platforms. This tool also provides bi-directional synchronization—data from Google Sheets to MySQL and vice versa.

## Features

- Sync Google Sheets data with MySQL.
- Automatically handle `insert`, `update`, and `delete` operations.
- Real-time synchronization with robust error handling.
- Sync MySQL database data back to Google Sheets.
- Supports Google Apps Script, Node.js, and Ngrok for local server tunneling.

---

## Table of Contents

1. [Getting Started](#getting-started)
2. [Project Structure](#project-structure)
3. [Setup Instructions](#setup-instructions)
4. [Generating OAuth2 Token](#generating-oauth2-token)
5. [Environment Variables](#environment-variables)
6. [How It Works](#how-it-works)
7. [Syncing Data from MySQL to Google Sheets](#syncing-data-from-mysql-to-google-sheets)
8. [Available Commands](#available-commands)
9. [Technologies Used](#technologies-used)
10. [Contributing](#contributing)

---

## Getting Started

To get a local copy of the project up and running, follow these steps:

### Prerequisites

Make sure you have the following installed:

- **Node.js** (v16 or higher)
- **npm** (v7 or higher)
- **MySQL** (v8 or higher)
- **Google Cloud Project** (For enabling APIs)
- **Ngrok** (For local server tunneling)

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/<your-username>/sheetflow.git
   cd sheetflow
   ```
2. Set up your MySQL database:
    ```sql
    CREATE TABLE users (
    id INT PRIMARY KEY,
    name VARCHAR(100),
    email VARCHAR(100),
    age INT,
    country VARCHAR(100)
    );
 
3. Set up Google Sheets API:

  - Create a project in the Google Cloud Console.
  - Enable the Google Sheets API and Google Drive API.
  - Download the credentials.json file and place it in the root directory of your project.

## Project Structure

SheetFlow \
├── auth.js                # Script to generate OAuth2 token (token.json) from credentials.json \
├── index.js               # Sync logic for Google Sheets to MySQL \
├── syncToSheets.js        # Sync logic for MySQL to Google Sheets \
├── server.js              # Main server handling sync requests \
├── credentials.json       # Google API credentials (add manually) \
├── token.json             # OAuth2 token generated from credentials.json \
├── .env                   # Environment variables (add manually) \
└── README.md              # Project documentation \

## Setup Instructions
1. Configure Environment Variables \

  Create a .env file in the root directory and add your database credentials:
  ```bash
    DB_HOST=your_mysql_host
    DB_USER=your_mysql_username
    DB_PASSWORD=your_mysql_password
    DB_NAME=your_mysql_database
    PORT=3000
    SPREADSHEET_ID=your_google_spreadsheet_id
    NGROK_URL=your_ngrok_url
```
2. Run the Node.js Server \
To start the server and establish synchronization, run the following command:\
  ```bash
    node server.js
```
This will start the server on port 3000 and expose it to the web using Ngrok. \

## Generating OAuth2 Token
To access Google Sheets API, you need an OAuth2 token. This can be generated using the auth.js script.

1. Run the following command to generate token.json from credentials.json: \
``` bash
  node auth.js
```
2. Follow the link in the terminal to authorize the app and generate a token.json file.

This token is required for accessing and modifying the Google Sheets data.

## How It Works
SheetFlow enables real-time data synchronization between Google Sheets and MySQL. It uses a Node.js server and Google Apps Script to track and sync changes.

1. Sync Google Sheets to MySQL:

 - Detect changes (insert, update, delete) in Google Sheets.
 - Sync these changes to MySQL via a POST request to the /sync endpoint.


2. Sync MySQL to Google Sheets:

- Fetch data from the MySQL database.
- Update the corresponding Google Sheets to reflect the MySQL data.

## Syncing Data from MySQL to Google Sheets
To sync data from MySQL to Google Sheets, use the following script:
```bash
  node syncToSheets.js
```
## Available Commands

1. Start the server:
```bash
node server.js
```
2. Sync Google Sheets to MYSQL:
```bash
node server.js
```
3. Sync MySQL to Google Sheets:
```bash
node syncToSheets.js
```
4. Generate OAuth2 token:
```bash
node auth.js
```



