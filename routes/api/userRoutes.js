const express = require('express');
const router = express.Router();

const { signup, login, getMe, logout } = require('../../controllers/userController');
const { checkSignupUserData, protect } = require('../../middlewares/userMiddlewares');

router.post('/register', checkSignupUserData, signup);
router.post('/login', login);
router.patch('/logout', protect, logout);

router.get('/current', protect, getMe)

module.exports = router;