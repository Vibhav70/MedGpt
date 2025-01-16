const bcrypt = require("bcrypt");
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

    res.status(200).json({ customer_id: user.customer_id });
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

module.exports = { loginUser, signupUser };
