<script lang="ts">
	import CrewMemberList from '../components/crew-editor/crewMemberList.svelte';
	import members from '../stores/members';
</script>

<main id="crew-editor" class="page">
	<div class="editors" />

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
	}

	.list {
		border: 1px solid green;
	}
</style>
