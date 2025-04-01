const mongoose = require('mongoose');

const bcrypt   = require('bcryptjs');

const jwt      = require('jsonwebtoken');

const userSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        minLength: 2,
        maxLength: 50,
        trim: true,
    },

    email: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 250,
        trim: true,
        unique: true,
    },

    password: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 1024,
        trim: true,
    }
}, { timestamps: true });

userSchema.methods.checkPasswords = async function(password){
    let check = await bcrypt.compare(password, this.password);

    return check;
}

userSchema.methods.generateToken = function() {
    let secretKey = process.env.J_L_SECRET_KEY;
    // console.log("The Token is: ", secretKey);
    let token = jwt.sign({ id: this._id, email: this.email }, secretKey, { expiresIn: '1w'});

    return token;
}

module.exports.userSchema = userSchema;

module.exports.User = mongoose.model('User', userSchema);