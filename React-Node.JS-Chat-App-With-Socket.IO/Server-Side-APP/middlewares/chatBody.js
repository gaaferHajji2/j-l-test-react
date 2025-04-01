const mongoose = require('mongoose');


module.exports = function(req, res, next) {

    if(!mongoose.isValidObjectId(req.body.firstId) || !mongoose.isValidObjectId(req.body.secId)) {
        return res.status(400).json({
            "status": false,
            "msg": "يرجى التحقق من معلومات الإدخال",
        });
    }

    if(req.body.firstId == req.body.secId) {
        return res.status(400).json({
            status: false,
            msg: "لا يمكن محادثة نفسك"
        })
    }

    next();
}