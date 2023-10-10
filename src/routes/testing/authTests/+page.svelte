<script>
	import { testStore } from '../teststore.js';

	// onMount(async () => {
	// 	onAuthStateChanged(auth, async (currentUser) => {
	// 		if (currentUser) {
	// 			// user = currentUser;
	// 			appStore.update((cv) => {
	// 				console.log('we are in on mount function ---');
	// 				console.log($testStore.uid);
	// 				return { ...cv, loggedIn: true, uid: currentUser.uid };
	// 			});
	// 		}
	// 	});
	// });

	// const checkIfUserExists = async (uid) => {
	// 	const userRef = doc(db, 'userinfo', uid); // Reference to the document with the specified UID
	// 	const userSnapshot = await getDoc(userRef);

	// 	if (userSnapshot.exists()) {
	// 		console.log('The user exists in the database.');
	// 		return true;
	// 	} else {
	// 		console.log('The user does not exist in the database.');
	// 		return false;
	// 	}
	// };

	// const googleSignIn = async () => {
	// 	const provider = new GoogleAuthProvider();
	// 	let moveto = false;
	// 	let user = '';
	// 	try {
	// 		console.log('in try loop google sign in ');
	// 		const result = await signInWithPopup(auth, provider);
	// 		user = result.user;

	// 		if (user) {
	// 			console.log(user.uid);
	// 			appStore.update((cv) => {
	// 				return { ...cv, uid: user.uid, loggedIn: true, currentTab: 'applanding' };
	// 			});

	// 			console.log('logged in');
	// 			console.log('UID is : ', $appStore.uid);
	// 			const userExists = await checkIfUserExists(user.uid);
	// 			if (!userExists) {
	// 				appStore.update((cv) => {
	// 					return { ...cv, loggedIn: true, uid: user.uid, currentTab: 'applanding' };
	// 				});
	// 				let status1 = await setDoc(doc(db, 'userinfo', user.uid), {
	// 					bio: 'Hey, lets improve ourselves with fun wagers',
	// 					displayName: user.displayName,
	// 					email: user.email,
	// 					phoneNumber: user.phoneNumber,
	// 					photoURL: user.photoURL
	// 				});
	// 				console.log('status1 is: ', status1);
	// 			}
	// 		}
	// 		moveto = true;
	// 	} catch (error) {
	// 		console.log('error signing in with Google is : ', error);
	// 	}
	// 	console.log(user);
	// 	if (moveto === true) {
	// 		goto('/app/applanding');
	// 	}
	// };
</script>

<h1>THis is the page to test stores state</h1>
<button>Login Now</button>
