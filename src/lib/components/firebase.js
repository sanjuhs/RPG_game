// Import the functions you need from the SDKs you need
import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
const firebaseConfig = {
	apiKey: 'AIzaSyDJNKzSgVkIrVZboF0sLpWyTgQJ49QeFsU',
	authDomain: 'rpggame-cebae.firebaseapp.com',
	projectId: 'rpggame-cebae',
	storageBucket: 'rpggame-cebae.appspot.com',
	messagingSenderId: '652631208043',
	appId: '1:652631208043:web:4fe2ecd7f5a8b9d069812e'
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);
const storage = getStorage(app);

export { app, auth, db, storage };
