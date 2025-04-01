const mongoose = require("mongoose");

module.exports = function (req, res, next) {
    const { chatId, senderId } = req.body;

    if (!mongoose.isValidObjectId(chatId) || !mongoose.isValidObjectId(senderId)) {
        return res.status(400).json({
            msg: "يرجى التحقق من المعلومات",
        })
    }

    next();
}