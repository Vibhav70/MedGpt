const Chat = require("../models/Chat"); // Assuming you have a Chat model

// Add a new chat entry
exports.saveChat = async (req, res) => {
  try {
    const { customer_id, query, response, date } = req.body;

    // Validate required fields
    if (!customer_id || !query || !response || !date) {
      return res.status(400).json({ success: false, message: "All fields are required" });
    }

    const newChat = new Chat({ customer_id, query, response, date });
    const savedChat = await newChat.save();

    res.status(201).json({ success: true, message: "Chat saved successfully", data: savedChat });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Retrieve all chat entries
exports.getAllChats = async (req, res) => {
  try {
    const chats = await Chat.find();
    res.status(200).json({ success: true, data: chats });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Retrieve a specific chat by ID
exports.getChatById = async (req, res) => {
  try {
    const { id } = req.params;
    const chat = await Chat.findById(id);

    if (!chat) {
      return res.status(404).json({ success: false, message: "Chat not found" });
    }

    res.status(200).json({ success: true, data: chat });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Update a chat entry by ID
exports.updateChatById = async (req, res) => {
  try {
    const { id } = req.params;
    const updatedChat = await Chat.findByIdAndUpdate(id, req.body, { new: true });

    if (!updatedChat) {
      return res.status(404).json({ success: false, message: "Chat not found" });
    }

    res.status(200).json({ success: true, message: "Chat updated successfully", data: updatedChat });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};

// Delete a chat entry by ID
exports.deleteChatById = async (req, res) => {
  try {
    const { id } = req.params;
    const deletedChat = await Chat.findByIdAndDelete(id);

    if (!deletedChat) {
      return res.status(404).json({ success: false, message: "Chat not found" });
    }

    res.status(200).json({ success: true, message: "Chat deleted successfully" });
  } catch (error) {
    res.status(500).json({ success: false, message: "Server error", error: error.message });
  }
};
