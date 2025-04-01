const mongoose = require("mongoose");

module.exports = function (req, res, next) {
    const { chatId } = req.params;

    if (!mongoose.isValidObjectId(chatId)) {
        return res.status(400).json({
            msg: "يرجى التحقق من المعلومات",
        });
    }

    next();
}