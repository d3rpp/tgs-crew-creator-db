<script lang="ts">
	import type { Writable } from 'svelte/store';
	import { get } from 'svelte/store';
	import { CrewMember, SORTABLE_CONFIG } from '../../types';
	import CrewMemberListItem from './crewMemberListItem.svelte';

	import { somethingIsLoading } from '../../stores/buffers';
	import Sortable from 'sortablejs';
	import type { SortableOptions } from 'sortablejs';
	import { onMount } from 'svelte';
	// import { getMember } from '../../stores/members';

	export let members: Writable<Writable<CrewMember>[]>;

	let table: HTMLDivElement;

	$: membersToRender = $members.filter((v) => {
		return !get(v).is_in_crew;
	});

	$: map = membersToRender.map((writableOfMember) => {
		return get(writableOfMember);
	});

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
	{#if $somethingIsLoading}
		<span>Loading...</span>
	{:else}
		{#each map as mem (mem.id)}
			{#if !mem.is_in_crew}
				<CrewMemberListItem member={mem} />
			{/if}
		{/each}
	{/if}
</div>

<style scoped lang="scss">
	.table {
		width: 100%;
		height: 100%;

		padding: 8px;

		display: flex;
		flex-direction: column;
		justify-content: flex-start;
	}
</style>
