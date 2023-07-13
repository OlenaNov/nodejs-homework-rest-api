const jwt = require('jsonwebtoken');

const AppError = require("../helpers/appError");
const catchAsync = require("../helpers/catchAsync");
const { signupValidatorRegisterUser, User } = require("../models/userModel");

const checkSignupUserData = catchAsync(async (req, res, next) => {
    
    const { error, value } = signupValidatorRegisterUser(req.body);
    if(error) {
        throw new AppError(400, 'Invalid user data..');
    };

    const userExists = await User.exists({ email: value.email });
    if(userExists) {
        throw new AppError(400, 'User with this email already exists..');
    };

    req.body = value;
    next();
});

const protect = catchAsync(async (req,res, next) => {
    const token = req.headers.authorization?.startsWith('Bearer') && req.headers.authorization.split(' ')[1];
    if(!token) {
        throw new AppError(401, "Not authorized");
    };

    let decoded;
    const { JWT_SECRET } = process.env;
    try {
        decoded = jwt.verify(token, JWT_SECRET)
    } catch (err) {
        console.log(err.message);

        throw new AppError(401, "Not authorized");
    };

    const currentUser = await User.findById(decoded.id);
    if(!currentUser) {
        throw new AppError(401, "Not authorized");
    };

    req.user = currentUser;

    next();
});


const allowFor = (...subscriptions) => (req, res, next) => {
    if(!subscriptions.includes(req.user.subscription)) {
        next(new AppError(403, 'You are not allowed to this resource..'))
    };

    next();
};

module.exports = {
    checkSignupUserData,
    protect,
    allowFor
};

