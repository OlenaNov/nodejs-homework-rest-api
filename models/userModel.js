const { Schema, model } = require('mongoose');
const bcrypt = require('bcrypt');
const Joi = require('joi');
const crypto = require('crypto');

const { userSubscriptionEnum } = require('../constants/userSubscriptionEnum');
const { regex } = require('../constants');

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
        avatarURL: String, 
        token: {
          type: String,
          default: null,
        },
        passwordResetToken: String,
        passwordResetExpires: Date,
        verify: {
          type: Boolean,
          default: false,
        },
        verificationToken: {
          type: String,
          required: [true, 'Verify token is required'],
        },
}, {
    timestamps: true,
    versionKey: false
});

userSchema.pre('save', async function(next) {
    if(this.isNew) {
      const emailHash = crypto.createHash('md5').update(this.email).digest('hex');

      this.avatarURL = `https://www.gravatar.com/avatar/${emailHash}.jpg?d=retro`;
    }

    if(!this.isModified('password')) {
      return next();
    };

    const salt = await bcrypt.genSalt(10);
    this.password = await bcrypt.hash(this.password, salt);

    next();
});

userSchema.methods.checkPassword = (candidate, hash) => bcrypt.compare(candidate, hash);

userSchema.methods.createPasswordResetToken = function() {
  const resetToken = crypto.randomBytes(32).toString('hex'); // generate string of random symbols

  this.passwordResetToken = crypto.createHash('sha256').update(resetToken).digest('hex');
  this.passwordResetExpires = Date.now() + 10 * 60 * 1000;

  return resetToken;
};

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

const updateValidatorPassword = data => Joi.object()
  .options({ abortEarly: false })
  .keys({
    newPassword: Joi.string(),
    // .regex(regex.PASSWORD_REGEX)
    // .required(),

    currentPassword: Joi.string()
    // .required()
  }).validate(data);

module.exports = {
    User,
    signupValidatorRegisterUser,
    updateValidatorPassword
};