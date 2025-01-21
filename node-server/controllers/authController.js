const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const generateCustomerId = require("../utils/generateId");

// Login function
const loginUser = async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findOne({ username });
    if (!user) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Compare the hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid username or password" });
    }

    // Generate a JWT token
    const token = jwt.sign(
      { id: user._id, username: user.username, customer_id: user.customer_id },
      process.env.JWT_SECRET, // Make sure you set JWT_SECRET in your .env file
      { expiresIn: "1h" } // Token expires in 1 hour
    );

    // Respond with the token and user details
    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        customer_id: user.customer_id,
        username: user.username,
        credits: user.credits,
      },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// Signup function
const signupUser = async (req, res) => {
  const { username, password } = req.body;

  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Generate a unique customer ID
    const customer_id = generateCustomerId();

    // Hash the password before saving
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create the new user
    const newUser = await User.create({
      username,
      password: hashedPassword,
      customer_id,
    });

    res.status(201).json({
      message: "User registered successfully",
      customer_id: newUser.customer_id,
    });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};

const logoutUser = (req, res) => {
  try {
    // Since JWTs are stateless, we simply inform the client to discard the token.
    res.status(200).json({
      success: true,
      message: "User logged out successfully. Please discard your token.",
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get Credits
const getCredits = async (req, res) => {
  try {
    const userId = req.user.id;

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    res.status(200).json({
      success: true,
      message: "Credits fetched successfully",
      data: { credits: user.credits },
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};


module.exports = { loginUser, signupUser, logoutUser, getCredits };
