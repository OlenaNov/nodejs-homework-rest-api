const fs = require('fs/promises');
const path = require('path');
const { nanoid }  = require('nanoid');

const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath);
    return JSON.parse(data);

  } catch (err) {
    console.log(err);
    return err;
  }
};

const getContactById = async (contactId) => {
  try {
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);
    const contact = contacts.filter(item => item.id === contactId);
    
    if(!contact.length) {
      return null;
    };

    return contact;

  } catch (error) {
    return "Information on your request was not found, please check the correctness of the request";
  }

};

const removeContact = async (contactId) => {
    try {
      const data = await fs.readFile(contactsPath);
      const contacts = JSON.parse(data);
      const idx = contacts.findIndex(item => item.id === contactId);

      if(idx === -1) {
        return null;
      };

      const [result] = contacts.splice(idx, 1);
      await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
      return result;
      
  } catch (error) {
    return "Information on your request was not found, please check the correctness of the request";
  }
};

const addContact = async (body) => {
  const newContact = {
    ...body,
    id: nanoid()
  };

  try {
    const data = await fs.readFile(contactsPath);
    const contacts = JSON.parse(data);
    contacts.push(newContact);
    await fs.writeFile(contactsPath, JSON.stringify(contacts, null, 2));
    return newContact;
    
  } catch (error) {
    return "To create a new contact, fill in the required fields";
  }
};

const updateContact = async (contactId, body) => {
  const data = await fs.readFile(contactsPath);
  const contacts = JSON.parse(data);
  const newContacts = contacts.map(item => {
    if(item.id === contactId) {
      return ({
        ...item,
        ...body
      });
    };
    return item;
  });

  await fs.writeFile(contactsPath, JSON.stringify(newContacts, null, 2));
  return newContacts.filter(item => item.id === contactId);
};

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
