import { writable, Writable } from 'svelte/store';
import type { CrewMember } from '../types';

export default writable<Writable<CrewMember>[]>([], () => {
	console.log('Subscriber Detected ON CREW MEMBERS');

	return () => console.log('No More Subscribers ON CREW MEMBERS');
});
