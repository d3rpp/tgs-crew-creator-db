import { writable, Writable } from 'svelte/store';
import type { CrewMemberInterface } from '../types';
import { CrewMember } from '../types';

export const memberEditorBuffer = writable<Writable<CrewMember>>(
	writable(
		new CrewMember({
			id: 0,
			name: '',
			ageGroup: 'U15',
			gender: 'M',
			novice: false,
		} as CrewMemberInterface)
	)
);

export const somethingIsLoading = writable<boolean>(false);
