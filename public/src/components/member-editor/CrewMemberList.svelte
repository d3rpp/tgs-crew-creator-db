<script lang="ts">
	import { get } from 'svelte/store';
	import type { Writable } from 'svelte/store';
	import type { CrewMember } from '../../types';

	import CrewMemberListItem from './CrewMemberListItem.svelte';

	export let members: Writable<Writable<CrewMember>[]>;
	export let pushToBuffer: { (mem: Writable<CrewMember>): void };

	function deleteMember(mem: Writable<CrewMember>) {
		let member = get(mem);

		if (!confirm(`Are you sure that you want to delete ${member.name}?`))
			return;

		member.delete().then(() => {
			members.update((currentList) =>
				currentList.filter((val) => val != mem)
			);
		});
	}
</script>

<table id="member-editor-list">
	<tr class="header">
		<th>Gender</th>
		<th>Age Group</th>
		<th class="left">Name</th>
		<th>Actions</th>
	</tr>

	{#each $members as member (get(member).id)}
		<CrewMemberListItem
			{member}
			{pushToBuffer}
			deleteFunction={deleteMember}
		/>
	{/each}
</table>

<style scoped>
	#member-editor-list {
		width: 80%;

		margin: 64px auto;

		padding: 0;

		border-radius: 5px;
	}

	tr {
		display: grid;
		grid-template-rows: 100%;
		grid-template-columns: 1fr 1fr 3fr 1fr;

		/* overflow: hidden; */

		height: 48px;

		margin: 0;
	}

	tr:nth-child(2n) {
		background-color: #aaaaaa11;
	}

	tr.header {
		height: 48px;
		font-weight: normal;

		/* border: 0.5px solid #dddddd88; */
		overflow: hidden;

		background-color: #ffb511;
		color: #111;
	}

	tr.header th {
		border: 0.5px solid #00000088;
	}

	th {
		display: flex;
		flex-direction: column;
		justify-content: center;

		border-left: 0.5px solid #aaaaaa88;

		border-bottom: 0.5px solid #aaaaaa88;
		border-right: 0.5px solid #aaaaaa88;

		text-align: center;
	}

	th {
		font-weight: normal;
	}

	.left {
		padding-left: 8px;
		text-align: left;
	}
</style>
