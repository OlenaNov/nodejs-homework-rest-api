const { Schema, model } = require('mongoose');
const Joi = require('joi');
const bcrypt = require('bcrypt');

// const PHONE_REGEX = /^(\d{3}) \d{3}-\d{4}$/;
// const PASSWD_REGEX = /^(?=.*[a-z])(?=.*[A-Z])(?=.*[0-9])(?=.*[!@#\\$%\\^&\\*])(?=.{8,128})/;

const contactSchema = new Schema(
  {
    name: {
      type: String,
      required: [true, 'Set name for contact'],
    },
    email: {
      type: String,
      required: true,
      unique: true
    },
    phone: {
      type: String,
      // match: PHONE_REGEX,
      required: true
    },
    favorite: {
      type: Boolean,
      default: false,
    },
    password: {
      type: String,
      required: true,
      select: false
    }
  }, {
    timestamps: true,
    versionKey: false
  });

contactSchema.pre('save', async function(next) {

  if(!this.isModified('password')) {
    return next();
  };

  const salt = await bcrypt.genSalt(10);
  this.password = await bcrypt.hash(this.password, salt);

  next();
});

contactSchema.methods.checkPassword = (candidate, hash) => 
bcrypt.compare(candidate, hash);

const Contact = model('Contact', contactSchema);


const createValidatorPost = data => Joi.object()
  .options({ abortEarly: false })
  .keys({
    name: Joi.string()
        .min(3)
        .max(30)
        .required(),

    phone: Joi.string()
        .required(),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required(),

    favorite: Joi.bool(),

    password: Joi.string()
    // .regex(PASSWD_REGEX)
    .required(),
})
  .validate(data);

const updateValidatorPut = data => Joi.object()
  .options({ abortEarly: false })
  .keys({
    name: Joi.string()
        .min(3)
        .max(30),

    phone: Joi.string(),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } }),
    
    favorite: Joi.bool()

  }).validate(data);

  const updateValidatorFavorite = data => Joi.object()
    .options({ abortEarly: false })
    .keys({
    favorite: Joi.bool()
  }).validate(data);
  

module.exports = {
  Contact,
  createValidatorPost,
  updateValidatorPut,
  updateValidatorFavorite
};