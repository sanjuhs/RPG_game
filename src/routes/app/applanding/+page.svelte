<script>
	import { appStore } from '$lib/components/stores.js';
	import { goto } from '$app/navigation';
	import { app, auth, db, storage } from '$lib/components/firebase.js';
	import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
	import { onMount } from 'svelte';

	onMount(() => {
		console.log('The uid is ', $appStore.uid);
		if (!$appStore.uid) {
			goto('/');
		}
	});

	const googleSignOut = async () => {
		try {
			console.log('going to sign out of gogole');
			await signOut(auth);
			console.log('now we have awaited and signed out');
			appStore.update((cv) => {
				return {
					...cv,
					loggedIn: false,
					uid: undefined,
					currentTab: 'none',
					currentWorld: 'none',
					currentHero: 'none'
				};
			});
			console.log('Nowe we have updated sign out state');
			console.log(appStore);
			console.log($appStore.loggedIn);
			goto('/');
		} catch (error) {
			console.log('Error Signing out: ', error);
		}
	};

	async function selectWorld(worldid, worldcomment, heroid, herocomment) {
		console.log('Selected ', worldcomment, ' with the hero ', herocomment);
		appStore.update((cv) => {
			return { ...cv, currentTab: 'storychat', currentWorld: worldid, currentHero: heroid };
		});
		goto('/app/storychat');
	}
</script>

<h1>The app landing</h1>
<button on:click={googleSignOut}>Log out</button>
<p>Ok cool stuff and random</p>
<p>The main RPG questline , choose a character and lets go !</p>
<h3>Choose different worlds:</h3>
<button
	on:click={() =>
		selectWorld('world1', 'world1 Another RPG', 'Drufen_w1', 'First Hero- Drufen the hunter')}
>
	<h4>The Main RPG</h4>
	(also called just another RPG)
	<p>the main world / the first one made just like a typical RPG</p>
</button>
<button>
	<h4>World of Technosia</h4>
	A cyber punk world with lot
	<p>... coming soon</p>
</button>
