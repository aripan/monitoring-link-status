const crypto = require("crypto");
const jwt = require("jsonwebtoken");

// Generate a random encryption key
const generateEncryptionKey = () => {
  return crypto.randomBytes(32); // 32 bytes (256 bits) for AES-256 encryption
};

// Encrypt data using AES-256-CBC algorithm
const encryptData = (data, key) => {
  const iv = crypto.randomBytes(16); // Generate random initialization vector
  const cipher = crypto.createCipheriv("aes-256-cbc", key, iv);
  let encryptedData = cipher.update(data, "utf8", "base64");
  encryptedData += cipher.final("base64");
  return { iv: iv.toString("base64"), encryptedData };
};

const createEncryptedToken = (
  tokenPayload,
  expiresIn = "7d"
) => {
  const encryptionKey = generateEncryptionKey();
  // Encrypt the payload
  const encryptedPayload = encryptData(
    JSON.stringify(tokenPayload),
    encryptionKey
  );

  // Specify the algorithm and encryption key for signature
  const options = {
    algorithm: "HS256", // HMAC using SHA-256 hash algorithm
    expiresIn,
  };

  // Create the JWT with the encrypted payload
  const token = jwt.sign(encryptedPayload, encryptionKey, options);

  return token;
};

module.exports = { createEncryptedToken };
