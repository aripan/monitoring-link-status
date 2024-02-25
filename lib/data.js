const fs = require("fs");
const path = require("path");

const lib = {};

//! here __dirname is the current working directory and then added the path of the file
lib.baseUrl = path.join(__dirname, "../.data/");

lib.createCallback = (customDirectory, fileName, data, callback) => {
  const pathToOpenFile = `${lib.baseUrl}${customDirectory}/${fileName}.json`;
  // open file foe writing
  fs.open(pathToOpenFile, "wx", (err, fileDescriptorOnOpen) => {
    if (!err && fileDescriptorOnOpen) {
      // convert data to string
      const stringData = JSON.stringify(data);

      // write data to file and then close the file
      fs.writeFile(
        fileDescriptorOnOpen,
        stringData,
        (err, fileDescriptorOnWrite) => {
          if (!err && fileDescriptorOnWrite) {
            // close the file
            fs.close(fileDescriptorOnWrite, (err, fileDescriptorOnClose) => {
              if (!err && fileDescriptorOnClose) {
                callback(false);
              } else {
                callback("Error closing file", err);
              }
            });
          } else {
            callback("Error writing file", err);
          }
        }
      );
    } else {
      callback("Error creating new file", err);
    }
  });
};

lib.createAsync = async (customDirectory, fileName, data, callback) => {
  try {
    const pathToOpenFile = `${lib.baseUrl}${customDirectory}/${fileName}.json`;
    const stringData = JSON.stringify(data);

    const fileDescriptor = await fs.promises.open(pathToOpenFile, "wx");
    await fs.promises.writeFile(fileDescriptor, stringData);
    await fileDescriptor.close();
    callback(false);

    /**
     //@ previously using the following but it din't work.
     //error: const fileDescriptor = await fs.open(pathToOpenFile, "w") is asking for a callback function.
     //solved: So using the const fileDescriptor = await fs.promises.open(pathToOpenFile, "wx")ensuring that the function returns a promise that we can await, avoiding the need for a callback function

      const fileDescriptor = await fs.open(pathToOpenFile, "w");
      await fs.writeFile(fileDescriptor, stringData);
      await fs.close(fileDescriptor);

      callback(false);
     */
  } catch (err) {
    callback("Error creating new file", err);
  }
};

lib.readCallback = (customDirectory, fileName, callback) => {
  const pathToOpenFile = `${lib.baseUrl}${customDirectory}/${fileName}.json`;
  fs.readFile(pathToOpenFile, { encoding: "utf8" }, (err, data) => {
    callback(err, data);
  });
};

lib.readAsync = async (customDirectory, fileName, callback) => {
  try {
    const pathToOpenFile = `${lib.baseUrl}${customDirectory}/${fileName}.json`;
    const data = await fs.promises.readFile(pathToOpenFile, {
      encoding: "utf8",
    });
    callback(false, data);
  } catch (error) {
    callback(true, null);
  }
};

lib.updateCallback = (customDirectory, fileName, data, callback) => {
  const pathToOpenFile = `${lib.baseUrl}${customDirectory}/${fileName}.json`;
  fs.open(pathToOpenFile, "r+", (err, fileDescriptor) => {
    if (!err && fileDescriptor) {
      // convert data to string
      const stringData = JSON.stringify(data);

      // truncate the file
      fs.truncate(fileDescriptor, (err) => {
        if (!err) {
          fs.writeFile(fileDescriptor, stringData, (err) => {
            if (!err) {
              fs.close(fileDescriptor, (err) => {
                if (!err) {
                  callback(false);
                } else {
                  callback("error closing file");
                }
              });
            } else {
              callback("error writing file");
            }
          });
        } else {
          callback("error truncating file");
        }
      });
    } else {
      callback("error opening file to update", null);
    }
  });
};

lib.updateAsync = async (customDirectory, fileName, data, callback) => {
  try {
    const pathToOpenFile = `${lib.baseUrl}${customDirectory}/${fileName}.json`;
    const stringData = JSON.stringify(data);

    const fileDescriptor = await fs.promises.open(pathToOpenFile, "r+");
    await fs.promises.truncate(pathToOpenFile);
    await fs.promises.writeFile(fileDescriptor, stringData);
    await fileDescriptor.close();
    callback(false);
  } catch (error) {
    callback(error.message);
  }
};

module.exports = lib;
