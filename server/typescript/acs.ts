import { CommunicationIdentityClient } from '@azure/communication-identity';
import { EmailClient, EmailMessage } from '@azure/communication-email';
import { SmsClient, SmsSendResult } from '@azure/communication-sms';
import './config';

const connectionString = process.env.ACS_CONNECTION_STRING as string;

async function createACSToken() {
    const tokenClient = new CommunicationIdentityClient(connectionString);
    const user = await tokenClient.createUser();
    const userToken = await tokenClient.getToken(user, ["voip"]);
    return { userId: user.communicationUserId, ...userToken };
}

async function sendEmail(subject: string, message: string, 
  customerName: string, customerEmailAddress: string) : Promise<{status: boolean, id: string}> {
    const emailClient = new EmailClient(connectionString);
    try {
        const msgObject: EmailMessage = {
          senderAddress: process.env.ACS_EMAIL_ADDRESS as string,
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
      catch (e: unknown) {
        console.log(e);
        return {status: false, id: ''};
      }
}

async function sendSms(message: string, customerPhoneNumber: string): Promise<SmsSendResult[]> {
    const smsClient = new SmsClient(connectionString);

    try {
        const sendResults = await smsClient.send({
            from: process.env.ACS_PHONE_NUMBER as string,
            to: [customerPhoneNumber],
            message: message
        });
        return sendResults;
    }
    catch (e: unknown) {
        console.log(e);
        return [];
    }
}

export { createACSToken, sendEmail, sendSms };