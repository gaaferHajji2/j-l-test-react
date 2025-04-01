const express = require('express');

const chatController = require("../controllers/chatController");

/**
 * * The Middleware Section.
 */
const chatId = require("../middlewares/objectChatId");

const chatBody = require("../middlewares/chatBody");

const userId = require("../middlewares/objectId");

const getChatParam = require("../middlewares/chatParam");
const chatIdParam = require('../middlewares/chatIdParam');

/**
 * The Router Section.
 */
const router = express.Router();

router.get('/get-all-chats', chatController.getAllChatData);

router.post('/create-new-chat', chatBody, chatController.createChat);

router.get('/get-chat-by-id/:chatId', chatId, chatController.getChatById);

router.get('/get-user-chats-by-user-id/:userId', userId, chatController.getUserChats);

router.get('/get-chat-for-specific-users/:firstId/:secId', getChatParam, chatController.getChatForSpecificUsers);

router.delete('/delete-chat-by-id/:chatId', chatIdParam, chatController.deleteChatById);

module.exports = router;