const mongoose = require("mongoose");
const { Chat } = require("../models/chatModel");
const { User } = require("../models/userModel");
const { Message } = require("../models/messageModel");

class MessageController {
    async createMessage(req, res) {
        const { chatId, senderId, text } = req.body;

        const t1 = await Chat.findById(chatId);

        if (t1 == null) {
            return res.status(400).json({
                msg: "يجب إنشاء محادثة أولا"
            });
        }

        const t2 = await User.findById(senderId);

        if (t2 == null) {
            return res.status(400).json({
                msg: "لا حساب للمستخدم"
            });
        }

        const message = new Message();

        message.sender = senderId;
        message.chat = chatId;

        message.text = text;

        await message.save();

        const t3 = await Message.findById(message._id).populate([{
            path: "sender",
            select: "-password",
        }, "chat"]);

        return res.status(201).json({
            "msg": "تم إنشاء الرسالة بنجاح",
            message: t3,
        });
    }

    async getAllMessages(req, res) {
        const messages = await Message.find().sort("-_id");

        if (messages.length == 0) {
            return res.status(404).json({
                msg: "لا يوجد محادثات"
            });
        }

        return res.status(200).json({
            messages,
        })
    }

    async getMessagesByChatId(req, res) {
        const { chatId } = req.params;

        const messages = await Message.find({ chat: chatId }).populate([{
            path: "chat",
            populate: {
                path: "members",
                select: "-password"
            }
        }, {
            path: "sender",
            select: "-password",
        }]);

        if (messages.length == 0) {
            return res.status(204).json({});
        }

        return res.status(200).json({
            messages,
        })
    }
}

module.exports = new MessageController();