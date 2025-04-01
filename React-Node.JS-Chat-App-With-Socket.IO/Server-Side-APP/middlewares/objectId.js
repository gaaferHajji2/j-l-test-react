const mongoose = require('mongoose');


module.exports = function(req, res, next) {

    if(!mongoose.isValidObjectId(req.params.userId)) {
        return res.status(400).json({
            "status": false,
            "msg": "يرجى التحقق من معلومات الإدخال",
        });
    }

    next();
}