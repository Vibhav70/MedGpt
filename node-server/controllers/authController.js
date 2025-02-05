const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const generateCustomerId = require("../utils/generateId");

// ✅ Login Function (Using Email Instead of Username)
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Compare hashed password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    // Generate JWT Token
    const token = jwt.sign(
      { id: user._id, email: user.email, customer_id: user.customer_id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: { token, customer_id: user.customer_id, email: user.email, credits: user.credits },
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// ✅ Signup Function
const signupUser = async (req, res) => {
  const { email, password } = req.body;

  // Validate input
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    // Check if user exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    // Generate Customer ID & Hash Password
    const customer_id = generateCustomerId();
    const hashedPassword = await bcrypt.hash(password, 10);

    // Create New User
    const newUser = await User.create({ email, password: hashedPassword, customer_id });

    res.status(201).json({
      message: "User registered successfully",
      customer_id: newUser.customer_id,
    });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};

// ✅ Logout Function
const logoutUser = (req, res) => {
  try {
    res.status(200).json({
      success: true,
      message: "User logged out successfully. Please discard your token.",
    });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ✅ Get Credits Function
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
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// ✅ Ensure `getCredits` is Exported
module.exports = { loginUser, signupUser, logoutUser, getCredits };
