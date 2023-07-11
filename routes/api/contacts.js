const express = require('express');
// const ctrlWrapper = require('../../helpers/ctrlWrapper');

const router = express.Router();

const { checkContactById, checkCreateContactData, checkUpdateContactData, checkUpdateIsFavorite } = require('../../middlewares/contactMiddlewares');
const { getContacts, getContact, postContact, deleteContact, putContact, patchContact } = require('../../controllers/contactsControllers');

router.route('/')
.get(getContacts)
.post(checkCreateContactData, postContact);

router.use('/:contactId', checkContactById);

router.route('/:contactId')
.get(getContact)
.delete(deleteContact)
.put(checkUpdateContactData, putContact)


router.patch('/:contactId/favorite', checkContactById, checkUpdateIsFavorite, patchContact)

module.exports = router;
