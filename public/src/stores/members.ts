import { get, writable, Writable } from 'svelte/store';
import type { CrewMember } from '../types';

const writ = writable<Writable<CrewMember>[]>([], () => {
	console.log('Subscriber Detected ON CREW MEMBERS');

	return () => console.log('No More Subscribers ON CREW MEMBERS');
});

export const getMember = (
	id: number
): Writable<CrewMember> | Writable<null> => {
	if (id < 0) return writable(null);

	get(writ).forEach((member) => {
		if (get(member).id === id) {
			return member;
		}
	});
	return null;
};

export default writ;
