const express = require('express');
const router = express.Router();

const { signup, login, getMe } = require('../../controllers/authController');
const { checkSignupUserData, protect } = require('../../middlewares/userMiddlewares');

router.post('/register', checkSignupUserData, signup);
router.post('/login', login);

router.get('/current', protect, getMe)

module.exports = router;