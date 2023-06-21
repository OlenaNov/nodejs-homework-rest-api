const express = require('express');

const router = express.Router();
const API = require('../../models/contacts');
const { schemaPost, schemaPut } = require('../../utils/validation');


router.get('/', async (req, res, next) => {
  const contacts = await API.listContacts();
  res.json({ 
    status: 200,
    contacts 
  });
  next();
});

router.get('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  const contact = await API.getContactById(contactId);
  
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
  next();
});

router.post('/', async (req, res, next) => {

  try {
    const body = await schemaPost.validateAsync({ ...req.body });

    const newContact = await API.addContact(body);

    if(!newContact) {
      res.json({
        status: 400,
        message: "missing required name field"
      })
    } else {
      res.json({ 
        status: 201,
        newContact
      })
    }

  }
  catch (error) { 
    next(error);
  };

});

router.delete('/:contactId', async (req, res, next) => {
  const { contactId } = req.params;
  const removedContact = await API.removeContact(contactId);

  if(!removedContact) {
    res.json({ 
      status: 404,
      message: 'Not found' 
    })

  } else {
    res.json({
      status: 200,
      message: "contact deleted",
      removedContact
    })
  }
  next();
});

router.put('/:contactId', async (req, res, next) => {
  try {

    const { contactId } = req.params;
    const body = await schemaPut.validateAsync({...req.body});
    
    if(!Object.keys(body).length) {
      return res.json({
        status: 400,
        "message": "missing fields"
      });
    }
    const result = await API.updateContact(contactId, body);
  
    if(!result) {
      return res.json({
        status: 404,
        "message": "Not found"
      })
    } else {
      return res.json({
        status: 200,
        result
      })
    }
  } catch (error) {
    next(error);
  }
});

module.exports = router
