//batchSend.js
const SibApiV3Sdk = require('sib-api-v3-sdk');

const { API_KEY } = process.env;
SibApiV3Sdk.ApiClient.instance.authentications['api-key'].apiKey = API_KEY;

exports.emailBuilder = (user, resetUrl) => {
   new SibApiV3Sdk.TransactionalEmailsApi().sendTransacEmail({

      "sender":{ "email":"sendinblue@sendinblue.com", "name":"Sendinblue"},
      "subject":"Updated email",
      "htmlContent":"<!DOCTYPE html><html><body><h1>My First Heading</h1><p>My first paragraph.</p></body></html>",
      "params":{
         "greeting":"This is the default greeting",
         "headline":"This is the default headline"
      },
    "messageVersions":[
       {
          "to":[
             {
                "email": user.email,
                "url": resetUrl
             }
          ]
       }
    ]
 
 }).then(function(data) {
   console.log(data);
   return data;
 }, function(error) {
   console.error(error);
 }) 
};
 