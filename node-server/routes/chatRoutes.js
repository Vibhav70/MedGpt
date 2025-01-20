const express = require("express");
const { checkCredits } = require("../middleware/checkCredits");
const {
  saveChat,
  getAllChats,
  getChatById,
  updateChatById,
  deleteChatById,
  purchaseCredits,
} = require("../controllers/chatController");
const router = express.Router();

// Route to add a new chat entry
router.post("/", checkCredits, saveChat);

// Route to retrieve all chat entries
router.get("/", getAllChats);

// Route to retrieve a specific chat by ID
router.get("/:id", getChatById);

// Route to update a specific chat entry by ID
router.put("/:id", updateChatById);

// Route to delete a specific chat entry by ID
router.delete("/:id", deleteChatById);

// Route to purchase credits
router.post("/purchase-credits", purchaseCredits);

module.exports = router;
