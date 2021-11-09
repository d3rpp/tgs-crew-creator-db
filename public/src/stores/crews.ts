import { writable, Writable } from 'svelte/store';
import type { Crew } from '../types/index';

export default writable<Writable<Crew>[]>([], () => {
	console.log('Subscriber Detected ON CREWS');

	return () => console.log('No More Subscribers ON CREWS');
});
