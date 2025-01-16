const { v4: uuidv4 } = require("uuid");

const generateCustomerId = () => {
  return uuidv4(); // Generates a unique customer ID
};

module.exports = generateCustomerId;
