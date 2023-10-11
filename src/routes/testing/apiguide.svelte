<script>
	// let me first write a large series of APIs
	// here we are going to do CRUD functions for fire base app theoretically GET requests , POST requests ,
	// we also put in all the imports here itself
	import { getFirestore, doc, addDoc, getDoc, getDocFromCache } from 'firebase/firestore';
	import { getDocs, updateDoc, setDoc, deleteDoc, collection } from 'firebase/firestore';
	import { db, app } from '$lib/firebase/firebase.js';
	import { appStore } from '$lib/components/stores.js';

	const rtDB = getDatabase(app);
	// const chatroomMessagesref = ref(rtDB, 'messages/' + $appStore.activechatroom_id);

	// ------------------- For fire Store ---------------------------------------

	// to add a new doc with auto generated new ID
	async function addNewDocumentFirestore(data) {
		const chatroomsCollection = collection(db, 'chatroominfo');
		const docRef = await addDoc(chatroomsCollection, data);
		console.log('Document added with ID: ', docRef.id);
	}

	// to add a new doc with a specific ID
	async function addMessageWithIDFirestore(customID, data) {
		const docRef = doc(db, 'chatroominfo', customID);
		await setDoc(docRef, data);
		console.log(`Document added with ID: ${customID}`);
	}

	// to read a document from firestore
	async function getDocumentFirestore() {
		const docRef = doc(db, 'chatroominfo', $appStore.activechatroom_id);
		const docSnap = await getDoc(docRef);

		if (docSnap.exists()) {
			console.log('Document data:', docSnap.data());
		} else {
			console.log('No such document!');
		}
	}

	// to get all the documents of a fire store
	async function getdocsFromCollection() {
		const collRef = collection(db, 'ffhid');
		const querySnapshot = await getDocs(collRef);
		const docsArray = [];
		// now to print each of the query docs
		querySnapshot.forEach((doc) => {
			console.log(`${doc.id}=> ${JSON.stringify(doc.data())}`);
			docsArray.push({ id: doc.id, ffhid: doc.data().ffhid });
		});
		return docsArray;
	}

	// to update the document
	async function updateDocumentFirestore(data) {
		const docRef = doc(db, 'chatroominfo', $appStore.activechatroom_id);
		await updateDoc(docRef, data);
		// or use setDoc and {merge:true } as an option within
		console.log('Document updated');
	}

	// to delete a document from firestore
	async function deleteDocumentFirestore() {
		const docRef = doc(db, 'chatroominfo', $appStore.activechatroom_id);
		await deleteDoc(docRef);
		console.log('Document deleted');
	}
</script>

<p>This is just for testing the firebase firestore API Guide</p>
