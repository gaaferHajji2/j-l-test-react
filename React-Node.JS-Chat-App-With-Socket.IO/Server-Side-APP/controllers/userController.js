const bcrypt = require('bcryptjs');

const { User } = require("../models/userModel");

const _ = require('lodash');

const validator = require('validator');

class UserController {
    async registerNewUser(req, res) {
        try {
            let { name, email, password } = req.body;

            if (!name || !email || !password) {
                return res.status(400).json({
                    "status": false,
                    "msg": "كل الحقول مطلوبة"
                });
            }

            let t1 = await User.findOne({ email });

            if (t1 != null) {
                // console.log(t1);

                return res.status(400).json({
                    "status": false,
                    "msg": "الإيميل موجود، قم بتغييره"
                })
            }

            if (!validator.isEmail(email)) {
                return res.status(400).json({
                    "status": false,
                    "msg": "يجب إدخال بريد إلكتروني صحيح"
                });
            }

            let user = new User();

            user.name = name;
            user.email = email;

            let salt = await bcrypt.genSalt(10);

            user.password = await bcrypt.hash(password, salt);

            await user.save();

            let token = user.generateToken();

            return res.status(201).json({
                "status": true,
                // "errSt": "ERR201",
                "msg": "تم إنشاء معلومات المستخدم بنجاح",
                "token": token,
                "user": _.pick(user, "name", "email", "password", "_id"),
            });
        } catch (ex) {
            console.error(ex);

            return res.status(500).json({
                "status": false,
                "msg": "حدث خطأ في السيرفر يرجى المحاولة لاحقا"
            });
        }

    }

    async getAllUsersData(req, res) {
        const data = await User.find({}).select('-password').sort('-_id');

        return res.status(200).json({
            "status": true,
            "errSt": "ERR200",
            "msg": "تم جلب المعلومات بنجاح",
            "data": data,
        });
    }

    async loginUser(req, res) {
        // console.log("The Request Body is: ", req.body);
        
        let user = await User.findOne({ email: req.body.email });

        if (user == null) {
            return res.status(400).json({
                "status": false,
                "msg": "كلمة المرور أو رمز الزميل غير صحيحين 1"
            });
        }

        let check = await user.checkPasswords(req.body.password);

        if (check == false) {
            return res.status(400).json({
                "status": false,
                "msg": "كلمة المرور أو رمز الزميل غير صحيحين 2"
            });
        }

        let token = user.generateToken();

        return res.status(200).json({
            "status": true,
            "msg": "تم تسجيل الدخول بنجاح",
            "user": _.pick(user, ['email', 'name', 'password', '_id']),
            "token": token,
        });
    }

    async findUserById(req, res) {
        let user = await User.findById(req.params.userId);

        if(user == null){
            return res.status(404).json({
                "status": false,
                "msg": "لم يتم العثور على اي مستخدم"
            });
        }

        return res.status(200).json({
            "status": true,
            "msg": "تم جلب معلومات المستخدم بنجاح",
            "data": _.pick(user, ['_id', 'name', 'email', 'password']),
        })
    }
}

module.exports = new UserController();