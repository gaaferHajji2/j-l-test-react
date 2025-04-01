const express = require('express');

const userController = require("../controllers/userController");

const userId = require("../middlewares/objectId");

const router = express.Router();

router.get('/', userController.getAllUsersData);

router.post('/register-new-user', userController.registerNewUser);

router.post('/login-user-to-account', userController.loginUser);

router.get('/get-user-data/:userId', userId, userController.findUserById);

module.exports = router;