const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const { validationResult } = require("express-validator");
const User = require("../models/User");
const generateCustomerId = require("../utils/generateId");
const crypto = require("crypto");
const nodemailer = require("nodemailer");
const pendingVerifications = new Map();

// Login Function
const loginUser = async (req, res) => {
  const { email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    if (!user.verified) {
      return res.status(401).json({ message: "Email not verified. Please check your inbox." });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }

    const token = jwt.sign(
      { id: user._id, email: user.email, customer_id: user.customer_id },
      process.env.JWT_SECRET,
      { expiresIn: "1h" }
    );

    res.status(200).json({
      success: true,
      message: "Login successful",
      data: {
        token,
        customer_id: user.customer_id,
        email: user.email,
        credits: user.credits
      }
    });
  } catch (err) {
    res.status(500).json({ message: "Login failed", error: err.message });
  }
};

// Signup Function
const signupUser = async (req, res) => {
  const { email, password } = req.body;

  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({ errors: errors.array() });
  }

  try {
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: "Email already exists" });
    }

    const customer_id = generateCustomerId();
    const hashedPassword = await bcrypt.hash(password, 10);
    const verificationToken = jwt.sign(
      { email, password: hashedPassword, customer_id },
      process.env.JWT_SECRET,
      { expiresIn: "15m" }
    );
    
    console.log("Generated token:", verificationToken);

    // ✅ Store in-memory instead of saving to DB
    pendingVerifications.set(verificationToken, {
      email,
      password: hashedPassword,
      customer_id,
    });

    const transporter = nodemailer.createTransport({
      service: "gmail",
      auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASS,
      },
    });

    const verificationLink = `http://localhost:3000/api/auth/verify-email?token=${verificationToken}`;

    await transporter.sendMail({
      from: `"Your App" <${process.env.EMAIL_USER}>`,
      to: email,
      subject: "Verify your email",
      html: `<p>Click the link below to verify your email:</p>
             <a href="${verificationLink}">${verificationLink}</a>`,
    });

    res.status(201).json({
      success: true,
      message: "Signup successful. Please verify your email to complete registration.",
    });
  } catch (err) {
    res.status(500).json({ message: "Signup failed", error: err.message });
  }
};

// Logout Function
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

// Get Credits
const getCredits = async (req, res) => {
  try {
    const userId = req.user.id;
    const user = await User.findById(userId);

    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    const currentDate = new Date();
    if (user.expiry_date && new Date(user.expiry_date) < currentDate) {
      user.credits = 0;
      user.subscription_type = "free";
      user.premium = "No";
      await user.save();
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

module.exports = {
  loginUser,
  signupUser,
  logoutUser,
  getCredits,
};
