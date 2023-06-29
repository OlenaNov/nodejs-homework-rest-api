const Joi = require('joi');

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
    schemaPut
};
