const express = require("express");
const { checkCredits } = require("../middleware/checkCredits.js");
const {
  getChatsByCustomerId,
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

// Retreive by CustomerID
router.get("/customer/:customer_id", getChatsByCustomerId);

// Route to retrieve a specific chat by ID
router.get("/:id", getChatById);

// Route to update a specific chat entry by ID
router.put("/:id", updateChatById);

// Route to delete a specific chat entry by ID
router.delete("/:id", deleteChatById);

// Route to purchase credits
// router.post("/purchase-credits", purchaseCredits);

module.exports = router;

// b918e0f5-73e0-4b7d-8b60-5643f4b69803
// eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjY3YTMzNWQ3OWQ3ZWQ2MDg2MzVkNzNkOSIsImVtYWlsIjoidGVzdHVzZXJAZXhhbXBsZS5jb20iLCJjdXN0b21lcl9pZCI6ImI5MThlMGY1LTczZTAtNGI3ZC04YjYwLTU2NDNmNGI2OTgwMyIsImlhdCI6MTczODc0OTQ0MiwiZXhwIjoxNzM4NzUzMDQyfQ.QbGfueUh5onhHaDyv_Id_Cq4rwudvTCAPc9hn9HmjCU

// b918e0f5-73e0-4b7d-8b60-5643f4b69803

// 67a3a544e28887df3f573961