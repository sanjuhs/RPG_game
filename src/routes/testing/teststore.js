import { writable } from 'svelte/store';

export const testStore = writable({
	the_uid: null,
	name: null
});
