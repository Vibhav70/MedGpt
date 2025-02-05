const express = require("express");
const { check } = require("express-validator");
const { loginUser, signupUser, logoutUser, getCredits } = require("../controllers/authController");
const authenticateUser = require("../middleware/authenticate"); // Ensure correct middleware path

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

// Logout Route
router.post("/logout", logoutUser);

// ✅ Fix: Ensure `getCredits` is correctly referenced
router.get("/credits", authenticateUser, getCredits);

module.exports = router;
