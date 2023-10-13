<script>
	import { appStore, hsStore } from '$lib/components/stores.js';
	import { onMount } from 'svelte';
	import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
	import { app, auth, db, storage } from '$lib/components/firebase.js';
	import { goto } from '$app/navigation';

	import { marked } from 'marked';
	import StoryNav from '$lib/components/story/storyNav.svelte';

	import { doc, getDoc } from 'firebase/firestore';

	console.log($hsStore);
	let ge;
	let Keylist = [];
	let heroobj;

	onMount(async () => {
		console.log('moutninggggg');
		const authChanged = new Promise((resolve) => {
			onAuthStateChanged(auth, async (currentUser) => {
				if (currentUser) {
					appStore.update((cv) => {
						return { ...cv, loggedIn: true, uid: currentUser.uid };
					});
					console.log('first set ', $appStore.uid, $appStore.loggedIn, $appStore.currentWorld);

					//if hsStore is not existent reload hsStore from World Snap here
					let worldID = $appStore.currentWorld;
					let userID = $appStore.uid;
					if (!$hsStore) {
						const worldDocref = doc(db, 'allMessages', userID, 'worlds', worldID);
						const worldSnap = await getDoc(worldDocref);
						hsStore.set(worldSnap.data());
					}
					resolve();
				} else {
					appStore.update((cv) => {
						return { ...cv, loggedIn: false, uid: null };
					});
					resolve();
					goto('/');
				}
			});
		});

		await authChanged;
		ge = JSON.stringify($hsStore);
		Keylist = displayKeys($hsStore);
		heroobj = console.log('key list is ', Keylist);
	});

	function displayKeys(obj, prefix = '') {
		let keysArray = [];

		if (!obj || typeof obj !== 'object') return keysArray;

		for (const key in obj) {
			if (obj.hasOwnProperty(key)) {
				keysArray.push(prefix + key); // Add the key to the array

				// If the value is an object, call the function recursively
				if (typeof obj[key] === 'object' && obj[key] !== null) {
					keysArray = keysArray.concat(displayKeys(obj[key], prefix + key + '.'));
				}
			}
		}

		return keysArray;
	}

	function getNestedValue(data, keyString) {
		return keyString.split('.').reduce((obj, key) => obj[key], data);
	}

	function formatNestedObject(obj, prefix = '') {
		let result = '';

		for (const [key, value] of Object.entries(obj)) {
			// Replace underscores in the key
			const formattedKey = key.replace(/_/g, ' ');

			if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
				result += `${prefix}${formattedKey}:\n${formatNestedObject(value, prefix + '\t')}`;
			} else {
				// If the value is a string, replace underscores in the value
				const formattedValue = typeof value === 'string' ? value.replace(/_/g, ' ') : value;
				result += `${prefix}${formattedKey}: ${formattedValue}\n`;
			}
		}

		return result;
	}
</script>

<StoryNav />
<h1>Your current Character stats:</h1>
<p class="helptext">(please click bck on story and then hero stats if its not loading properly )</p>
{#if $hsStore}
	<div class="hero-main">
		<div>
			<h4>Your Hero</h4>
			<p>Name: {$hsStore?.characters?.hero?.name}</p>
			<p>Level: {$hsStore?.characters?.hero?.level}</p>
			<p>
				XP : {$hsStore?.characters?.hero?.xp || $hsStore?.characters?.hero?.XP}
			</p>
			<p>XP points to next level: {$hsStore?.characters?.hero?.xp_points_to_next_level}</p>
		</div>
		<div>
			<h4>Hero Stats</h4>
			<p>Stats:</p>
			{#if $hsStore?.characters?.hero?.stats}
				<p>---</p>
				<pre>{formatNestedObject($hsStore?.characters?.hero?.stats)}</pre>
				<p>---</p>
			{/if}
		</div>
		<div>
			<h4>Inventory</h4>
			{#if $hsStore?.characters?.hero?.Inventory}
				<p>---</p>
				<pre>{formatNestedObject($hsStore?.characters?.hero?.Inventory)}</pre>
				<p>---</p>
			{/if}
		</div>
		<div>
			<h4>Skills</h4>
			{#if $hsStore?.characters?.hero?.skills}
				<p>---</p>
				<pre>{formatNestedObject($hsStore?.characters?.hero?.class?.class_bonus)}</pre>
				<p>---</p>
			{/if}
		</div>
		<div>
			<h4>Class Information : <em>&nbsp {$hsStore?.characters?.hero?.class?.type}</em></h4>
			{#if $hsStore?.characters?.hero?.class?.class_bonus}
				<p>---</p>
				<pre>{formatNestedObject($hsStore?.characters?.hero?.class?.class_bonus)}</pre>
				<p>---</p>
			{/if}
		</div>
		<div>
			<h4>Status effects</h4>
			{#if $hsStore?.characters?.hero?.status_effects}
				<p>---</p>
				<pre>{formatNestedObject($hsStore?.characters?.hero?.status_effects)}</pre>
				<p>---</p>
			{/if}
		</div>
	</div>

	<div class="partyMembers">
		<!-- we will figure this out later, will have to look into better prompt eng for this-->
	</div>
	<div class="enemies">
		<!-- we will figure this out later, will have to look into better prompt eng for this-->
	</div>
{/if}

<style>
	pre {
		font-family: inherit; /* Use the same font as the parent element */
		white-space: pre-wrap; /* Allows for word wrapping */
		word-break: break-all; /* Breaks long words */
		background: none; /* Removes any default background */
		border: none; /* Removes any default borders */
		padding: 0; /* Resets any default padding */
	}
	.helptext {
		font-size: 0.8em;
		margin-top: 0;
		margin-bottom: 0;
	}
	h1 {
		margin-bottom: 5px;
	}

	.hero-main {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr; /* Three equal columns */
		gap: 20px; /* Gap between the grid items */
		padding: 20px; /* Padding around the grid container */
	}

	.hero-main > div {
		padding: 20px; /* Padding inside each grid item */
		border: 1px solid #ccc; /* Optional: Border around each grid item */
		border-radius: 8px; /* Rounded corners for grid items */
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Optional: Box shadow for grid items */
		background-color: #f9f9f9; /* Background color for grid items */
	}

	h4 {
		margin-top: 0; /* Removes the default margin for better alignment inside grid items */
	}
</style>
