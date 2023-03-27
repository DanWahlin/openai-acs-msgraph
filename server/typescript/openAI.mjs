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

export { getOpenAICompletion };