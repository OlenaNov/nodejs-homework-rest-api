const express = require('express');

const router = express.Router();
const API = require('../../models/contacts');

router.get('/', async (req, res, next) => {
  const contacts = await API.listContacts();
  res.json({ 
    status: 200,
    contacts 
  });
})

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
  }

})

router.post('/', async (req, res, next) => {
  const body = req.body;
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
})

router.delete('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

router.put('/:contactId', async (req, res, next) => {
  res.json({ message: 'template message' })
})

module.exports = router
