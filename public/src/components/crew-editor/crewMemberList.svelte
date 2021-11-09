<script lang="ts">
	import type { Writable } from 'svelte/store';
	import { get } from 'svelte/store';
	import { CrewMember, SORTABLE_CONFIG } from '../../types/index';
	import CrewMemberListItem from './crewMemberListItem.svelte';

	import Sortable from 'sortablejs';
	import type { SortableOptions } from 'sortablejs';
	import { onMount } from 'svelte';
	import { mems_in_crews } from '../../stores/members';
	import crews from '../../stores/crews';
	// import { getMember } from '../../stores/members';

	export let members: Writable<Writable<CrewMember>[]>;

	let table: HTMLDivElement;

	$: {
		console.log($members);
	}

	$: {
		console.log($crews);
	}

	$: {
		console.log($mems_in_crews);
	}

	onMount(() => {
		new Sortable(
			table,
			Object.assign<SortableOptions, SortableOptions>(SORTABLE_CONFIG, {
				group: {
					name: 'member',
					put: true,
					pull: true,
					checkPut: () => true,
					checkPull: () => true,
				},
			})
		);
	});
</script>

<div class:table={true} bind:this={table}>
	{#each $members as m, idx (get(m).id)}
		{#if !$mems_in_crews.includes(get(m).id)}
			<CrewMemberListItem member={$members[idx]} />
		{/if}
	{/each}
</div>

<style scoped lang="scss">
	.table {
		width: 100%;
		height: 100%;

		padding: 8px;

		display: flex;
		flex-direction: column;
		justify-content: flex-start;

		:global(.item) {
			display: flex;
			flex-direction: row;
			justify-content: center;
			align-self: center;

			border: 1px solid whitesmoke;

			border-radius: 5px;

			margin: 8px;
		}
	}
</style>
