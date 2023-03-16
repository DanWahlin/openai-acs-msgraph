import express from 'express';
import fetch from 'node-fetch';
import dotenv from 'dotenv';

// Load environment variables from the .env file
dotenv.config();

// Replace with your OpenAI API key
const OPENAI_API_KEY = process.env.OPENAI_API_KEY;

if (!OPENAI_API_KEY) {
  throw new Error('Missing OpenAI API key in environment variables.');
}

const app = express();
const port = 3000;

async function generateSQLQuery(userQuery) {
  try {
    const prompt = `Translate the following English query into SQL: "${userQuery}" for a database with the schema:
      - customers (id, first_name, last_name, city, email, registration_date)
      - orders (id, customer_id, order_date, total_price)
      - order_items (id, order_id, product_id, quantity, price)
    SQL query: `;

    const response = await fetch('https://api.openai.com/v1/davinci-codex/completions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${OPENAI_API_KEY}`,
      },
      body: JSON.stringify({
        prompt,
        max_tokens: 100,
        n: 1,
        stop: null,
        temperature: 0.5,
      }),
    });

    const data = await response.json();
    const generatedSQL = data.choices[0].text.trim();
    return generatedSQL;
  } catch (error) {
    console.error('Error generating SQL query:', error);
    throw error;
  }
}

app.post('/generate-sql', async (req, res) => {
  const userQuery = req.body.query;

  if (!userQuery) {
    res.status(400).json({ error: 'Missing query parameter "qquery".' });
    return;
  }

  try {
    const sqlQuery = await generateSQLQuery(userQuery);
    res.json({ sqlQuery });
  } catch (error) {
    res.status(500).json({ error: 'Error generating SQL query.' });
  }
});

app.listen(port, () => {
  console.log(`Example app listening at http://localhost:${port}`);
});
