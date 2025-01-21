const mongoose = require("mongoose");

const connectDB = async () => {
  try {
    // Attempt to connect to MongoDB using the URI from environment variables
    const conn = await mongoose.connect(process.env.MONGO_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });

    // Log successful connection to the console
    console.log(`MongoDB Connected: ${conn.connection.host}`);
  } catch (error) {
    // Log the error details and exit the process
    console.error(`MongoDB Connection Error: ${error.message}`);
    
    // Optionally provide more context about the error
    console.error("Ensure your MONGO_URI environment variable is correctly set and the database server is running.");
    
    // Exit the process with a failure code
    process.exit(1);
  }
};

module.exports = connectDB;
