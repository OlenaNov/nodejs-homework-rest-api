const jwt = require('jsonwebtoken');

const { JWT_SECRET, JWT_EXPIRES_IN } = process.env;

exports.signToken = id => jwt.sign({ id }, JWT_SECRET, {
    expiresIn: JWT_EXPIRES_IN
});