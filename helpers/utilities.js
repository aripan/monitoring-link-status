const bcrypt = require("bcrypt");

// hash password
const hashedPassword = (password) => {
  if (typeof password === "string" && password.length > 0) {
    const salt = bcrypt.genSaltSync(10);
    const securedPassword = bcrypt.hashSync(password, salt);

    return securedPassword;
  }

  return;
};

// compare password
const comparePassword = (password, hashedPassword) => {
  if (
    typeof password === "string" &&
    password.length > 0 &&
    hashedPassword.length > 0
  ) {
    return bcrypt.compareSync(myPlaintextPassword, hash);
  }

  return false;
};

module.exports = {
  hashedPassword,
  comparePassword,
};
