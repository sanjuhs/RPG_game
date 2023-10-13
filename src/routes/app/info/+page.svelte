<script>
	import StoryNav from '../../../lib/components/story/storyNav.svelte';
	import { appStore, hsStore } from '$lib/components/stores.js';
	import { onMount } from 'svelte';
	import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
	import { app, auth, db, storage } from '$lib/components/firebase.js';
	import { goto } from '$app/navigation';

	let formattedOutput_worldinfo, formattedOutput_active_quests, formattedOutput_done_quests;

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
					goto('/');
				}
			});
		});
		await authChanged;

		if ($hsStore?.worldinfo) {
			formattedOutput_worldinfo = formatNestedObjectv3($hsStore?.worldinfo);
			console.log(formattedOutput_worldinfo);
		}
		if ($hsStore?.active_quests) {
			formattedOutput_active_quests = formatNestedObjectv3($hsStore?.active_quests);
		}
		if ($hsStore?.done_quests) {
			formattedOutput_done_quests = formatNestedObjectv3($hsStore?.done_quests);
		}
	});

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
				result += `${prefix}${formattedKey}: ${formattedValue}\n\n`;
			}
		}

		return result;
	}

	function formatNestedObjectv3(obj, prefix = '') {
		let result = '';

		// Sort the keys alphabetically
		const sortedKeys = Object.keys(obj).sort();

		for (const key of sortedKeys) {
			const value = obj[key];
			// Replace underscores in the key
			const formattedKey = key.replace(/_/g, ' ');

			if (typeof value === 'object' && value !== null && !Array.isArray(value)) {
				result += `${prefix}<span style="font-weight: bold; margin-right: 5px;">${formattedKey}:</span>\n${formatNestedObject(
					value,
					prefix + '\t'
				)}`;
			} else {
				// If the value is a string, replace underscores in the value
				const formattedValue = typeof value === 'string' ? value.replace(/_/g, ' ') : value;
				result += `${prefix}<span style="font-weight: bold; margin-right: 5px;">${formattedKey}:</span> 
            <span style="display:block; margin:5px 0;">${formattedValue}</span>\n\n`;
			}
		}

		return result;
	}
</script>

<!--
	ok so we need to show 
	World Info =>
	Active Quests =>
	Done Quests =>
Also need to add 
	World_Begining Prompts ,

-->
<StoryNav />
<h1>Current World Information</h1>
<p class="helptext">(please click bck on story and then hero stats if its not loading properly )</p>
<div class="worldMain">
	<div>
		<h4>World Facts and Info</h4>
		{#if $hsStore?.worldinfo}
			<p>---</p>
			<!-- <div contenteditable bind:innerHTML={formattedOutput_worldinfo} /> -->
			<!-- <div innerHTML={formattedOutput_worldinfo} /> -->
			<!-- <pre>{formatNestedObject($hsStore?.worldinfo)}</pre> -->
			<p>{@html formattedOutput_worldinfo}</p>
			<p>---</p>
		{/if}
	</div>
	<div>
		<h4>Active Quests</h4>
		{#if $hsStore?.active_quests}
			<p>---</p>
			<!-- <pre>{formatNestedObject($hsStore?.active_quests)}</pre> -->
			<p>{@html formattedOutput_active_quests}</p>

			<p>---</p>
		{/if}
	</div>
	<div>
		<h4>Done Quests</h4>
		{#if $hsStore?.done_quests}
			<p>---</p>
			<!-- <pre>{formatNestedObject($hsStore?.done_quests)}</pre> -->
			<p>{@html formattedOutput_done_quests}</p>

			<p>---</p>
		{/if}
	</div>
</div>

<style>
	.worldMain {
		display: grid;
		grid-template-columns: 1fr 1fr 1fr; /* Three equal columns */
		gap: 20px; /* Gap between the grid items */
		padding: 20px; /* Padding around the grid container */
	}

	.worldMain > div {
		padding: 20px; /* Padding inside each grid item */
		border: 1px solid #ccc; /* Border around each grid item */
		border-radius: 8px; /* Rounded corners for grid items */
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Box shadow for grid items */
		background-color: #f9f9f9; /* Background color for grid items */
	}

	.helptext {
		font-size: 0.8em;
		margin-top: 0;
		margin-bottom: 0;
	}
	h1 {
		margin-bottom: 5px;
	}

	h4 {
		margin-top: 0; /* Removes the default margin for better alignment inside grid items */
	}

	pre {
		font-family: inherit; /* To ensure the <pre> tag uses the same font as its surroundings */
		white-space: pre-wrap; /* To ensure long lines in <pre> break and wrap */
	}

	/* Styling for the key-value pairs in the <pre> tag */
	pre > span.key {
		font-weight: bold; /* Make the key bold */
		margin-right: 5px; /* Space between the key and value */
	}

	pre > span.value {
		display: block; /* Each value starts on a new line */
		margin: 5px 0; /* Space above and below each value */
	}
</style>
