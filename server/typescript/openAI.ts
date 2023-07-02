import fs from 'fs';
import { OpenAIApi, Configuration } from 'openai';
import { QueryData, AzureOpenAIResponse, EmailSmsResponse, OpenAIHeadersBody, ChatGPTData } from './interfaces';
import fetch from 'cross-fetch';
import './config';

const OPENAI_API_KEY = process.env.OPENAI_API_KEY as string;
const OPENAI_ENDPOINT = process.env.OPENAI_ENDPOINT as string;
const OPENAI_MODEL = process.env.OPENAI_MODEL as string;
const OPENAI_API_VERSION = process.env.OPENAI_API_VERSION as string;
const AZURE_COGNITIVE_SEARCH_ENDPOINT = process.env.AZURE_COGNITIVE_SEARCH_ENDPOINT as string;
const AZURE_COGNITIVE_SEARCH_KEY = process.env.AZURE_COGNITIVE_SEARCH_KEY as string;
const AZURE_COGNITIVE_SEARCH_INDEX = process.env.AZURE_COGNITIVE_SEARCH_INDEX as string;

async function getAzureOpenAICompletion(systemPrompt: string, userPrompt: string, temperature: number): Promise<string> {

    const requiredEnvVars = ['OPENAI_API_KEY', 'OPENAI_ENDPOINT', 'OPENAI_MODEL'];

    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            throw new Error(`Missing ${envVar} in environment variables.`);
        }
    }

    // While it's possible to use the OpenAI SDK (as of today) with a little work, we'll use the REST API directly for Azure OpenAI calls.
    // https://learn.microsoft.com/azure/cognitive-services/openai/reference
    const chatGptUrl = `${OPENAI_ENDPOINT}/openai/deployments/${OPENAI_MODEL}/chat/completions?api-version=${OPENAI_API_VERSION}`;

    const messageData: ChatGPTData = {
        max_tokens: 1024,
        temperature,
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
        ]
    };

    const headersBody: OpenAIHeadersBody = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'api-key': OPENAI_API_KEY
        },
        body: JSON.stringify(messageData),
    };

    try {
        const response = await fetch(chatGptUrl, headersBody);
        const completion: AzureOpenAIResponse = await response.json();
        console.log(completion);

        let content = (completion.choices[0]?.message?.content?.trim() ?? '') as string;
        console.log('Azure OpenAI Output: \n', content);

        if (content && content.includes('{') && content.includes('}')) {
            content = extractJson(content);
        }

        return content;
    }
    catch (e) {
        console.error('Error getting data:', e);
        throw e;
    }
}

async function getAzureOpenAIBYODCompletion(systemPrompt: string, userPrompt: string, temperature: number): Promise<string> {

    const requiredEnvVars = [
        'OPENAI_API_KEY',
        'OPENAI_ENDPOINT',
        'OPENAI_MODEL',
        'AZURE_COGNITIVE_SEARCH_ENDPOINT',
        'AZURE_COGNITIVE_SEARCH_KEY',
        'AZURE_COGNITIVE_SEARCH_INDEX',
    ];

    for (const envVar of requiredEnvVars) {
        if (!process.env[envVar]) {
            throw new Error(`Missing ${envVar} in environment variables.`);
        }
    }

    // https://learn.microsoft.com/en-us/azure/cognitive-services/openai/use-your-data-quickstart?tabs=command-line&pivots=rest-api
    const byodUrl = `${OPENAI_ENDPOINT}/openai/deployments/${OPENAI_MODEL}/extensions/chat/completions?api-version=${OPENAI_API_VERSION}`;

    const messageData: ChatGPTData = {
        max_tokens: 1024,
        temperature,
        messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: userPrompt }
        ],
        // Adding BYOD data source so that Cognitive Search is used with Azure OpenAI
        dataSources: [
            {
                type: 'AzureCognitiveSearch',
                parameters: {
                    endpoint: AZURE_COGNITIVE_SEARCH_ENDPOINT,
                    key: AZURE_COGNITIVE_SEARCH_KEY,
                    indexName: AZURE_COGNITIVE_SEARCH_INDEX
                }
            }
        ]
    };

    const headersBody: OpenAIHeadersBody = {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
            'api-key': OPENAI_API_KEY,
            chatgpt_url: byodUrl.replace('extensions/', ''),
            chatgpt_key: OPENAI_API_KEY
        },
        body: JSON.stringify(messageData),
    };

    try {
        const response = await fetch(byodUrl, headersBody);
        const completion = await response.json();
        console.log(completion);

        if (completion.error) {
            return completion.error.message;
        }

        const citations = completion.choices[0].messages[0].content.trim();
        console.log('Azure OpenAI BYOD Citations: \n', citations);

        let content = completion.choices[0].messages[1].content.trim();
        console.log('Azure OpenAI BYOD Output: \n', content);

        return content;

    }
    catch (e) {
        console.error('Error getting BYOD data:', e);
        throw e;
    }
}

async function getOpenAICompletion(systemPrompt: string, userPrompt: string, temperature = 0): Promise<string> {

    if (!OPENAI_API_KEY) {
        throw new Error('Missing OpenAI API key in environment variables.');
    }

    const configuration = new Configuration({ apiKey: OPENAI_API_KEY });

    try {
        const openai = new OpenAIApi(configuration);
        const completion = await openai.createChatCompletion({
            model: 'gpt-3.5-turbo', // gpt-3.5-turbo, gpt-4
            max_tokens: 1024,
            temperature,
            messages: [
                { role: 'system', content: systemPrompt },
                { role: 'user', content: userPrompt }
            ]
        });

        let content = extractJson(completion.data.choices[0]?.message?.content?.trim() ?? '');
        console.log('OpenAI Output: \n', content);
        if (content && content.includes('{') && content.includes('}')) {
            content = extractJson(content);
        }
        return content;
    }
    catch (e) {
        console.error('Error getting data:', e);
        throw e;
    }
}

function callOpenAI(systemPrompt: string, userPrompt: string, temperature = 0, useBYOD = false) {
    const isAzureOpenAI = OPENAI_API_KEY && OPENAI_ENDPOINT && OPENAI_MODEL;

    if (isAzureOpenAI && useBYOD) {
        // Call endpoint that combines Azure OpenAI with Cognitive Search for custom data sources.
        return getAzureOpenAIBYODCompletion(systemPrompt, userPrompt, temperature);
    }

    if (isAzureOpenAI) {
        // Call Azure OpenAI
        return getAzureOpenAICompletion(systemPrompt, userPrompt, temperature);
    }

    // Call OpenAI API directly
    return getOpenAICompletion(systemPrompt, userPrompt, temperature);
}


function extractJson(content: string) {
    const regex = /\{(?:[^{}]|{[^{}]*})*\}/g;
    const match = content.match(regex);

    if (match) {
        return match[0];
    } else {
        return '';
    }
}

async function completeBYOD(userPrompt: string): Promise<string> {
    const systemPrompt = 'You are an AI assistant that helps people find information.';
    // Pass that we're using Cognitive Search along with Azure OpenAI.
    return await callOpenAI(systemPrompt, userPrompt, 0, true);
}

async function getSQLFromNLP(userPrompt: string): Promise<QueryData> {
    // Get the high-level database schema summary to be used in the prompt.
    // The db.schema file could be generated by a background process or the 
    // schema could be dynamically retrieved.
    const dbSchema = await fs.promises.readFile('db.schema', 'utf8');

    const systemPrompt = `
      Assistant is a natural language to SQL bot that returns only a JSON object with the SQL query and 
      the parameter values in it. The SQL will query a PostgreSQL database.
      
      PostgreSQL tables, with their columns:    
  
      ${dbSchema}
  
      Rules:
      - Convert any strings to a PostgreSQL parameterized query value to avoid SQL injection attacks.
      - Always return a JSON object with the SQL query and the parameter values in it.
      - Only return a JSON object. Do NOT include any text outside of the JSON object. Do not provide any additional explanations or context. 
        Just the JSON object is needed.
      - Example JSON object to return: { "sql": "", "paramValues": [] }
    `;

    let queryData: QueryData = { sql: '', paramValues: [], error: '' };
    let results = '';

    try {
        results = await callOpenAI(systemPrompt, userPrompt);
        if (results) {
            console.log('results', results);
            const parsedResults = JSON.parse(results);
            queryData = { ...queryData, ...parsedResults };
            if (isProhibitedQuery(queryData.sql)) {
                queryData.sql = '';
                queryData.error = 'Prohibited query.';
            }
        }
    } catch (error) {
        console.log(error);
        if (isProhibitedQuery(results)) {
            queryData.sql = '';
            queryData.error = 'Prohibited query.';
        } else {
            queryData.error = results;
        }
    }

    return queryData;
}

function isProhibitedQuery(query: string): boolean {
    if (!query) return false;

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

async function completeEmailSMSMessages(prompt: string, company: string, contactName: string) {
    console.log('Inputs:', prompt, company, contactName);

    const systemPrompt = `
      Assistant is a bot designed to help users create email and SMS messages from data and 
      return a JSON object with the email and SMS message information in it.

      Rules:
      - Generate a subject line for the email message.
      - Use the User Rules to generate the messages. 
      - All messages should have a friendly tone and never use inappropriate language.
      - SMS messages should be in plain text format and no more than 160 characters. 
      - Start the message with "Hi <Contact Name>,\n\n". Contact Name can be found in the user prompt.
      - Add carriage returns to the email message to make it easier to read. 
      - End with a signature line that says "Sincerely,\nCustomer Service".
      - Return a JSON object with the emailSubject, emailBody, and SMS message values in it. 

      Example JSON object: { "emailSubject": "", "emailBody": "", "sms": "" }

      - Only return a JSON object. Do NOT include any text outside of the JSON object. Do not provide any additional explanations or context. 
      Just the JSON object is needed.
    `;

    const userPrompt = `
      User Rules: 
      ${prompt}

      Contact Name: 
      ${contactName}
    `;

    let content: EmailSmsResponse = { status: true, email: '', sms: '', error: '' };
    let results = '';
    try {
        results = await callOpenAI(systemPrompt, userPrompt, 0.5);
        if (results) {
            const parsedResults = JSON.parse(results);
            content = { ...content, ...parsedResults, status: true };
        }
    }
    catch (e) {
        console.log(e);
        content.status = false;
        content.error = results;
    }

    return content;
}

export { completeBYOD, completeEmailSMSMessages, getSQLFromNLP as getSQL };