const Chat = require("../models/Chat");

const saveChat = async (req, res) => {
  const { customer_id, query, answer } = req.body;
  try {
    const chat = await Chat.create({ customer_id, query, answer });
    res.status(201).json(chat);
  } catch (err) {
    res.status(500).json({ message: "Failed to save chat", error: err.message });
  }
};

const getChatsByCustomer = async (req, res) => {
  const { customer_id } = req.params;
  try {
    const chats = await Chat.find({ customer_id });
    res.status(200).json(chats);
  } catch (err) {
    res.status(500).json({ message: "Failed to retrieve chats", error: err.message });
  }
};

module.exports = { saveChat, getChatsByCustomer };
