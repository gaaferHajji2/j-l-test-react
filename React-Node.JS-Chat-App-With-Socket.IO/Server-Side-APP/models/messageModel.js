const mongoose = require("mongoose");

const messageSchema = new mongoose.Schema({
    chat: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Chat',
        required: true,
    },

    sender: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: true,
    },

    text: {
        type: String,
        required: true,
        trim: true,
        minLength: 2,
    },
}, { timestamps: true });

const Message = mongoose.model('Message', messageSchema);

module.exports.messageSchema = messageSchema;

module.exports.Message = Message;