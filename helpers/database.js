const databaseFile = require("../lib/data");

// create a new database
const createDatabase = async (fileName, data) => {
  try {
    await new Promise((resolve, reject) => {
      databaseFile.createAsync("test-db", fileName, data, (err) => {
        if (err) {
          console.log("error while creating db", err);
          reject(err);
        } else {
          console.log("Database created successfully");
          resolve();
        }
      });
    });
    console.log("Database creation process completed.");
  } catch (err) {
    console.error(err);
    throw err; // Re-throw the error to handle it in the caller if necessary
  }
};

module.exports = { createDatabase };
