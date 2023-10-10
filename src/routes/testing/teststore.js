import { Writable } from 'svelte/store';

export const testStore = Writable({
	the_uid: null,
	name: null
});
