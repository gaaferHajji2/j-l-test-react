const mongoose = require('mongoose');


module.exports = function(req, res, next) {
    const { firstId, secId } = req.params;

    if(!mongoose.isValidObjectId(firstId) || !mongoose.isValidObjectId(secId)){
        return res.status(400).json({
            "msg": "يرجى التحقق من المعلومات"
        });
    }

    if(firstId === secId) {
        return res.status(400).json({
            msg: "لا يوجد محادثات مع نفسك",
        })
    }

    next();
}