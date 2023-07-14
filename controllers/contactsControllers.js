const { userSubscriptionEnum } = require('../constants/userSubscriptionEnum');
const catchAsync = require('../helpers/catchAsync');
const { Contact } = require('../models/contactModel');


exports.getContacts = catchAsync(async (req, res) => {

  const { limit, page, sort = 'name', order, search } = req.query;

  const findOptions = search 
    ? { $or: [ { name: { $regex: search, $options: 'i' } }, { phone: { $regex: search } }] } 
    : {};

  if(search && req.user.subscription === userSubscriptionEnum.STARTER) {
    findOptions.$or.forEach((option) => {option.owner = req.user})
  };

  if(!search && req.user.subscription === userSubscriptionEnum.STARTER) {
    findOptions.owner = req.user;
  };
      
  const contactsQuery = Contact.find(findOptions, "-__v");

  contactsQuery.sort(`${order === 'desc' ? '-' : ''}${sort}`);

  const paginationPage = +page || 1;
  const paginationLimit = +limit || 5;
  const skip = (paginationPage - 1) * paginationLimit;
  contactsQuery.skip(skip).limit(paginationLimit);

  const contacts = await contactsQuery;
  const total = await Contact.count(findOptions);
    
  res.json({ 
    status: 200,
    total,
    contacts
  });
});

exports.getContact = catchAsync(async (req, res) => {
    const { contactId } = req.params;
    const contact = await Contact.findById(contactId);

    if(req.user.subscription !== userSubscriptionEnum.PRO && req.user.id !== contact.owner.toString()) {
      return res.json({ 
        status: 404,
        message: 'Not found'
        })
    };

    if(!contact) {
      res.json({ 
        status: 404,
        message: 'Not found'
        })
        
    } else {
      res.json({ 
        status: 200,
        message: 'Successful request of contact by id',
        contact
        })
    };
});

exports.postContact = catchAsync(async (req, res) => {

  const newContact = await Contact.create({
    favorite: false,
    owner: req.user.id,
    ...req.body
  });

  newContact.password = undefined;

  res.status(201).json(newContact);
});

exports.deleteContact = catchAsync(async (req, res) => {
  const { contactId } = req.params;
  const removedContact = await Contact.findByIdAndDelete(contactId);

  if(req.user.subscription !== userSubscriptionEnum.PRO && req.user.id !== removedContact.owner.toString()) {
    return res.json({ 
      status: 404,
      message: 'Not found'
      })
  };

  if(!removedContact) {
    res.json({ 
      status: 404,
      message: 'Not found' 
    })

  } else {
    res.json({
      status: 200,
      message: "contact deleted",
      contact: removedContact
    })
  }
});

exports.putContact = catchAsync(async (req, res) => {

    const { contactId } = req.params;

    const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });

  if(req.user.subscription !== userSubscriptionEnum.PRO && req.user.id !== result.owner.toString()) {
    return res.json({ 
      status: 404,
      message: 'Not found'
      })
  };

    if(!result) {
      return res.json({
        status: 404,
        "message": "Not found"
      })
    } else {
      return res.json({
        status: 200,
        contact: result
      });
      };
});

exports.patchContact = catchAsync(async (req, res) => {

  const { contactId } = req.params;

  const result = await Contact.findByIdAndUpdate(contactId, req.body, { new: true });

  if(req.user.subscription !== userSubscriptionEnum.PRO && req.user.id !== result.owner.toString()) {
    return res.json({ 
      status: 404,
      message: 'Not found'
      })
  };

  if(!result) {
    return res.json({
      status: 404,
      "message": "Not found"
    })
  } else {
    return res.json({
      status: 200,
      contact: result
    });
  }
});