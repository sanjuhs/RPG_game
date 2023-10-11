import { json } from '@sveltejs/kit';
import dotenv from 'dotenv';
dotenv.config();
const apiKeyValue = import.meta.env.VITE_MY_OPENAI_KEY;
import OpenAI from 'openai';
const openai = new OpenAI({
	apiKey: apiKeyValue,
	dangerouslyAllowBrowser: true
});

export async function GET({ request }) {
	console.log(request);
	console.log('touched the get api in completons');
	const status = 'Successs';
	return json(status);
}

export async function POST({ request }) {
	console.log('completions api');
	console.log(request);
	const data1 = await request.json();

	const response = await openai.chat.completions.create({
		model: 'gpt-3.5-turbo',
		messages: data1['messages']
	});

	const result = response.choices[0].message.content;
	console.log(result);
	return json(result);
}
