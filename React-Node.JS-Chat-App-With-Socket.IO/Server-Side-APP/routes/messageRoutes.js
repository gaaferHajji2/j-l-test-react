const express = require("express");

const messageBody = require("../middlewares/messageBody");

const chatIdParam = require("../middlewares/chatIdParam");

const messageController = require("../controllers/messageController");

const router = express.Router();

router.post("/create-new-message", messageBody, messageController.createMessage);

router.get("/get-all-messages", messageController.getAllMessages);

router.get("/get-chat-messages-by-chat-id/:chatId", chatIdParam, messageController.getMessagesByChatId);

module.exports = router;