const { Types } = require('mongoose');

const { Contact, createValidatorPost, updateValidatorPut, updateValidatorFavorite } = require('../models/contactModel');
const AppError = require('../helpers/appError');
const catchAsync = require('../helpers/catchAsync');

const checkContactById = catchAsync(async (req, res, next) => {
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

});

const checkCreateContactData = catchAsync(async (req, res, next) => {
    
    const { error, value } = createValidatorPost(req.body);

    if(error) {
        return next(new AppError(400, 'Invalid contact data..'));
    };

    const contactExists = await Contact.exists({ email: value.email });
    if(contactExists) {
        return next(new AppError(400, 'Contact with this email already exists..'));
    };

    req.body = value;
    next();
});

const checkUpdateContactData = catchAsync(async (req, res, next) => {

    const { error, value } = updateValidatorPut(req.body);

    if(error) {
        return next(new AppError(400, 'Invalid contact data..'));
    };

    const contactExists = await Contact.exists({ email: value.email });

    if(contactExists) {
        return next(new AppError(400, 'Contact with this email already exists..'));
    };

    req.body = value;
    next();
});

const checkUpdateIsFavorite = catchAsync(async (req, res, next) => {
    const { error, value } = updateValidatorFavorite(req.body);

    if(error) {
        return next(new AppError(400, "missing field favorite"));
    };

    req.body = value;
    next();
})

module.exports = {
    checkContactById,
    checkCreateContactData,
    checkUpdateContactData,
    checkUpdateIsFavorite
}