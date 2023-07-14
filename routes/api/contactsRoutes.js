const express = require('express');
const router = express.Router();

const { checkContactById, checkCreateContactData, checkUpdateContactData, checkUpdateIsFavorite } = require('../../middlewares/contactMiddlewares');
const { getContacts, getContact, postContact, deleteContact, putContact, patchContact } = require('../../controllers/contactsControllers');
const { protect, allowFor } = require('../../middlewares/userMiddlewares');
// const { userSubscriptionEnum } = require('../../constants/userSubscriptionEnum');

router.use(protect);

router.route('/')
.get(getContacts)
.post(checkCreateContactData, postContact);

router.use('/:contactId', checkContactById);

router.route('/:contactId')
.get(getContact)
.delete(deleteContact)
.put(checkUpdateContactData, putContact);

// allowFor(userSubscriptionEnum.PRO)
router.patch('/:contactId/favorite', checkUpdateIsFavorite, patchContact);

module.exports = router;
