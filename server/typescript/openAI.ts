import { OpenAIApi, Configuration } from 'openai';
import './config';
import { QueryData } from './interfaces';

const apiKey = process.env.OPENAI_API_KEY;
const apiEndpoint = process.env.OPENAI_ENDPOINT;

async function getOpenAICompletion(prompt: string, temperature=0, model='gpt-3.5-turbo') {

    if (!apiKey) {
        throw new Error('Missing OpenAI API key in environment variables.');
    }

    const configuration = new Configuration({ apiKey });

    try {
        const openai = new OpenAIApi(configuration);
        const completion = await openai.createChatCompletion({
            model, // gpt-3.5-turbo, gpt-4
            max_tokens: 1024,
            temperature,
            messages: [{ role: 'user', content: prompt }]
        });

        let content = '';
        if (completion.data.choices.length) {
            content = completion.data.choices[0].message?.content.trim() as string;
            console.log('Output:', content);
        }
        return content;
    } 
    catch (e) {
        console.error('Error getting data:', e);
        throw e;
    }
}

async function getSQL(userPrompt: string) : Promise<QueryData> {
    const prompt = `
    PostgreSQL tables, with their properties:

    - customers (id, company, city, email)
    - orders (id, customer_id, date, total)
    - order_items (id, order_id, product_id, quantity, price)
    - reviews (id, customer_id, review, date, comment)

    User prompt: ${userPrompt}

    Rules:
    - Convert any strings to a PostgreSQL parameterized query value to avoid SQL injection attacks.
    
    Return a JSON object with the SQL query and the parameter values in it. 
    
    Example: { "sql": "", "paramValues": [] }
    `;
    let queryData: QueryData = { sql: '', paramValues: [] };
    try {
        const results = await getOpenAICompletion(prompt);
        if (results) {
            queryData = JSON.parse(results);
            if (isProhibitedQuery(queryData.sql)) { 
                queryData.sql = '';
            }
        }
    }
    catch (e) {
        console.log(e);
    }

    return queryData;
}

function isProhibitedQuery(query: string): boolean {
    const prohibitedKeywords = [
        'insert', 'update', 'delete', 'drop', 'truncate', 'alter', 'create', 'replace',
        'information_schema', 'pg_catalog', 'pg_tables', 'pg_namespace', 'pg_class',
        'table_schema', 'table_name', 'column_name', 'column_default', 'is_nullable',
        'data_type', 'udt_name', 'character_maximum_length', 'numeric_precision',
        'numeric_scale', 'datetime_precision', 'interval_type', 'collation_name',
        'grant', 'revoke', 'rollback', 'commit', 'savepoint', 'vacuum', 'analyze'
    ];
    const queryLower = query.toLowerCase();
    return prohibitedKeywords.some(keyword => queryLower.includes(keyword));
}

async function completeEmailSMSMessages(userPrompt: string, company: string, contactName: string) {
    console.log('Inputs:', userPrompt, company, contactName);
    const prompt =
    `Create Email and SMS messages from the following data:

    User Prompt: ${userPrompt}
    Contact Name: ${contactName}

    Rules:
    - Generate a subject line for the email message.
    - Use the User Prompt to generate the messages. 
    - All messages should have a friendly tone. 
    - SMS messages should be in plain text format and no more than 160 characters. 
    - Start the message with "Hi <Contact Name>,\n\n". 
    - Add carriage returns to the email message to make it easier to read. 
    - End with a signature line that says "Sincerely,\nCustomer Service".
    - Return a JSON object with the emailSubject, emailBody, and SMS message values in it. 

    Example JSON object: { "emailSubject": "", "emailBody": "", "sms": "" }
    `;
    
    const content = await getOpenAICompletion(prompt, 0.5);
    return content;
}

export { completeEmailSMSMessages, getSQL };



// Version that works with Azure OpenAI (until they update the APIs)

// async function getOpenAICompletion(prompt, temperature = 0) {

//     if (!apiKey) {
//         throw new Error('Missing OpenAI API key in environment variables.');
//     }

//     const configuration = new Configuration({ 
//         basePath: "https://<base>.openai.azure.com/openai/deployments/gpt-35-turbo",
//         apiKey: ''
//     });

//     try {

//         const openai = new OpenAIApi(configuration);
//         const completion = await openai.createChatCompletion({
//             //model: 'gpt-35-turbo', // 'gpt-4'
//             //max_tokens: 1024,
//             //temperature,
//             messages: [{ role: 'user', content: prompt }]
//         },
//         {
//             headers: {
//               "api-key": configuration.apiKey,
//             },
//             params: {
//               "api-version": "2023-03-15-preview",
//             }
//         });
//         const content = completion.data.choices[0].message.content.trim();
//         console.log(content);
//         return content;
//     } 
//     catch (error) {
//         console.error('Error getting data:', error);
//         throw error;
//     }
// }