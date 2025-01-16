const express = require("express");
const { loginUser, signupUser } = require("../controllers/authController");
const { body } = require("express-validator");

const router = express.Router();

// Validation rules for signup and login
const validateUserInput = [
  body("username").notEmpty().withMessage("Username is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

router.post("/login", validateUserInput, loginUser);
router.post("/signup", validateUserInput, signupUser);

module.exports = router;
