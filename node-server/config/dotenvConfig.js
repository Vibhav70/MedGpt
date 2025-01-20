const dotenv = require("dotenv");

const configureDotenv = () => {
  const result = dotenv.config();

  if (result.error) {
    console.error("Failed to load .env file. Please ensure it exists in the root directory.");
    process.exit(1); // Exit the process if the .env file is not loaded
  }

  console.log("Environment variables successfully loaded.");
};

module.exports = configureDotenv;