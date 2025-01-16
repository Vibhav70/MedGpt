const express = require("express");
const {
  saveChat,
  getAllChats,
  getChatById,
  updateChatById,
  deleteChatById,
} = require("../controllers/chatController");
const router = express.Router();

// Route to add a new chat entry
router.post("/", saveChat);

// Route to retrieve all chat entries
router.get("/", getAllChats);

// Route to retrieve a specific chat by ID
router.get("/:id", getChatById);

// Route to update a specific chat entry by ID
router.put("/:id", updateChatById);

// Route to delete a specific chat entry by ID
router.delete("/:id", deleteChatById);

module.exports = router;
