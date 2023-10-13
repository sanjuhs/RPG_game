<script>
	import { appStore } from '$lib/components/stores.js';
	import { goto } from '$app/navigation';
	import { app, auth, db, storage } from '$lib/components/firebase.js';
	import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
	import { onMount } from 'svelte';

	import LandingNavBar from '$lib/components/landing/landingNavBar.svelte';
	import adventureimg from '$lib/images/site/drufen.png';

	onMount(async () => {
		onAuthStateChanged(auth, async (currentUser) => {
			if (currentUser) {
				appStore.update((cv) => {
					return { ...cv, loggedIn: true, uid: currentUser.uid };
				});
				console.log($appStore.uid, $appStore.loggedIn);
			} else {
				appStore.update((cv) => {
					return { ...cv, loggedIn: false, uid: null };
				});
				goto('/');
			}
		});
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

<LandingNavBar />
<div class="center-it">
	<h1>Welcome to Another RPG</h1>
	<p>Click below on the Picture to get started</p>
	<button on:click={googleSignOut} class="logout">Log out</button>
</div>
<div class="carousel rpg-card">
	<h3>Choose different worlds:</h3>
	<p class="small">P.S Really sorry only one World for now !</p>
	<button
		on:click={() =>
			selectWorld('world1', 'world1 Another RPG', 'Drufen_w1', 'First Hero- Drufen the hunter')}
	>
		<h4>The Main RPG</h4>
		<img src={adventureimg} alt="drufen's adevnture" />
		<p class="small">(also called just another RPG)</p>
		<p>the main world / the first one made just like a typical RPG</p>
	</button>
</div>
<div class="content">
	<p>
		This is a quick RPG Game that I had made so please try it out and tell me what you think off it
		, please drop any suggestions on any of the given social media posts/ forums that may have
		brought you here! thank you !
	</p>
</div>

<!-- <button>
	<h4>World of Technosia</h4>
	A cyber punk world with lot
	<p>... coming soon</p>
</button> -->

<style>
	/* General Reset */
	/* * {
    margin: 0;
    padding: 0;
    box-sizing: border-box;
    font-family: 'Arial', sans-serif;
}

body {
    background-color: #f4f4f4;
    color: #333;
    font-size: 16px;
    line-height: 1.5;
    padding: 20px;
} */

	.center-it {
		text-align: center;
		margin: 20px 0;
	}

	.center-it h1 {
		font-size: 2.5em;
		color: #222;
		margin-bottom: 20px;
	}

	.content {
		max-width: 800px;
		margin: 20px auto;
		background-color: #fff;
		padding: 20px;
		border-radius: 8px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
	}

	.content p {
		margin-bottom: 20px;
	}

	.carousel {
		margin-top: 40px;
		text-align: center;
	}

	.rpg-card {
		background-color: #fff;
		border-radius: 8px;
		padding: 20px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		margin: 20px 0;
	}

	.rpg-card img {
		max-width: 500px;
		height: auto;
		border-radius: 8px;
	}

	.rpg-card button {
		background-color: #716453;
		color: #fff;
		border: none;
		border-radius: 4px;
		padding: 10px 20px;
		cursor: pointer;
		margin-top: 20px;
		transition: background-color 0.3s;
	}

	.rpg-card button:hover {
		background-color: #0056b3;
	}

	@media screen and (max-width: 768px) {
		.content,
		.carousel {
			padding: 10px;
		}
	}

	.small {
		font-size: 0.8em;
		margin: 0;
		padding: 0;
	}

	.logout {
		background-color: #007bff;
		color: #fff;
		border: none;
		border-radius: 4px;
		padding: 10px 20px;
		cursor: pointer;
		font-size: 1em;
		transition: background-color 0.3s;
	}
	.logout:hover {
		background-color: #0056b3;
	}
</style>
