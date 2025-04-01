const mongoose = require('mongoose');

const { User } = require("../models/userModel");

const chatSchema = new mongoose.Schema({
    members: [{
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    }],
}, {timestamps: true});

const Chat = mongoose.model('Chat', chatSchema);

module.exports.chatSchema = chatSchema;

module.exports.Chat = Chat;