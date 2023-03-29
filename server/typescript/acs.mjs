import { CommunicationIdentityClient } from '@azure/communication-identity';
import { EmailClient } from '@azure/communication-email';
import { SmsClient } from '@azure/communication-sms';
import dotenv from 'dotenv';

dotenv.config();

const connectionString = process.env.ACS_CONNECTION_STRING;

async function createACSToken() {
    const tokenClient = new CommunicationIdentityClient(connectionString);
    const user = await tokenClient.createUser();
    const userToken = await tokenClient.getToken(user, ["voip"]);
    return { userId: user.communicationUserId, ...userToken };
}

async function sendEmail(subject, message, customerName, customerEmailAddress) {
    const emailClient = new EmailClient(connectionString);
    try {
        const msgObject = {
          senderAddress: process.env.ACS_EMAIL_ADDRESS,
          content: {
            subject: subject,
            plainText: message,
          },
          recipients: {
            to: [
              {
                address: customerEmailAddress,
                displayName: customerName,
              },
            ],
          },
        };
    
        // Going with this approach for now since the poller with
        // pollUntilDone() is very slow

        const poller = await emailClient.beginSend(msgObject, { updateIntervalInMs: 100 });
        // const response = await poller.pollUntilDone();
        // console.log(response);
        // return response;
        return new Promise((resolve, reject) => {
          setTimeout(() => {
            resolve({status: true, id: '123'});
          }, 500);
        });
      } 
      catch (e) {
        console.log(e);
        return e;
      }
}

async function sendSms(message, customerPhoneNumber) {
    const smsClient = new SmsClient(connectionString);

    try {
        const sendResults = await smsClient.send({
            from: process.env.ACS_PHONE_NUMBER,
            to: [customerPhoneNumber],
            message: message
        });
        return sendResults;
    }
    catch (e) {
        console.log(e);
        return e;
    }
}

export { createACSToken, sendEmail, sendSms };