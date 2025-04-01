const { Chat } = require("../models/chatModel");
const { User } = require("../models/userModel");

class ChatController {
    async createChat(req, res) {
        const { firstId, secId } = req.body;

        const t1 = await Chat.findOne({ members: { $all: [firstId, secId] } })
            .populate({
                path: "members",
                select: "-password"
            })

        if (t1 != null) {
            return res.status(200).json({
                status: true,
                msg: "Chat Already Exists",
                chat: t1,
            });
        }

        const t2 = await User.findById(firstId);
        const t3 = await User.findById(secId);

        if (t2 == null || t3 == null) {
            return res.status(400).json({
                status: false,
                msg: "يرجى التحقق من البيانات"
            })
        }

        const chat = new Chat();

        chat.members.push(firstId, secId);

        await chat.save();

        const t4 = await Chat.findOne({ members: { $all: [firstId, secId] } })
            .populate({
                path: "members",
                select: "-password"
            })

        return res.status(201).json({
            status: true,
            msg: "Successfully Created Chat",
            chat: t4,
        })
    }

    async getChatById(req, res) {
        let chat = await Chat.findById(req.params.chatId).populate({
            path: "members",
            select: "-password"
        });

        if (chat == null) {
            return res.status(404).json({
                status: false,
                msg: "لم يتم العثور على أي معلومات",
            })
        }

        return res.status(200).json({
            status: true,
            chat: chat,
        })
    }

    async getAllChatData(req, res) {
        const chats = await Chat.find().populate({
            path: "members",
            select: "-password"
        });

        if (chats.length == 0) {
            return res.status(404).json({
                status: false,
                msg: "لم يتم العثور على بيانات"
            })
        }

        return res.status(200).json({
            status: true,
            msg: "تم جلب البيانات بنجاح",
            chats: chats,
        });
    }

    async getUserChats(req, res) {
        const userId = req.params.userId;

        const chats = await Chat.find({ members: { $in: [userId] } }).populate("members");

        if (chats.length == 0) {
            return res.status(204).json({});
        }

        return res.status(200).json({
            chats,
            msg: "تم جلب الرسائل بنجاح"
        })
    }

    async getChatForSpecificUsers(req, res) {
        const { firstId, secId } = req.params;

        const chat = await Chat.findOne({ members: { $all: [firstId, secId] } })
            .populate({
                path: "members",
                select: "-password"
            });
        
        if(chat == null) {
            return res.status(204).json({});
        }

        return res.status(200).json({chat});
    }

    async deleteChatById(req, res) {
        const chatId = req.params.chatId;

        const result = await Chat.findByIdAndDelete(chatId);

        // console.log("The Result of Deleting is: ", result);

        return res.status(204).json({});
    }
}

module.exports = new ChatController();