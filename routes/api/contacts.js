const express = require('express');

const router = express.Router();

const { getContacts, getContact, postContact, deleteContact, putContact } = require('../../controllers/contactsControllers');

router.route('/')
.get(getContacts)
.post(postContact)

router.route('/:contactId')
.get(getContact)
.delete(deleteContact)
.put(putContact);

module.exports = router;
