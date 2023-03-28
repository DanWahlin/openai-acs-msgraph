import { CommunicationIdentityClient } from '@azure/communication-identity';
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

async function sendEmail(message, email) {

}

async function sendSms(message, customerPhoneNumber) {
    const smsClient = new SmsClient(connectionString);

    const sendResults = await smsClient.send({
        from: process.env.ACS_PHONE_NUMBER,
        to: [customerPhoneNumber],
        message: message
    });
    return sendResults;
}

export { createACSToken, sendEmail, sendSms };