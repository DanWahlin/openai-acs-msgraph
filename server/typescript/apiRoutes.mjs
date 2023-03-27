import pkg from 'express';
import dotenv from 'dotenv';

import { createACSToken, sendSms } from './acs.mjs';
import { initializeDb } from './initDatabase.mjs';
import { getOpenAICompletion } from './openai.mjs';
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
    const userQuery = req.body.query; // 'Get the total revenue for all orders';

    if (!userQuery) {
        return res.status(400).json({ error: 'Missing parameter "query".' });
    }

    const prompt =
    `Postgres SQL tables, with their properties:

    - customers (id, company, city, email)
    - orders (id, customer_id, date, total)
    - order_items (id, order_id, product_id, quantity, price)
    - reviews (id, customer_id, review, date, comment)

    Rules:
    - Only allow SELECT queries. UPDATE, INSERT, DELETE are not allowed.
    - Convert any strings to a Postgresql parameterized query value to avoid SQL injection attacks.

    User query: ${userQuery}

    Return a JSON object with the SQL query and the parameter values in it. 
    Example: { "sql": "", "paramValues": [] } 
    `;

    try {
        const sqlCommandObject = await getOpenAICompletion(prompt);
        let result = [];
        if (sqlCommandObject) {
            result = await queryDb(JSON.parse(sqlCommandObject));
        }
        res.json(result);
    } catch (error) {
        res.status(500).json({ error: 'Error generating SQL query.' });
    }
});

router.post('/sendsms', async (req, res) => {
    const message = req.body.message;
    const toPhoneNumber = req.body.toPhone;

    if (!message || !toPhoneNumber) {
        return res.status(400).json({  
            status: false,
            message: 'Message and toPhone must be provided!'
        });
    }

    try {
        const sendResults = await sendSms(message, toPhoneNumber);
        res.json({
            status: sendResults[0].successful,
            messageId: sendResults[0].messageId,
            message: ''
        });
    }
    catch (e) {
        res.status(500).json({
            status: false,
            messageId: '',
            message: e.message
        });
    }
});



export default router;