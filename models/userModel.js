const { Schema, model } = require('mongoose');
const { userSubscriptionEnum } = require('../constants/userSubscriptionEnum');
const bcrypt = require('bcrypt');
const Joi = require('joi');

const userSchema = new Schema({
        password: {
          type: String,
          required: [true, 'Password is required'],
          select: false
        },
        email: {
          type: String,
          required: [true, 'Email is required'],
          unique: true,
        },
        subscription: {
          type: String,
          enum: Object.values(userSubscriptionEnum), 
          default: "starter"
        },
        token: {
          type: String,
          default: null,
        }
}, {
    timestamps: true,
    versionKey: false
});

userSchema.pre('save', async function(next) {
    if(!this.isModified('password')) {
      return next();
    };

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
})

userSchema.methods.checkPassword = (candidate, hash) => bcrypt.compare(candidate, hash);

const User = model('User', userSchema);


const signupValidatorRegisterUser = data => Joi.object()
    .options({ abortEarly: false })
    .keys({
      
        password: Joi.string()
          .required(),

        email: Joi.string()
          .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
          .required(),

        subscription: Joi.string()
          .valid(...Object.values(userSubscriptionEnum)), 
          default: "starter"
          })
    .validate(data);


module.exports = {
    User,
    signupValidatorRegisterUser
};