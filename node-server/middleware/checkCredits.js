const User = require("../models/User");

const checkCredits = async (req, res, next) => {
  const { customer_id } = req.body;

  if (!customer_id) {
    return res.status(400).json({ success: false, message: "Customer ID is required" });
  }

  const user = await User.findOne({ customer_id });
  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  if (user.credits <= 0) {
    return res.status(403).json({ success: false, message: "Not enough credits. Please purchase more." });
  }

  next();
};

module.exports = { checkCredits };
