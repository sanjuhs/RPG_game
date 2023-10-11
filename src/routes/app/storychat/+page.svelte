<script>
	import { appStore, hsStore } from '$lib/components/stores.js';
	import { onMount } from 'svelte';
	import StoryNav from '../../../lib/components/story/storyNav.svelte';
	import { goto } from '$app/navigation';
	import { marked } from 'marked';
	import { db } from '$lib/components/firebase.js';
	import { getFirestore, doc, addDoc, getDoc, getDocFromCache } from 'firebase/firestore';
	import { getDocs, updateDoc, setDoc, deleteDoc, collection } from 'firebase/firestore';
	import { query, orderBy, limit, startAfter } from 'firebase/firestore';

	// world 1 data will have to be loaded from the JSON file that is stored inside
	// here we will also have to cahce the details we get from the front end
	// hsStore is the JSON file that will save all the stats of the hero in JSOn format as well as the levels
	// it is used to keep track of everything

	let messages = [];
	let worldID = $appStore.currentWorld;
	let userID = $appStore.uid;
	let heroID = $appStore.currentHero;
	let loading = false;

	const example_stats_json = `
    { 
	worldinfo: { fact1:"something" , ...other_facts} , 
	characters: { 
		hero:{ 
			name:"Drufen",
			level:1,
			XP: 250,
			xp_points_to_next_level: 3500,
			class:{
				type:"Swift Hunter",
				class_bonus:{
					Hit_Points:{
						comment:" additonal 10",
						change: 10,
					},
					strength:{
						comment:"reduced by 25 as swift-hunter",
						change:-25,
					},
					dextirity:{
						comment:"multiplied by 2 as swift-hunter", 
						change: 45,
					},
					...other_stats
				},
				skills:{
					cooking:5,
					running:15,
					...other_skills
				}
			},
			stats: { 
				Hit_Points:345, strength:17, dextirity:45 , ...other_stats , 
			},
			Inventory:{
				item: no_of_items,
				Mystical_Elf_Arrow:5,
				Letter_from_the_King:1,
			},
			status_effects:{
				energy_bar:{
					turns:2,
					change:{
						Hit_Points: 3
					}
				}
			}
		},
		party_member_1:{
			name:"Lireal",
			level:1,
			XP: 250,
			xp_points_to_next_level: 3500,
			class:{
		},
		enemies:{
			name:"WildBoar" ,
			level: 15,
			class:{
				type:"boss_animal",
			},
			stats:{
				Hit_Points:450, strength:21, dextirity:3 , ...other_stats
			},
			status_effects:{
				..
			}
		},
		} 
	}
} 
    `;

	onMount(async () => {
		console.log('The uid is ', $appStore.uid);
		if (!$appStore.uid) {
			goto('/');
		}

		// ^^^^^^^^^^^^  Retrieve messages: ^^^^^^^^^^^^

		const worldDocref = doc(db, 'allMessages', userID, 'worlds', worldID);
		const worldSnap = await getDoc(worldDocref);

		if (worldSnap.exists()) {
			let mess = await getPaginatedMessages(userID, worldID);
			messages = mess;
			messages = messages;
			console.log(mess);
			// also retrieve the hero stats if they exist in this step
			hsStore.set(worldSnap.data());
			console.log('hsStore is ', $hsStore);
		} else {
			// add an exsits variable
			await setDoc(worldDocref, { exists: true });
			console.log(`Updated exists with id exists under worldDocref`);

			// create the initial messages
			let messageData1 = {
				text: `In the mystical realm of Eiralia, where magical forests blend seamlessly into towering mountain ranges, lies a secluded elven village known as StrafenFallVilage. 
                Nestled at the base of the Whispering Waterfalls, this druidic haven is a sanctuary for all things natural. 
                The community is led by High Druid Elira Moonshade, a wise elf who has lived for centuries and has a deep connection with the forest spirits. StrafenFallVilage is renowned for its enchanted gardens, where flora and fauna coexist in magical harmony.
                `,
				sender: 'bot',
				character: 'na',
				timestamp: Date.now() - 2000
			};
			let messageData2 = {
				text: `
                Today, the village is abuzz with excitement; the annual Festival of the Emerald Leaves is about to commence. This festival celebrates the onset of autumn and is a time when druids from neighboring regions gather to exchange knowledge and partake in ancient rituals.

**Amidst the backdrop of the Festival of the Emerald Leaves in StrafenFallVilage, a new figure walks into the elven enclave...**

You play as Drufen, a skilled human hunter, who steps through the mystical barriers, that shield the village from the outside world. Though the festival is a spectacle to behold, Drufen has little time for celebration. He's on a mission to find the best rum for King Miradas, a monarch from a neighboring human kingdom, and to deliver a concealed message to High Druid Elira Moonshade.

### Drufen's Entry ,

As Drufen enters the village, he's immediately captivated by its ethereal beauty. The moonlight dances on the surface of the Whispering Waterfalls, and magical lanterns float through the air, illuminating the ancient trees. But Drufen is a man of focus; he shakes off the allure of the surroundings and proceeds toward the village square, where a grand market is set up for the festival.
Stalls are abundant with exotic herbs, magical artifacts, and enchanted clothing. However, his eyes are set on a particular tent at the far end, adorned with various bottles and casks—this must be where the famed elven rum is sold.

### The Rum and the Message ..!

Finding the rum is only half the battle. Drufen also bears a sealed letter from King Miradas, a message meant for the eyes of High Druid Elira Moonshade. The contents of the message are unknown to him, but the wax seal of the king's sigil suggests its importance.

                `,
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
			let system_prompt2 = `You are an expert RPG dungeon master BOT who updates the stats of hero and the world around him. You store relevant information from the world in JSON format 
            and display important information such as stats and Inventory of the hero in the form of JSON. You usually structure your information in the schema of 
            ${example_stats_json} 
            remember you do not need to add party members unless they explicitly join you. SImilarly you do not need to add the enemy unless its in combat. 
            In case the enemy escapes or retrests or its HP goes to Zero the enemy will stay in combat. You do not need to take facts needless unless it is directly related to the quests or setting of the world.
            Please Reply only in JSON.
            `;

			let user_prompt2 = `looking at the above begining of the story , please generate the hero stats for our hero Drufen. Also update the Inventory  Please Reply only in JSON.`;
			statmessages.push({ role: 'system', content: system_prompt2 });
			statmessages.push({ role: 'user', content: messageData1['text'] });
			statmessages.push({ role: 'user', content: messageData2['text'] });
			statmessages.push({ role: 'user', content: user_prompt2 });
			console.log(statmessages);
			let result_stats = await openAIgenComp(statmessages);
			console.log(result_stats);
			hsStore.set(result_stats);
			console.log($hsStore);
			await updateDoc(worldDocref, JSON.parse(result_stats));
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

	onMount(() => {
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
			const new_message = { sender: 'user', text: inputText.trim(), character: 'Drufen_w1' };
			messages.push(new_message);
			let diceNo = rollDice(20);
			console.log('rolling Dice of 20 , dice number is = ', diceNo);
			messages.push({ sender: 'dice', text: `dice roll -${diceNo}`, character: 'dice20' });

			let messages_for_story = [],
				messages_for_stats = [];

			let system_prompt1 =
				'You are an expert RPG dungeon master and will help me build a story along the way as we go back and forth';
			let world_description =
				'This is the mystical other worldly realm of Eiralia, where magical forests blend seamlessly into towering mountain ranges, where all is accepted from magic to might, from a variety of races from elves to orcs to humans , to many more.';

			let chat_history = transformMessagesForStory(messages, userID);
			messages_for_story.push({ role: 'system', content: system_prompt1 });
			messages_for_story.push({ role: 'assistant', content: world_description });
			messages_for_story.push({
				role: 'user',
				content: ` 
A dice roll of 20 is apart of the game and happens whenever any action is taken. I will add the dice roll below my action every-time. Make sure to alter the outcomes of the actions based on the roll.
A dice roll of 1- 20 , where a roll of 14 is neutral , roll of 7 or lower is bad , and roll of 2-3 or lower is very very bad and can hurt badly / create a disaster /boost enemy is diaadvantageous etc  depending on the action taken. Whereas a roll of 17 is good and roll of 18 and above is considered amazing and can actually lead to some amzing outcomes/ miracle level.
                So we are starting from this part of the story
                `
			});
			messages_for_story.push(...chat_history);

			console.log(messages_for_story);
			let storyresult = await openAIgenComp(messages_for_story);
			messages.push({ sender: 'bot', text: storyresult, character: 'na' });

			// check if there exist any stats/ json for the User if not then
			// things needed include latest message of the human + dice roll + AI reply
			//based on which decide to update the stats or add the stats

			// let herostatsresult = openAIgenComp(messages_for_stats);

			// Here you can also add logic to get a response from ChatGPT or any other backend
			// when a message is sent -- add it to the local messages array
			// then also add the same to firestore Messages DB
			// then call OpenAI API
			// then add that to local messages DB and then
			// then update the firestore

			inputText = '';
			messages = messages;
		}
		loading = false;
	}

	function transformMessagesForStory(messages, userUID, word_limit = 2200) {
		// Map the messages to the desired format
		let messagesForStory = messages.map((msg) => ({
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
</script>

<!-- Essential stats & contextual data & chat HIstory for generating the next state of the game-->
<StoryNav />
<div class="chat-container" bind:this={chatContainer}>
	<div class="chat-header">World of Elaria story of Drufen</div>
	<div class="chat-messages">
		{#each messages as message}
			<div class="chat-message {message.sender}">
				{@html marked(String(message.text))}
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

	.chat-message.dice {
		background-color: #fce3ce;
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
