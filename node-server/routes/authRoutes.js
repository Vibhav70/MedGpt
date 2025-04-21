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
  check("email", "Valid email is required").isEmail(), // ✅ Change username → email
  check("password", "Password must be at least 6 characters").isLength({ min: 6 })
], signupUser);

app.get("/verify-email", async (req, res) => {
  const { token } = req.query;

  try {
    const user = await User.findOne({ verificationToken: token });

    if (!user) {
      return res.status(400).send("Invalid or expired token.");
    }

    user.verified = true;
    user.verificationToken = undefined;
    await user.save();

    res.send("Email verified successfully! You can now log in.");
  } catch (err) {
    res.status(500).send("Server error during verification.");
  }
});

// Logout Route
router.post("/logout", logoutUser);

// ✅ Fix: Ensure `getCredits` is correctly referenced
router.get("/credits", authenticateUser, getCredits);

module.exports = router;
