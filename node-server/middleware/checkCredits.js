const User = require("../models/User");

exports.checkCredits = async (req, res, next) => {
  try {
    const { customer_id } = req.body;

    if (!customer_id) {
      return res.status(400).json({
        success: false,
        message: "Customer ID is required",
      });
    }

    const user = await User.findOne({ customer_id });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    const currentDate = new Date();

    // If subscription has expired
    if (user.expiry_date && new Date(user.expiry_date) < currentDate) {
      user.credits = 0;
      user.subscription_type = "free";
      user.premium = "No";
      await user.save();

      return res.status(403).json({
        success: false,
        message: "Your subscription has expired. Please renew to continue.",
      });
    }

    if (user.credits <= 0) {
      return res.status(403).json({
        success: false,
        message: "Not enough credits. Please purchase more credits.",
      });
    }

    // All checks passed
    next();
  } catch (error) {
    console.error("❌ Error in checkCredits middleware:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};
