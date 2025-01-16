const mongoose = require("mongoose");

const chatSchema = new mongoose.Schema({
  customer_id: {
    type: String,
    required: true,
  },
  query: {
    type: String,
    required: true,
  },
  response: {
    type: String,
    required: true,
  },
  date: {
    type: Date,
    required: true,
  },
});

const Chat = mongoose.model("Chat", chatSchema);

module.exports = Chat;
