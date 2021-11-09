import { get, writable, Writable } from 'svelte/store';
import type { CrewMember } from '../types/index';

const writ = writable<Writable<CrewMember>[]>([], () => {
	console.log('Subscriber Detected ON CREW MEMBERS');

	return () => console.log('No More Subscribers ON CREW MEMBERS');
});

export const getMember = (
	id: number
): Writable<CrewMember> | Writable<null> => {
	if (id < 0) return writable(null);

	const member = get(writ).find((member) => get(member).id === id);

	if (member != undefined) return member;

	return writable(null);
};

export const mems_in_crews = writable<number[]>([]);

export default writ;
