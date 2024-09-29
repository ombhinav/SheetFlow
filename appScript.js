// Google Apps Script to sync Google Sheets to MySQL

function onEdit(e) {
    // This function is triggered when a sheet is edited
    const sheet = e.source.getActiveSheet();
    const range = e.range;
    
    const row = range.getRow();
    const values = sheet.getRange(row, 1, 1, sheet.getLastColumn()).getValues()[0]; // Get all values in the row
    
    const action = detectAction(e, sheet); // Detect if it's an insert, update, or delete
    syncWithMySQL(values, action);
  }
  
  // Function to detect whether it's an insert, update, or delete operation
  function detectAction(e, sheet) {
    const oldValue = e.oldValue; // The value before the edit
    const newValue = e.value;    // The value after the edit
    Logger.log('Old Value: ' + oldValue + ', New Value: ' + newValue); // Log for debugging
  
    if (!oldValue && newValue) {
      return 'insert';  // Insert if a new row or cell is populated
    } else if (oldValue && !newValue) {
      return 'delete';  // Delete if a value is removed
    } else {
      return 'update';  // Update if a value is modified
    }
  }
  
  // Function to sync the data with MySQL
  function syncWithMySQL(values, action) {
    const url = 'https://7054-136-233-9-100.ngrok-free.app/sync'; // Have to change this, according to our own ngrok url.
    // remember to put /sync at the end. Cause that caused a lot of errors.
    
    const payload = {
      data: values,
      action: action, // update, insert, or delete
    };
  
    const options = {
      method: 'POST',
      contentType: 'application/json',
      payload: JSON.stringify(payload),
    };
  
    UrlFetchApp.fetch(url, options); // Send data to your Node.js server
  }