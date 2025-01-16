const express = require("express");
const { saveChat, getChatsByCustomer } = require("../controllers/chatController");
const router = express.Router();

router.post("/", saveChat);
router.get("/:customer_id", getChatsByCustomer);

module.exports = router;
