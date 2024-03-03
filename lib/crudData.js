const fs = require("fs");
const path = require("path");

const crudLib = {};

crudLib.baseUrl = path.join(__dirname, "../.data/");

// @create operation: creates file if it doesn't exist and then add data to it
crudLib.createData = async (customDirectory, fileName, newData) => {
  try {
    const pathToOpenFile = `${crudLib.baseUrl}${customDirectory}/${fileName}.json`;
    // read the file
    const data = await fs.promises.readFile(pathToOpenFile, {
      encoding: "utf8",
    });

    // parse the data
    const jsonData = JSON.parse(data);

    // check if the data is already present
    const isDataPresent = jsonData.find((user) => user.email === newData.email);
    if (!isDataPresent) {
      jsonData.push(newData);

      // add new data to the file
      await fs.promises.writeFile(pathToOpenFile, JSON.stringify(jsonData));

      return { status: 201, message: "Data added successfully" };
    }

    return { status: 400, message: "Data is present already" };
  } catch (err) {
    return { status: 401, message: err.message };
  }
};

// @read operation: get all the data
crudLib.readData = async (customDirectory, fileName) => {
  try {
    const pathToOpenFile = `${crudLib.baseUrl}${customDirectory}/${fileName}.json`;
    // read the file
    const data = await fs.promises.readFile(pathToOpenFile, {
      encoding: "utf8",
    });

    // parse the data
    const jsonData = JSON.parse(data);

    return { status: 200, data: jsonData };
  } catch (error) {
    return { status: 401, message: err.message };
  }
};

// @update operation: update the existing file
crudLib.updateData = async (customDirectory, fileName, updateFields) => {
  try {
    const pathToOpenFile = `${crudLib.baseUrl}${customDirectory}/${fileName}.json`;
    // read the file
    const data = await fs.promises.readFile(pathToOpenFile, {
      encoding: "utf8",
    });

    // parse the data
    const jsonData = JSON.parse(data);

    // check if the data is already present
    const userIndex = jsonData.findIndex(
      (user) => user.email === updateFields.email
    );
    if (userIndex !== -1) {
      // update user data with the provided fields
      jsonData[userIndex] = { ...jsonData[userIndex], ...updateFields };

      // write the updated data back to the file
      await fs.promises.writeFile(pathToOpenFile, JSON.stringify(jsonData));

      return { status: 200, message: "Data updated successfully" };
    }

    return { status: 404, message: "User not found" };
  } catch (err) {
    return { status: 401, message: err.message };
  }
};

// @delete operation: delete the existing file
crudLib.deleteData = async (customDirectory, fileName, userEmail) => {
  try {
    const pathToOpenFile = `${crudLib.baseUrl}${customDirectory}/${fileName}.json`;
    // read the file
    const data = await fs.promises.readFile(pathToOpenFile, {
      encoding: "utf8",
    });

    // parse the data
    const jsonData = JSON.parse(data);

    // check if the data is already present
    const usersToKeep = jsonData.filter((user) => user.email !== userEmail);

    if (jsonData.length === usersToKeep.length) {
      return { status: 400, message: "User not found" };
    }

    // write the updated data back to the file
    await fs.promises.writeFile(pathToOpenFile, JSON.stringify(usersToKeep));
    return { status: 204, message: "Data deleted successfully" };
  } catch (err) {
    return { status: 401, message: err.message };
  }
};

module.exports = crudLib;
