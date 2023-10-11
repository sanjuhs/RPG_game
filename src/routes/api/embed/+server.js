import { json } from '@sveltejs/kit';
import dotenv from 'dotenv';
dotenv.config();
const apiKeyValue = import.meta.env.VITE_MY_OPENAI_KEY;
const apiUrl = 'https://api.openai.com/v1/embeddings';

// the following function retruns an array of 1536 numbers which represent the embeddings of the text
export async function POST({ request }) {
	// console.log(request);
	try {
		const data1 = await request.json();
		// console.log(data1);
		let embedding;

		const requestData = {
			input: data1['text'],
			model: 'text-embedding-ada-002'
		};

		const response = await fetch(apiUrl, {
			method: 'POST',
			headers: {
				'Content-Type': 'application/json',
				Authorization: `Bearer ${apiKeyValue}`
			},
			body: JSON.stringify(requestData)
		});

		if (!response.ok) {
			throw new Error('Error fetching embeddings from OpenAI');
		}

		const data = await response.json();
		// console.log('------------');
		embedding = data['data'][0]['embedding'];
		// console.log(embedding);
		return json(embedding, { status: 200 });
	} catch (e) {
		console.error(e);
		return json({ error: e.message }, { status: 500 });
	}
}
