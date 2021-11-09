<script lang="ts">
	import type { Writable } from 'svelte/store';

	import { memberEditorBuffer } from '../stores/buffers';
	import type { CrewMember } from '../types/index';

	import members from '../stores/members';

	import CrewMemberBufferEditor from '../components/member-editor/crewMemberBufferEditor.svelte';
	import CrewMemberList from '../components/member-editor/CrewMemberList.svelte';
	import { fly } from 'svelte/transition';

	const pushMemberToEditBuffer = (mem: Writable<CrewMember>) => {
		memberEditorBuffer.set(mem);
	};
</script>

<main
	id="member-editor"
	class="page"
	in:fly={{ duration: 200, delay: 200, y: 10 }}
	out:fly={{ duration: 200, y: -10 }}
>
	<div class="title">
		<h1>Member Editor</h1>
	</div>
	<div class="buffer-editor">
		<CrewMemberBufferEditor buffer={memberEditorBuffer} />
	</div>
	<div class="table">
		<CrewMemberList {members} pushToBuffer={pushMemberToEditBuffer} />
	</div>
</main>

<style scoped>
	.title {
		position: absolute;
		top: 72px;
		left: 8px;
	}

	#member-editor {
		display: grid;
		grid-template-rows: 100%;
		grid-template-columns: 50% 50%;

		overflow: hidden;
	}

	.buffer-editor {
		display: flex;
		justify-content: center;
		align-items: center;
	}

	.table {
		overflow-y: auto;
		width: 100%;
		height: 100%;
	}
</style>
