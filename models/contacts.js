const fs = require('fs/promises');
const path = require('path');
const { nanoid }  = require('nanoid');

const contactsPath = path.join(__dirname, "contacts.json");

const listContacts = async () => {
  try {
    const data = await fs.readFile(contactsPath);
    return JSON.parse(data);

  } catch (error) {
    return "Information on your request was not found, please check the correctness of the request";
  }
}

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

}

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
}

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
    return "Information on your request was not found, please check the correctness of the request";
  }
}

const updateContact = async (contactId, body) => {}

module.exports = {
  listContacts,
  getContactById,
  removeContact,
  addContact,
  updateContact,
}
