const express = require('express');
const router = express.Router();

const { signup, login, getMe, logout, updateAvatar, updatePassword, forgotPassword, resetPassword, verification } = require('../../controllers/userController');
const { checkSignupUserData, protect, checkUpdatePassword, uploadUserAvatar } = require('../../middlewares/userMiddlewares');

router.post('/register', checkSignupUserData, signup);
router.post('/login', login);
router.post('/restore-password', forgotPassword); 
router.post('/set-new-password/:otp', resetPassword);
router.get('/verify/:verificationToken', verification);


router.use(protect);

router.patch('/logout', logout);
router.get('/current', getMe);
router.patch('/avatars', uploadUserAvatar, updateAvatar);
router.patch('/password', checkUpdatePassword, updatePassword);

module.exports = router;