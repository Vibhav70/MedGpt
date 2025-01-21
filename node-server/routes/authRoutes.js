const express = require("express");
const { getCredits } = require("../controllers/authController");
const { authenticateUser } = require("../middleware/authenticate");
const { loginUser, signupUser, logoutUser } = require("../controllers/authController");
const { body } = require("express-validator");

const router = express.Router();

// Validation rules for signup and login
const validateUserInput = [
  body("username").notEmpty().withMessage("Username is required"),
  body("password").notEmpty().withMessage("Password is required"),
];

router.post("/login", validateUserInput, loginUser);
router.post("/signup", validateUserInput, signupUser);
router.get("/credits", authenticateUser, getCredits);
router.post("/logout", logoutUser);

module.exports = router;
