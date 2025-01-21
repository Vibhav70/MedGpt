const express = require("express");
const { loginUser, signupUser, logoutUser, getCredits } = require("../controllers/authController");
const { authenticateUser } = require("../middleware/authenticate");
const { body } = require("express-validator");

const router = express.Router();

// Validation rules
const validateUserInput = [
  body("username").notEmpty().withMessage("Username is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

// Routes
router.post("/login", validateUserInput, loginUser);
router.post("/signup", validateUserInput, signupUser);
router.post("/logout", logoutUser);
router.get("/credits", authenticateUser, getCredits);

module.exports = router;
