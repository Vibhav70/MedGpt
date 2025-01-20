const Chat = require("../models/Chat");
const User = require("../models/User");

exports.saveChat = async (req, res) => {
  try {
    const { customer_id, query, response, date } = req.body;

    // Validate required fields
    if (!customer_id || !query || !response || !date) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    // Check if the user has enough credits
    const user = await User.findOne({ customer_id });
    if (!user) {
      return res.status(404).json({ success: false, message: "User not found" });
    }

    if (user.credits <= 0) {
      return res.status(403).json({ success: false, message: "Not enough credits. Please purchase more." });
    }

    // Deduct one credit
    user.credits -= 1;
    await user.save();

    // Save the chat entry
    const newChat = new Chat({ customer_id, query, response, date });
    const savedChat = await newChat.save();

    res.status(201).json({ success: true, message: "Chat saved successfully", data: savedChat });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
