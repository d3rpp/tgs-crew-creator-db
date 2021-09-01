import { writable, Writable } from 'svelte/store';
import type { CrewInterface } from '../types';

export default writable<Writable<CrewInterface>[]>([], () => {
	console.log('Subscriber Detected ON CREWS');

	return () => console.log('No More Subscribers ON CREWS');
});
