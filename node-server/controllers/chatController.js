const Chat = require("../models/Chat");
const User = require("../models/User");

exports.saveChat = async (req, res) => {
  try {
    const { customer_id, query, response, date } = req.body;

    // Validate required fields
    if (!customer_id || !query || !date) { // Remove strict requirement for `response`
      return res.status(400).json({ success: false, message: "customer_id, query, and date are required" });
    }
    
    // If response is empty, store as "Processing..."
    const storedResponse = response || "Processing...";
    
    // Find the user by customer_id
    const user = await User.findOne({ customer_id });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Check if the user has enough credits
    if (user.credits <= 0) {
      return res.status(403).json({
        success: false,
        message: "Not enough credits. Please purchase more credits to continue.",
      });
    }

    // Deduct one credit from the user
    user.credits -= 1;
    await user.save();

    // Create and save the chat entry
    const newChat = new Chat({ customer_id, query, response: storedResponse, date });
    const savedChat = await newChat.save();

    // Respond with success
    return res.status(201).json({
      success: true,
      message: "Chat saved successfully",
      data: savedChat,
    });
  } catch (error) {
    // Catch any unexpected errors and respond
    console.error("Error saving chat:", error.message);
    return res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};

// Get All Chats
exports.getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find();
    res.status(200).json({ success: true, data: chats });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

exports.getChatsByCustomerId = async (req, res) => {
  try {
    const { customer_id } = req.params;

    // Validate customer_id
    if (!customer_id) {
      return res.status(400).json({
        success: false,
        message: "Customer ID is required",
      });
    }

    // Fetch chats by customer_id
    const chats = await Chat.find({ customer_id });

    // If no chats found
    if (chats.length === 0) {
      return res.status(404).json({
        success: false,
        message: "No chats found for the given customer ID",
      });
    }

    // Return the chats
    res.status(200).json({
      success: true,
      data: chats,
    });
  } catch (error) {
    console.error("Error fetching chats:", error.message);
    res.status(500).json({
      success: false,
      message: "Server error",
      error: error.message,
    });
  }
};

// Get Chat by ID
exports.getChatById = async (req, res) => {
  try {
    const { id } = req.params;
    const chat = await Chat.findById(id);

    if (!chat) {
      return res.status(404).json({ success: false, message: "Chat not found" });
    }

    res.status(200).json({ success: true, data: chat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Update Chat by ID
exports.updateChatById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedChat = await Chat.findByIdAndUpdate(id, req.body, {
      new: true,
      runValidators: true,
    });

    if (!updatedChat) {
      return res.status(404).json({ success: false, message: "Chat not found" });
    }

    res.status(200).json({ success: true, data: updatedChat });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Delete Chat by ID
exports.deleteChatById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedChat = await Chat.findByIdAndDelete(id);

    if (!deletedChat) {
      return res.status(404).json({ success: false, message: "Chat not found" });
    }

    res.status(200).json({ success: true, message: "Chat deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
};

// Purchase credits
exports.purchaseCredits = async (req, res) => {
  try {
    const { customer_id, amount } = req.body;

    // Validate input
    if (!customer_id || !amount) {
      return res.status(400).json({
        success: false,
        message: "Customer ID and amount are required",
      });
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        message: "Amount must be greater than zero",
      });
    }

    // Find user by customer_id
    const user = await User.findOne({ customer_id });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }

    // Calculate credits to add
    const creditsToAdd = Math.floor((amount / 100) * 20); // Example: 20 credits for 100 units of currency

    // Update user's credits
    user.credits += creditsToAdd;
    await user.save();

    // Respond with success message and updated credits
    res.status(200).json({
      success: true,
      message: "Credits purchased successfully",
      data: {
        credits: user.credits,
        creditsAdded: creditsToAdd,
      },
    });
  } catch (error) {
    console.error("Error in purchaseCredits:", error.message);

    // Respond with server error
    res.status(500).json({
      success: false,
      message: "Server error. Please try again later.",
      error: error.message,
    });
  }
};
