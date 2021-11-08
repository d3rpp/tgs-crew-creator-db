<script lang="ts">
	import { fly } from 'svelte/transition';
	import CrewEditorItem from '../components/crew-editor/crewEditorItem.svelte';

	import CrewMemberList from '../components/crew-editor/crewMemberList.svelte';
	import crews from '../stores/crews';
	import members from '../stores/members';
</script>

<main
	id="crew-editor"
	class="page"
	in:fly={{ duration: 200, delay: 200, y: 10 }}
	out:fly={{ duration: 200, y: 10 }}
>
	<div class="editors">
		{#each $crews as c}
			<CrewEditorItem crew={c} />
		{/each}
	</div>

	<div class="list">
		<CrewMemberList {members} />
	</div>
</main>

<style scoped>
	#crew-editor {
		display: grid;
		grid-template-columns: 2fr 1fr;
		grid-template-rows: 1fr;

		padding-left: 16px;
		padding-right: 16px;
	}

	.editors {
		border: 1px solid red;
		padding: 64px 0;
		overflow-y: auto;
	}

	.list {
		border: 1px solid green;
	}
</style>
