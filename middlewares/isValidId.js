const {  Types } = require('mongoose');
const { Contact } = require('../models/contactModel');
const AppError = require('../helpers/appError');

const isValidId = async (req, res, next) => {
    const { contactId } = req.params;
    const idIsValid = Types.ObjectId.isValid(contactId);

    if(!idIsValid) {
        return next(new AppError(400, 'Bad request..'));
    };

    const contact = await Contact.findById(contactId);

    if (!contact) {
        return next(new AppError(404, 'Contact does not exist..'));
    };

    req.contact = contact;
    next();
};

module.exports = isValidId;