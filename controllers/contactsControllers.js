const catchAsync = require('../helpers/catchAsync');
const { Contact } = require('../models/contactModel');


exports.getContacts = catchAsync(async (_, res) => {

      const contacts = await Contact.find({}, "-__v");
    
      res.json({ 
        status: 200,
        contacts 
      });
});

exports.getContact = catchAsync(async (req, res) => {
    const { contactId } = req.params;
    const contact = await Contact.findById(contactId);

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
    ...req.body
  });

  newContact.password = undefined;

  res.status(201).json(newContact);
});

exports.deleteContact = catchAsync(async (req, res) => {
  const { contactId } = req.params;
  const removedContact = await Contact.findByIdAndDelete(contactId);

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