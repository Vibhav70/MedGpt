const User = require("../models/User");
const generateCustomerId = require("../utils/generateId");

// Login function
const loginUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    let user = await User.findOne({ username });
    if (!user) {
      const customer_id = generateCustomerId();
      user = await User.create({ username, password, customer_id });
    }
    res.status(200).json({ customer_id: user.customer_id });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// Signup function
const signupUser = async (req, res) => {
  const { username, password } = req.body;
  try {
    // Check if the user already exists
    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ message: "Username already exists" });
    }

    // Generate a unique customer ID and create a new user
    const customer_id = generateCustomerId();
    const newUser = await User.create({ username, password, customer_id });

    res.status(201).json({
      message: "User registered successfully",
      customer_id: newUser.customer_id,
    });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};

module.exports = { loginUser, signupUser };
