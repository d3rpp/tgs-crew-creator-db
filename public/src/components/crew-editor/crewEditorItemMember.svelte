<script lang="ts">
	import { onMount } from 'svelte';
	import Sortable from 'sortablejs';
	import type { SortableOptions } from 'sortablejs';

	import { get, writable } from 'svelte/store';
	import type { Writable } from 'svelte/store';
	import { CrewMember, SORTABLE_CONFIG } from '../../types';
	import { getMember } from '../../stores/members';

	export let member: Writable<CrewMember> | Writable<null>;
	export let onChange: (id: number) => void;
	let m: CrewMember | null;
	$: {
		m = get(member) != null ? $member : null;
	}
	export let id: number = -1;
	let element: HTMLElement;

	$: {
		if (get(member) != null) {
			id = $member.id;
		} else {
			id = -1;
		}
	}

	onMount(() => {
		new Sortable(
			element,
			Object.assign<SortableOptions, SortableOptions>(SORTABLE_CONFIG, {
				group: {
					name: 'member',
					put: (to) => {
						return to.el.children.length < 1;
					},
					pull: true,
				},

				onRemove: () => {
					id = -1;
					member = writable(null);
					onChange(id);
				},

				onAdd: (event) => {
					console.log({ event });

					member = getMember(+event.target.getAttribute('data-id'));
					id = +event.target.getAttribute('data-id');
					onChange(id);
				},
			})
		);
	});
</script>

<div class="member" bind:this={element} data-id={id} />

<style lang="scss" scoped>
	.member {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		width: 100%;
		height: 100%;

		border: 1px solid white;
	}
</style>
