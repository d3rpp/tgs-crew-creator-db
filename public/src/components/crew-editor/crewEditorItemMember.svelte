<script lang="ts">
	import { onMount } from 'svelte';
	import Sortable from 'sortablejs';

	import type { SortableOptions } from 'sortablejs';

	import { get, writable } from 'svelte/store';
	import type { Writable } from 'svelte/store';
	import { CrewMember, SORTABLE_CONFIG } from '../../types/index';
	import { getMember, mems_in_crews } from '../../stores/members';
	import CrewMemberListItem from './crewMemberListItem.svelte';

	export let member: Writable<CrewMember> | Writable<null>;
	export let onChange: (id: number) => void;

	let id: number = -1;
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
					put: () => {
						return $member == null;
					},
					pull: true,
				},

				onRemove: (event) => {
					if (event.to.classList.contains('table'))
						mems_in_crews.update((list) => {
							return list.filter((m) => m !== id);
						});

					id = -1;

					member = writable(null);
					onChange(id);
				},

				onAdd: (event) => {
					console.log('DROPPED', event, event.item);

					member = getMember(+event.item.getAttribute('data-id'));

					console.log($member, +event.item.getAttribute('data-id'));

					if (event.from.classList.contains('table'))
						mems_in_crews.update((list) => {
							let l = list;
							l.push(id);
							return l;
						});

					if (get(member) != null) {
						id = get(member).id;
					} else {
						id = -1;
					}

					console.log('SEAT CHANGED', id);

					onChange(id);
					if (event.item) event.item.remove();
				},
			})
		);
	});
</script>

<div class="member" bind:this={element} data-id={id}>
	<!-- <CrewMemberListItem {member} /> -->
	{#if $member != null}
		<CrewMemberListItem {member} />
	{/if}
</div>

<style lang="scss" scoped>
	.member {
		display: flex;
		flex-direction: column;
		justify-content: center;
		align-items: center;

		width: 80%;
		height: 80%;

		margin: 16px;
		border-radius: 5px;

		border: 1px solid white;

		:global(.item) {
			height: 100%;

			display: flex;
			text-align: center;
			flex-direction: column;
			justify-content: center;
			align-self: center;
		}
	}
</style>
