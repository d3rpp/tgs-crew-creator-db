import { writable, Writable } from 'svelte/store';
import type { CrewMemberInterface } from '../types/index';
import { CrewMember } from '../types/index';

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

export const resetEditorBuffer = () => {
	memberEditorBuffer.set(
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
};

export const somethingIsLoading = writable<boolean>(false);
