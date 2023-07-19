const crypto = require('crypto');
// const nodemailer = require('nodemailer');
const { userSubscriptionEnum } = require("../constants/userSubscriptionEnum");
const AppError = require("../helpers/appError");
const catchAsync = require("../helpers/catchAsync");
const { signToken } = require("../helpers/signToken");
const { User } = require("../models/userModel");
const ImageService = require("../services/imageService");
const { log } = require('console');
const { emailBuilder } = require('../services/emailBuilder');


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

exports.logout = catchAsync(async (req, res) => {
    const { id } = req.user;

    const user = await User.findByIdAndUpdate(id, { token: '' });

    if(!user) {
        return res.json({
          status: 401,
          "message": "Not authorized"
        })
      } else {
        return res.json({
          status: 204
        });
      }
});

exports.updateAvatar = catchAsync(async (req, res) => {
   const { user, file } = req;

   if(file) {
    user.avatarURL = await ImageService.save(file, { width: 250, height: 250 }, 'avatars', user.id)
   }
//    console.log(file);

//    user.avatarURL = req.body.avatarURL;
//    console.log(user); 

   const updatedUser = await user.save();

   if(updatedUser) {
    res.json({
        status: 200,
        user: updatedUser
    });
   }
});

exports.updatePassword = catchAsync(async (req, res) => {

    res.json({
        status: 200,
        message: 'Success, password is updated!',
        user: req.user
    });
});

exports.forgotPassword = catchAsync(async (req, res) => {
    const { email } = req.body;

    const user = await User.findOne({ email });

    if(!user) {
        return res.json({
            status: 200,
            message: 'Password reset instruction sent to email..'
        });
    };
    // one time password
    const otp = user.createPasswordResetToken();

    await user.save();

    try {

        const resetUrl = `${req.protocol}://${req.get('host')}/api/users/set-new-password/${otp}`;

        console.log(resetUrl);
        
        const result = await emailBuilder(user, resetUrl);
        console.log(result);
        // const config = {
        //     host: 'smtp-relay.sendinblue.com',
        //     port: 587,
        //     secure: true,
        //     auth: {
        //         user: process.env.EMAIL_USER,
        //         pass: process.env.EMAIL_PASSWORD
        //     },
        //   };

        // const email = {
        //     from: 'logupp.13@gmail.com',
        //     to: user.email,
            

        // }


    } catch (err) {
        console.log(err);

        user.passwordResetToken = undefined;
        user.passwordResetExpires = undefined;

        await user.save();
    };

    return res.json({
        status: 200,
        message: 'Password reset instruction sent to email..'
    });

//     try {
//         const resetUrl = `${req.protocol}://${req.get('host')}/api/users/set-new-password/${otp}`;
//         console.log('||=============>>>>>>>>>>>>>>>');
//         console.log(resetUrl);
//         console.log('<<<<<<<<<<<<<<<=============||');

//         const config = {
//             host: 'smtp-relay.sendinblue.com',
//             port: 587,
//             secure: true,
//             auth: {
//                 user: process.env.EMAIL_USER,
//                 pass: process.env.EMAIL_PASSWORD
//             },
//           };

//         const transporter = nodemailer.createTransport(config);



// const emailOptions = {
//   from: 'Todos app admin <admin@example.com>',
//   to: user.email,
//   subject: 'Nodemailer test',
//   text: 'Привет. Мы тестируем отправку писем!',
// };

// transporter
//   .sendMail(emailOptions)
//   .then(info => console.log(info))
//   .catch(err => console.log(err));

//     } catch (err) {
//         console.log(err);

//         user.createPasswordResetToken = undefined;
//         user.passwordResetExpires = undefined;

//         await user.save();
//     };

//     // await user.save();

//     return res.json({
//         status: 200,
//         message: 'Password reset instruction sent to email..'
//     });
    
});

exports.resetPassword = catchAsync(async (req, res) => {

    const hashedToken = crypto.createHash('sha256').update(req.params.otp).digest('hex');

    const user = await User.findOne({
        passwordResetToken: hashedToken,
        passwordResetExpires: { $gt: Date.now() }
    });

    if(!user) {
        throw new AppError(400, 'Token is invalid..');
    };

    user.password = req.body.password;
    user.passwordResetToken = undefined;
    user.passwordResetExpires = undefined;

    await user.save();

    user.password = undefined;

    res.json({
        user
    });
});