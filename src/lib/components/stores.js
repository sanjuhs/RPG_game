import { writable } from 'svelte/store';

export const appStore = writable({
	loggedIn: false,
	uid: null,
	currentWorld: 'world1',
	currentHero: 'none',
	currentTab: 'none'
});

export const hsStore = writable({});

export const ccm = writable([]); // ccm = current chat messages
