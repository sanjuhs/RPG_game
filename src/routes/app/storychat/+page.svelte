<script>
	import { appStore } from '$lib/components/stores.js';
	import { onMount } from 'svelte';
	import StoryNav from '../../../lib/components/story/storyNav.svelte';
	import { goto } from '$app/navigation';

	// world 1 data will have to be loaded from the JSON file that is stored inside
	// here we will also have to cahce the details we get from the front end

	onMount(() => {
		console.log('The uid is ', $appStore.uid);
		if (!$appStore.uid) {
			goto('/');
		}
	});

	// retrieve messages from firebase > messages>useruid>worldID>MessageIDs
	let messages = [
		{ sender: 'user', text: 'Hello, ChatGPT!' },
		{ sender: 'bot', text: 'Hello! How can I help you?' }
	];
	let inputText = '';

	function handleKeydown(event) {
		if (event.key === 'Enter' && !event.shiftKey) {
			console.log('enter pressed');
			event.preventDefault(); // Prevents adding a new line in case of a textarea
			sendMessage();
		}
	}

	function sendMessage() {
		if (inputText.trim() !== '') {
			messages.push({ sender: 'user', text: inputText.trim() });
			// Here you can also add logic to get a response from ChatGPT or any other backend
			// when a message is sent -- add it to the local messages array
			// then also add the same to firestore Messages DB
			// then call OpenAI API
			// then add that to local messages DB and then
			// then update the firestore

			inputText = '';
			messages = messages;
		}
	}
</script>

<!-- the below will all be loaded by the -->
<!-- the title will be the ROG story-->
<!-- Data Structure needs to be very simple -->
<!-- Essential stats & contextual data & chat HIstory for generating the next state of the game-->
<StoryNav />
<div class="chat-container">
	<div class="chat-header">StoryChat with ChatGPT</div>
	<div class="chat-messages">
		{#each messages as message}
			<div class="chat-message {message.sender}">
				{message.text}
			</div>
		{/each}
	</div>
</div>
<div class="chat-input-container sticky">
	<input bind:value={inputText} on:keydown={handleKeydown} placeholder="Type your message..." />
	<button on:click={sendMessage}>Send</button>
</div>

<style>
	.chat-container {
		font-family: Arial, sans-serif;
		width: 80vw;
		border: 1px solid #ccc;
		border-radius: 5px;
		display: block;
		margin-left: auto;
		margin-right: auto;
		flex-direction: column;
		overflow: hidden;
	}

	.chat-header {
		padding: 10px;
		background-color: #f5f5f5;
		border-bottom: 1px solid #ccc;
		font-weight: bold;
	}

	.chat-messages {
		flex: 1;
		padding: 10px;
		overflow-y: auto;
	}

	.chat-message {
		padding: 8px 10px;
		margin: 5px 0;
		border-radius: 5px;
		max-width: 80%;
	}

	.chat-message.user {
		background-color: #e6f7ff;
		align-self: flex-end;
	}

	.chat-message.bot {
		background-color: #e6ffe6;
	}

	.chat-input-container {
		display: flex;
		border-top: 1px solid #ccc;
	}

	.chat-input-container input {
		flex: 1;
		padding: 10px;
		/* border: none; */
		border-top-left-radius: 5px;
		border-bottom-left-radius: 5px;
	}

	.chat-input-container button {
		padding: 10px 15px;
		border: none;
		background-color: #4caf50;
		color: white;
		border-top-right-radius: 5px;
		border-bottom-right-radius: 5px;
		cursor: pointer;
		transition: background-color 0.3s;
	}

	.chat-input-container button:hover {
		background-color: #45a049;
	}

	.sticky {
		position: -webkit-sticky; /* Safari */
		position: sticky;
		bottom: 0;
		width: 80vw;
		margin-left: auto;
		margin-right: auto;
		border-color: rgb(137, 137, 137);
	}
</style>
