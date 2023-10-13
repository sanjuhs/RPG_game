<script>
	import { app, auth, db, storage } from '$lib/components/firebase.js';
	import { appStore } from '$lib/components/stores.js';
	import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
	import Cookies from 'js-cookie';
	import backgroundimg from '$lib/images/site/market.png';

	onMount(async () => {
		onAuthStateChanged(auth, async (currentUser) => {
			if (currentUser) {
				appStore.update((cv) => {
					return { ...cv, loggedIn: true, uid: currentUser.uid };
				});
				console.log($appStore.uid, $appStore.loggedIn);
				if ($appStore.loggedIn == true) {
					goto('/app/applanding');
				}
			} else {
				appStore.update((cv) => {
					return { ...cv, loggedIn: false, uid: null };
				});
			}
		});
	});

	const checkIfUserExists = async (uid) => {
		const userRef = doc(db, 'userinfo', uid); // Reference to the document with the specified UID
		const userSnapshot = await getDoc(userRef);

		if (userSnapshot.exists()) {
			console.log('The user exists in the database.');
			return true;
		} else {
			console.log('The user does not exist in the database.');
			return false;
		}
	};

	const googleSignIn = async () => {
		const provider = new GoogleAuthProvider();
		try {
			console.log('in try loop google sign in ');
			const result = await signInWithPopup(auth, provider);
			let user = result.user;

			if (user) {
				appStore.update((cv) => {
					return { ...cv, uid: user.uid, loggedIn: true, currentTab: 'applanding' };
				});
				console.log('logged in UID is : ', $appStore.uid);
				const userExists = await checkIfUserExists(user.uid);
				if (!userExists) {
					let status1 = await setDoc(doc(db, 'userinfo', user.uid), {
						bio: 'Having, a fun time !',
						displayName: user.displayName,
						email: user.email,
						phoneNumber: user.phoneNumber,
						photoURL: user.photoURL
					});
					console.log('status1 is: ', status1);
				}
				goto('/app/applanding');
			}
		} catch (error) {
			console.log('error signing in with Google is : ', error);
		}
	};
</script>

<div class="login-container">
	<img class="background-image" src={backgroundimg} alt="Background" />

	<div class="login-card centered">
		<h1>Login now</h1>
		<p>Please remember this is just a prototype of the app.</p>
		<button on:click={googleSignIn}>Click here to login Via google</button>
		<p>we use google to verify as it is easier :)</p>
	</div>
</div>

<!-- Background images is  <img src={backgroundimg} />-->

<style>
	.login-container {
		position: relative;
		height: 100vh;
		display: flex;
		justify-content: center;
		align-items: center;
		overflow: hidden;
	}

	.background-image {
		position: absolute;
		top: 0;
		left: 0;
		height: 100%;
		width: 100%;
		object-fit: cover;
		filter: opacity(0.7);
		z-index: -1;
	}

	.centered {
		display: flex;
		justify-content: center;
		align-items: center;
		flex-direction: column;
	}

	.login-card {
		background-color: rgba(255, 255, 255, 0.8);
		padding: 20px 30px;
		border-radius: 8px;
		box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1);
		text-align: center;
		width: 300px;
	}

	.login-card h1 {
		font-size: 2em;
		margin-bottom: 15px;
	}

	.login-card p {
		margin-bottom: 15px;
	}

	.login-card button {
		background-color: #007bff;
		color: #fff;
		border: none;
		border-radius: 4px;
		padding: 10px 20px;
		cursor: pointer;
		font-size: 1em;
		transition: background-color 0.3s;
	}

	.login-card button:hover {
		background-color: #0056b3;
	}
</style>
