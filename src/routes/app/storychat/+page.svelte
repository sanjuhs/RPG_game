<script>
	import StoryNav from '$lib/components/story/storyNav.svelte';
	import { marked } from 'marked';
	import { getFirestore, doc, addDoc, getDoc, getDocFromCache } from 'firebase/firestore';
	import { getDocs, updateDoc, setDoc, deleteDoc, collection } from 'firebase/firestore';
	import { query, orderBy, limit, startAfter } from 'firebase/firestore';

	import { appStore, hsStore } from '$lib/components/stores.js';
	import { onMount, afterUpdate } from 'svelte';
	import { goto } from '$app/navigation';
	import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
	import { app, auth, db, storage } from '$lib/components/firebase.js';

	import ChatMessage from '$lib/components/story/ChatMessage.svelte';

	import {
		example_stats_json,
		eiralia_worldData,
		eiralia_starter,
		hero_stat_builder_system_prompt,
		hero_stat_builder_user_prompt,
		storybuilder_prompt,
		diceroll_rules
	} from './prompts.js';

	// world 1 data will have to be loaded from the JSON file that is stored inside
	// hs store will keeptrack of the heros journey

	let messages = [];
	let worldID = $appStore.currentWorld;
	let userID = $appStore.uid;
	let heroID = $appStore.currentHero;
	let loading = false;
	let quickStats;

	let lastMessageElement;
	function handleLastMessageUpdate(event) {
		lastMessageElement = event.detail;
	}
	afterUpdate(() => {
		if (lastMessageElement) {
			lastMessageElement.scrollIntoView({ behavior: 'smooth' });
		}
	});

	onMount(async () => {
		const authChanged = new Promise((resolve) => {
			onAuthStateChanged(auth, async (currentUser) => {
				if (currentUser) {
					appStore.update((cv) => {
						return { ...cv, loggedIn: true, uid: currentUser.uid };
					});
					console.log($appStore.uid, $appStore.loggedIn);
					resolve();
				} else {
					appStore.update((cv) => {
						return { ...cv, loggedIn: false, uid: null };
					});
					resolve();
				}
			});
		});

		await authChanged;
		console.log('The uid is ', $appStore.uid);
		worldID = $appStore.currentWorld;
		userID = $appStore.uid;

		// ^^^^^^^^^^^^  Retrieve messages: ^^^^^^^^^^^^

		const worldDocref = doc(db, 'allMessages', userID, 'worlds', worldID);
		const worldSnap = await getDoc(worldDocref);

		if (worldSnap.exists()) {
			console.log('world Snap exists');
			let mess = await getPaginatedMessages(userID, worldID);
			messages = mess;
			messages = messages;
			console.log(mess);
			// also retrieve the hero stats if they exist in this step
			hsStore.set(worldSnap.data());
			quickStats = await $hsStore;
			console.log('hsStore is ', $hsStore);
		} else {
			// // add an exsits variable
			// await setDoc(worldDocref, { exists: true });
			// console.log(`worldDocref`);

			// create the initial messages
			let messageData1 = {
				text: eiralia_worldData,
				sender: 'bot',
				character: 'na',
				timestamp: Date.now() - 2000
			};
			let messageData2 = {
				text: eiralia_starter,
				sender: 'bot',
				character: 'na',
				timestamp: Date.now()
			};
			// update the let messages
			messages.push(messageData1);
			messages.push(messageData2);
			messages = messages;

			// update the firestore messages
			const messagesRef = collection(doc(db, 'allMessages', userID, 'worlds', worldID), 'messages');
			const docRef1 = await addDoc(messagesRef, messageData1);
			console.log(' the first doc id is ', docRef1.id);
			const docRef2 = await addDoc(messagesRef, messageData2);
			console.log(' the 2nd doc id is ', docRef2.id);

			let statmessages = [];
			let system_prompt2 = hero_stat_builder_system_prompt;
			let user_prompt2 = hero_stat_builder_user_prompt;
			statmessages.push({ role: 'system', content: system_prompt2 });
			statmessages.push({ role: 'user', content: messageData1['text'] });
			statmessages.push({ role: 'user', content: messageData2['text'] });
			statmessages.push({ role: 'user', content: user_prompt2 });
			console.log(statmessages);
			let result_stats = await openAIgenComp(statmessages);
			console.log(result_stats);
			hsStore.set(result_stats);
			console.log($hsStore);
			const worldDocref2 = doc(db, 'allMessages', userID, 'worlds', worldID);
			await setDoc(worldDocref2, JSON.parse(result_stats), { merge: true });
			console.log('updated Hero stats');
			return docRef2.id;
		}
	});

	async function getPaginatedMessages(userID, worldID, firstVisible) {
		const messagesRef = collection(doc(db, 'allMessages', userID, 'worlds', worldID), 'messages');

		// Order by timestamp descendingly for latest messages first
		let q = query(messagesRef, orderBy('timestamp', 'desc'), limit(40));

		if (firstVisible) {
			q = query(messagesRef, orderBy('timestamp', 'desc'), startBefore(firstVisible), limit(40));
		}
		const querySnapshot = await getDocs(q);
		const messages = querySnapshot.docs.map((doc) => doc.data()).reverse(); //------------------------------------------------------
		return messages;
	}

	let chatContainer;

	onMount(async () => {
		const handleScroll = async () => {
			if (chatContainer.scrollTop === 0) {
				// User has scrolled to the top
				const olderMessages = await getPaginatedMessages(userID, worldID, messages[0].timestamp);
				messages = [...olderMessages.reverse(), ...messages];
			}
		};

		chatContainer.addEventListener('scroll', handleScroll);
		return () => {
			chatContainer.removeEventListener('scroll', handleScroll);
		};
	});

	// ^^^^^^^^^^^^^^^ text Input ^^^^^^^^^^^^^^^^^^^

	let inputText = '';

	function handleKeydown(event) {
		if (event.key === 'Enter' && !event.shiftKey) {
			console.log('enter pressed');
			event.preventDefault(); // Prevents adding a new line in case of a textarea
			sendMessage();
		}
	}

	// ^^^^^^^^^^^^^^^ Send Message ^^^^^^^^^^^^^^^^^^^
	async function sendMessage() {
		loading = true;
		console.log('in send message');
		if (inputText.trim() !== '') {
			const worldDocref3 = doc(db, 'allMessages', userID, 'worlds', worldID);
			const messagesRef3 = collection(
				doc(db, 'allMessages', userID, 'worlds', worldID),
				'messages'
			);
			const new_message = { sender: 'user', text: inputText.trim(), character: 'Drufen_w1' };
			messages.push(new_message);
			let diceNo = rollDice(20);
			console.log('rolling Dice of 20 , dice number is = ', diceNo);
			messages.push({ sender: 'dice', text: `dice roll -${diceNo}`, character: 'dice20' });
			messages = messages;
			let mdata1 = {
				text: inputText.trim(),
				sender: 'user',
				character: 'na',
				timestamp: Date.now()
			};
			let mdata2 = {
				text: `dice roll -${diceNo}`,
				sender: 'dice',
				character: 'na',
				timestamp: Date.now()
			};
			const mdataref1 = await addDoc(messagesRef3, mdata1);
			const mdataref2 = await addDoc(messagesRef3, mdata2);

			inputText = '';

			let messages_for_story = [],
				messages_for_stats = [];

			let system_prompt1 = storybuilder_prompt;
			let world_description = eiralia_worldData;

			let chat_history = transformMessagesForStory(messages, userID);
			messages_for_story.push({ role: 'system', content: system_prompt1 });
			messages_for_story.push({ role: 'assistant', content: world_description });
			messages_for_story.push({
				role: 'user',
				content:
					diceroll_rules +
					` So we are starting from this part of the story. you may give options as well , also describe the continuation of the story in depth as an rpg dungeon master. PLease Wait for me to roll the dice myself.`
			});
			messages_for_story.push(...chat_history);

			console.log(messages_for_story);
			let storyresult = await openAIgenComp(messages_for_story);
			messages.push({ sender: 'bot', text: storyresult, character: 'na' });
			messages = messages;

			const heroStats_system_prompt_herostats = `You are a RPG (role playing game) JSON updater that needs to update the state of the game based on the given action information. your reply will include the updating JSON. So that it can be parsed and merged with the current JSON shown.`;
			const heroStats_userprompt = `The information given below is the current Stats of hero and the status of the world.
            Based on the Story till now and Actions described below give me the update JSON. Update the Inventory, Skills as well.
            As skill points increase they can help to improve calss , skills points are capped at 1000.
            make sure to keep increasing XP for every action while reducing xp_to_next_level , so i can level up.
            Also change the hp and the other stats as well for every action.
            Give only the needed updates to the JSON wrapped in 3 quotation marks ''' and do not repeat the whoel JOSN, just the updates.
            `;

			if (!$hsStore) {
				const worldSnap4 = await getDoc(worldDocref3);
				hsStore.set(worldSnap4.data());
			}
			messages_for_stats.push({ role: 'system', content: heroStats_system_prompt_herostats });
			messages_for_stats.push({ role: 'user', content: heroStats_userprompt });
			messages_for_stats.push({ role: 'user', content: JSON.stringify($hsStore) });
			messages_for_stats.push({
				role: 'user',
				content:
					`Story till now:\n\n` +
					inputText.trim() +
					'\n\n' +
					`dice roll -${diceNo}\n\n` +
					`Action taken \n\n` +
					storyresult
			});
			messages_for_stats.push({
				role: 'user',
				content: `Give me the updated JSON , wrapped in 3 quotation marks '''  and then give a breif paragraph of the changes you have made to the JSON. Also make sure to give the result in only a Single JSON with similar schema as before.`
			});

			// check if there exist any stats/ json for the User if not then
			// things needed include latest message of the human + dice roll + AI reply
			//based on which decide to update the stats or add the stats

			let herostatsresult = await openAIgenComp(messages_for_stats);
			// console.log(herostatsresult);
			let updateInfo = separateJSONAndReasoning(herostatsresult);
			console.log(
				'upJSon is ',
				updateInfo['updateJSON'],
				'\n\n reason mess is ',
				updateInfo['reasoning']
			);

			messages.push({ sender: 'reason', text: updateInfo['reasoning'], character: 'na' });
			let update_json_data = JSON.parse(updateInfo['updateJSON']);
			await setDoc(worldDocref3, update_json_data, { merge: true });

			let mdata3 = {
				text: storyresult,
				sender: 'bot',
				character: 'na',
				timestamp: Date.now()
			};
			let mdata4 = {
				text: updateInfo['reasoning'],
				sender: 'reason',
				character: 'na',
				timestamp: Date.now()
			};

			const mdataref3 = await addDoc(messagesRef3, mdata3);
			const mdataref4 = await addDoc(messagesRef3, mdata4);

			hsStore.update((cv) => {
				return { ...cv, ...update_json_data };
			});
			// then update the firestore

			messages = messages;
		}
		loading = false;
	}

	function transformMessagesForStory(messages, userUID, word_limit = 2200) {
		// Map the messages to the desired format
		let messagesForStory = messages
			.filter((msg) => msg.sender !== 'reason')
			.map((msg) => ({
				role:
					msg.sender === userUID || msg.sender === 'user' || msg.sender === 'dice'
						? 'user'
						: 'assistant',
				content: msg.text
			}));

		// Calculate the total word count
		let totalWords = messagesForStory.reduce((acc, msg) => acc + msg.content.split(' ').length, 0);

		// Trim messages until the word count is below the limit
		while (totalWords > word_limit) {
			let removedMessage = messagesForStory.shift();
			totalWords -= removedMessage.content.split(' ').length;
		}

		return messagesForStory;
	}

	async function openAIgenComp(messages) {
		console.log('in openAI gen completions');
		const response = await fetch('/api/completion', {
			method: 'POST',
			body: JSON.stringify({ messages }),
			headers: { 'Content-Type': 'application/json' }
		});
		const result = await response.json();
		console.log(result);
		return result;
	}

	function rollDice(sides = 6) {
		return Math.floor(Math.random() * sides) + 1;
	}

	function separateJSONAndReasoning(str) {
		const parts = str.split("'''");

		const updateJSON = parts[1].trim(); // Take the second part which is the JSON string
		const reasoning = parts[2].trim(); // Take the third part which is the reasoning

		return {
			updateJSON,
			reasoning
		};
	}
</script>

<!-- Essential stats & contextual data & chat HIstory for generating the next state of the game-->
<StoryNav />
<div class="chat-container" bind:this={chatContainer}>
	<div class="chat-header">
		World of Elaria story of Drufen &nbsp;
		<!-- <button on:click={alert(JSON.stringify(quickStats))}>Quick stats</button> -->
	</div>
	<div class="chat-messages">
		{#each messages as message}
			<ChatMessage {message} on:updateLastMessage={handleLastMessageUpdate} />
		{/each}
	</div>
</div>
<div class="chat-input-container sticky">
	<input bind:value={inputText} on:keydown={handleKeydown} placeholder="Type your message..." />
	{#if loading}
		<button disabled>Loading ...</button>
	{:else}
		<button on:click={sendMessage}>Send</button>
	{/if}
</div>

<style>
	.chat-container {
		/* font-family: Arial, sans-serif; */
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

	button:disabled {
		background-color: #bdbdbd;
	}
</style>
