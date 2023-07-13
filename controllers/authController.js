const { userSubscriptionEnum } = require("../constants/userSubscriptionEnum");
const AppError = require("../helpers/appError");
const catchAsync = require("../helpers/catchAsync");
const { signToken } = require("../helpers/signToken");
const { User } = require("../models/userModel");

exports.signup = catchAsync(async (req, res) => {
    
    const newUser = await User.create({
        ...req.body,
        subscription: userSubscriptionEnum.STARTER
    });

    newUser.password = undefined;

    const token = signToken(newUser.id)

    if(newUser) {
        return res.json({
            status: 201,
            message: 'user created',
            user: {
                email: newUser.email,
                subscription: newUser.subscription,
            },
            token
        })
    }
});


exports.login = catchAsync( async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email }).select('+password');

    if(!user) {
        throw new AppError(401, "Email or password is wrong");
    };

    const passwordIsValid = await user.checkPassword(password, user.password);

    if(!passwordIsValid) {
        throw new AppError(401, "Email or password is wrong");
    };

    user.password = undefined;

    const token = signToken(user.id);

    return res.json({
        status: 200,
        user: {
            email: user.email,
            subscription: user.subscription,
        },
        token
    })
});

exports.getMe = (req, res) => { 
    if(!req.user) {
         res.json({
            status: 401,
            "message": "Not authorized"
         })
    }

    res.json({
        status: 200,
        user: {
            email: req.user.email,
            subscription: req.user.subscription
        }
    });
};