import pkg from 'express';
import dotenv from 'dotenv';

import { createACSToken, sendEmail, sendSms } from './acs.mjs';
import { initializeDb } from './initDatabase.mjs';
import { completeEmailSMSMessages, getSQL } from './openai.mjs';
import { getCustomers, queryDb } from './postgres.mjs';

const { Router } = pkg;
dotenv.config();

const router = Router();

initializeDb().catch(err => console.error(err));

router.get('/acstoken', async (req, res) => {
    const token = await createACSToken();
    res.json(token);
});

router.get('/customers', async (req, res) => {
    try {
        const results = await getCustomers();
        if (results && results.rows) {
            res.json(results.rows);
        }
        else {
            res.json([]);
        }
    }
    catch (error) {
        console.error('Error retrieving customers:', error);
        res.status(500).json({ error: 'Error retrieving customers.' });
    }
});

router.post('/generatesql', async (req, res) => {
    const userQuery = req.body.query;

    if (!userQuery) {
        return res.status(400).json({ error: 'Missing parameter "query".' });
    }

    try {
        // Call OpenAI to convert the user query into a SQL query
        const sqlCommandObject = await getSQL(userQuery);
        let result = [];

        // Execute the SQL query
        if (sqlCommandObject) {
            result = await queryDb(JSON.parse(sqlCommandObject));
        }
        res.json(result);
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: 'Error generating SQL query.' });
    }
});

router.post('/sendemail', async (req, res) => {
    const { subject, message, customerName, customerEmailAddress } = req.body;

    if (!subject || !message || !customerName || !customerEmailAddress) {
        return res.status(400).json({
            status: false,
            message: 'The subject, message, customerName, and customerEmailAddress parameters must be provided!'
        });
    }

    try {
        const sendResults = await sendEmail(subject, message, customerName, customerEmailAddress);
        console.log(sendResults);
        res.json({
            status: sendResults.status,
            messageId: sendResults.id,
            message: ''
        });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({
            status: false,
            messageId: '',
            message: e.message
        });
    }
});

router.post('/sendsms', async (req, res) => {
    const message = req.body.message;
    const customerPhoneNumber = req.body.customerPhoneNumber;

    if (!message || !customerPhoneNumber) {
        return res.status(400).json({
            status: false,
            message: 'The message and customerPhoneNumber parameters must be provided!'
        });
    }

    try {
        const sendResults = await sendSms(message, customerPhoneNumber);
        res.json({
            status: sendResults[0].successful,
            messageId: sendResults[0].messageId,
            message: ''
        });
    }
    catch (e) {
        console.error(e);
        res.status(500).json({
            status: false,
            messageId: '',
            message: e.message
        });
    }
});

router.post('/completeEmailSmsMessages', async (req, res) => {
    const { query, company, contactName } = req.body;

    if (!query || !company || !contactName) {
        return res.status(400).json({ 
            status: false, 
            error: 'The query, company, and contactName parameters must be provided.' 
        });
    }

    let result = { status: false, email: '', sms: '' };
    try {
        // Call OpenAI to get the email and SMS message completions
        const content = await completeEmailSMSMessages(query, company, contactName);
        if (content) {
            result = {status: true, ...JSON.parse(content) };
        }
    }
    catch (e) {
        console.error('Error parsing JSON:', e);
    }

    res.json(result);
});

export default router;