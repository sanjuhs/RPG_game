<script>
	import { app, auth, db, storage } from '$lib/components/firebase.js';
	import { appStore } from '$lib/components/stores.js';
	import { GoogleAuthProvider, signInWithPopup, onAuthStateChanged, signOut } from 'firebase/auth';
	import { goto } from '$app/navigation';
	import { onMount } from 'svelte';

	import { getFirestore, doc, setDoc, getDoc } from 'firebase/firestore';
	import Cookies from 'js-cookie';

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

<h1>Login now</h1>
<p>Demo if the app</p>
<button on:click={googleSignIn}>Click here to login Via google</button>
<p>we use google to verify only</p>
