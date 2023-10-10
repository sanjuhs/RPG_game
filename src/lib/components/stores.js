import { writable } from 'svelte/store';

export const appStore = writable({
	loggedIn: false,
	uid: null,
	currentWorld: 'none',
	currentHero: 'none',
	currentTab: 'none'
});

export const ccm = writable([]); // ccm = current chat messages
