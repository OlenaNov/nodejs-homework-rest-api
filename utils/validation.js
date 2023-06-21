const Joi = require('joi');

const schemaPost = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(3)
        .max(30)
        .required(),

    phone: Joi.string()
        .required(),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
        .required()
}).options({ abortEarly: false });

const schemaPut = Joi.object({
    name: Joi.string()
        .alphanum()
        .min(3)
        .max(30),

    phone: Joi.string(),

    email: Joi.string()
        .email({ minDomainSegments: 2, tlds: { allow: ['com', 'net'] } })
}).options({ abortEarly: false });

module.exports = {
    schemaPost,
    schemaPut
};
