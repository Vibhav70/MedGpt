const express = require("express");
const { check } = require("express-validator");
const {
  loginUser,
  signupUser,
  logoutUser,
  getCredits,
} = require("../controllers/authController");
const authenticateUser = require("../middleware/authenticate");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const pendingVerifications = require("../utils/pendingVerifications");

const router = express.Router();
const bcrypt = require("bcrypt");

// Login Route
router.post("/login", [
  check("email", "Valid email is required").isEmail(),
  check("password", "Password is required").notEmpty()
], loginUser);

// Signup Route
router.post("/signup", [
  check("email", "Valid email is required").isEmail(),
  check("password", "Password must be at least 6 characters").isLength({ min: 6 })
], signupUser);

// Email Verification Route
router.get("/verify-email", async (req, res) => {
  const { token } = req.query;

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    
    const userData = pendingVerifications.get(token);
    if (!userData) {
      return res.status(400).send("Invalid or expired verification link.");
    }

    const { email, password, customer_id } = userData;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.redirect("http://localhost:5173/login");
    }

    await User.create({
      email,
      password,
      customer_id,
      isVerified: true,
    });

    // Cleanup
    pendingVerifications.delete(token);

    return res.redirect("http://localhost:5173/login");
  } catch (err) {
    console.error("JWT verification error:", err.message);
    return res.status(400).send("Invalid or expired verification link.");
  }
});

// Logout Route
router.post("/logout", logoutUser);

// Get Credits Route
router.get("/credits", authenticateUser, getCredits);

module.exports = router;
