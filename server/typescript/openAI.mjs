import { OpenAIApi, Configuration } from 'openai';
import dotenv from 'dotenv';
dotenv.config();

const apiKey = process.env.OPENAI_API_KEY;

async function getOpenAICompletion(prompt) {

    if (!apiKey) {
        throw new Error('Missing OpenAI API key in environment variables.');
    }

    const configuration = new Configuration({ apiKey });

    try {

        const openai = new OpenAIApi(configuration);
        const completion = await openai.createChatCompletion({
            model: 'gpt-4', // gpt-3.5-turbo
            max_tokens: 1024,
            temperature: 0,
            messages: [{ role: 'user', content: prompt }]
        });
        const content = completion.data.choices[0].message.content.trim();
        console.log(content);
        return content;
    } 
    catch (error) {
        console.error('Error getting data:', error);
        throw error;
    }
}

async function getSQL(userQuery) {
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

    const content = await getOpenAICompletion(prompt);
    return content;
}

export { getSQL };