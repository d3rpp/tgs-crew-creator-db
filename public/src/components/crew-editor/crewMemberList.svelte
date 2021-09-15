<script lang="ts">
	import type { Writable } from 'svelte/store';
	import { get } from 'svelte/store';
	import type { CrewMember } from '../../types';
	import CrewMemberListItem from './crewMemberListItem.svelte';

	import { dndzone } from 'svelte-dnd-action';
	import { onDestroy, onMount } from 'svelte';
	import { somethingIsLoading } from '../../stores/buffers';

	export let members: Writable<Writable<CrewMember>[]>;

	let currentMembersList = get(members);
	let membersInCrews = [];
	let currentMembersDisplayList = currentMembersList.map((m) => {
		if (!membersInCrews.includes(m)) return m;
	});

	let unsubscribe: { (): void };

	function dndConsider(e) {
		console.log(typeof e, e);
		currentMembersDisplayList = e.detail.items;
	}

	function dndFinalize(e) {
		console.log(typeof e, e);
	}

	onMount(() => {
		unsubscribe = members.subscribe((newVal) => {});
	});

	onDestroy(() => {
		unsubscribe();
	});
</script>

<table
	use:dndzone={{
		items: currentMembersDisplayList,
		flipDurationMs: 100,
		type: 'member',
	}}
	on:consider={dndConsider}
	on:finalize={dndFinalize}
>
	{#if $somethingIsLoading}
		<span>Loading...</span>
	{:else}
		{#each $members as mem (get(mem).id)}
			<CrewMemberListItem member={mem} />
		{/each}
	{/if}
</table>

<style scoped>
	table {
		width: 100%;
		height: 100%;

		padding: 8px;
	}
</style>
