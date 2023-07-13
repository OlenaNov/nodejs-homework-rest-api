const express = require('express');
const router = express.Router();

const { signup, login, getMe } = require('../../controllers/authController');
const { checkSignupUserData, protect } = require('../../middlewares/userMiddlewares');


router.use(protect);

router.get('/current', getMe)

router.post('/register', checkSignupUserData, signup);

router.post('/login', login);

module.exports = router;