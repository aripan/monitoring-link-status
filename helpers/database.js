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
          resolve();
        }
      });
    });
  } catch (err) {
    console.error(err);
    throw err; // Re-throw the error to handle it in the caller if necessary
  }
};

// read the database
// const readDatabase = async (fileName) => {
//   try {
//     return await new Promise((resolve, reject) => {
//       databaseFile.readCallback("test-db", fileName, (err, data) => {
//         if (err) {
//           console.log("error while creating db", err);
//           reject(err);
//         } else {
//           resolve(data);
//         }
//       });
//     });
//   } catch (error) {
//     console.error(err);
//     throw err;
//   }
// };

const readDatabase = async (fileName) => {
  try {
    return await new Promise((resolve, reject) => {
      databaseFile.readAsync("test-db", fileName, (err, data) => {
        if (err) {
          console.log("error while creating db", err);
          reject(err);
        } else {
          resolve(data);
        }
      });
    });
  } catch (error) {
    console.error(err);
    throw err;
  }
};

// const updateDatabase = async (fileName, data) => {
//   try {
//     return await new Promise((resolve, reject) => {
//       databaseFile.updateCallback("test-db", fileName, data, (err) => {
//         if (!err) {
//           resolve();
//         } else {
//           console.log("🚀 ~ databaseFile.updateCallback ~ err:", err);
//           reject(err);
//         }
//       });
//     });
//   } catch (error) {
//     throw error;
//   }
// };

const updateDatabase = async (fileName, data) => {
  try {
    return await new Promise((resolve, reject) => {
      databaseFile.updateAsync("test-db", fileName, data, (err) => {
        if (!err) {
          resolve();
        } else {
          console.log("🚀 ~ databaseFile.updateCallback ~ err:", err);
          reject(err);
        }
      });
    });
  } catch (error) {
    throw error;
  }
};

// const deleteDatabase = async (fileName) => {
//   try {
//     return await new Promise((resolve, reject) => {
//       databaseFile.deleteCallback("test-db", fileName, (err) => {
//         if (!err) {
//           resolve();
//         } else {
//           console.log("🚀 ~ databaseFile.deleteCallback ~ err:", err);
//           reject(err);
//         }
//       });
//     });
//   } catch (error) {
//     throw error;
//   }
// };

const deleteDatabase = async (fileName) => {
  try {
    return await new Promise((resolve, reject) => {
      databaseFile.deleteAsync("test-db", fileName, (err) => {
        if (!err) {
          resolve();
        } else {
          console.log("🚀 ~ databaseFile.deleteCallback ~ err:", err);
          reject(err);
        }
      });
    });
  } catch (error) {
    throw error;
  }
};

module.exports = {
  createDatabase,
  readDatabase,
  updateDatabase,
  deleteDatabase,
};
