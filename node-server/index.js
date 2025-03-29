const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const connectDB = require("./config/db");
const dotenv = require("dotenv");
// Routes
const authRoutes = require("./routes/authRoutes");
const chatRoutes = require("./routes/chatRoutes");
const purchaseRoutes = require("./routes/purchaseRoutes");

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

// Initialize Express app
const app = express();

// ✅ Fix CORS Configuration
app.use(
  cors({
    origin: "http://localhost:5173", // Allow frontend origin
    credentials: true, // Allow cookies & authorization headers
    methods: "GET,HEAD,PUT,PATCH,POST,DELETE", // Allowed HTTP methods
    allowedHeaders: "Origin, X-Requested-With, Content-Type, Accept, Authorization",
  })
);

// Middleware
app.use(bodyParser.json());


app.use("/api/auth", authRoutes);
app.use("/api/chats", chatRoutes);
app.use("/api/subscription", purchaseRoutes);

// Server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));