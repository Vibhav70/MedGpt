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

const router = express.Router();

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
    const decoded = jwt.verify(token, process.env.JWT_SECRET); // <-- this line can fail

    const { email, password, customer_id } = decoded;

    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.redirect("http://localhost:5173/login");
    }

    await User.create({ email, password, customer_id });

    return res.redirect("http://localhost:5173/login");
  } catch (err) {
    console.error("JWT verification error:", err.message); // 👈 Add this
    return res.status(400).send("Invalid or expired verification link.");
  }
});

// Logout Route
router.post("/logout", logoutUser);

// Get Credits Route
router.get("/credits", authenticateUser, getCredits);

module.exports = router;
