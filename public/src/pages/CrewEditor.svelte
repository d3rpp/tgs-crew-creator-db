<script lang="ts">
	import { fly } from 'svelte/transition';
	import { get, writable } from 'svelte/store';
	import CrewEditorItem from '../components/crew-editor/crewEditorItem.svelte';

	import CrewMemberList from '../components/crew-editor/crewMemberList.svelte';
	import crews from '../stores/crews';
	import members from '../stores/members';
	import { Crew } from '../types';
	import type { BoatSize } from '../types';

	let dialogueOpen = false;

	function toggle() {
		dialogueOpen = !dialogueOpen;
	}

	function createCrew(size: BoatSize) {
		crews.update((c) => {
			return [...c, writable(new Crew({ size }))];
		});
	}
</script>

<main
	id="crew-editor"
	class="page"
	in:fly={{ duration: 200, delay: 200, y: 10 }}
	out:fly={{ duration: 200, y: -10 }}
>
	<div class="title"><h1>Crew Editor</h1></div>
	<div class="editors">
		{#each $crews as c (get(c).id)}
			<CrewEditorItem crew={c} />
		{/each}

		<div class="create-button" on:click={toggle}>
			{dialogueOpen ? '-' : '+'}
		</div>

		{#if dialogueOpen}
			<div class="create-dialogue">
				<div on:click={() => createCrew('1')}>1x-</div>
				<div on:click={() => createCrew('2')}>2x-/2-</div>
				<div on:click={() => createCrew('4')}>4x-/4-</div>
				<div on:click={() => createCrew('5')}>4x+/4+</div>
				<div on:click={() => createCrew('9')}>8x+/8+</div>
			</div>
		{/if}
	</div>

	<div class="list">
		<CrewMemberList {members} />
	</div>
</main>

<style scoped lang="scss">
	.title {
		position: absolute;
		top: 72px;
		left: 8px;
	}
	#crew-editor {
		display: grid;
		grid-template-columns: 2fr 1fr;
		grid-template-rows: 1fr;

		padding-left: 16px;
		padding-right: 16px;

		.editors {
			// border: 1px solid red;
			padding: 64px 0;
			overflow-y: auto;

			.create-button {
				display: flex;
				justify-content: center;
				align-items: center;

				user-select: none;

				background-color: #ffb511;
				color: black;

				padding: 8px;
				margin-bottom: 16px;

				font-size: 24px;
				cursor: pointer;

				position: absolute;
				bottom: 0px;
				left: 16px;

				width: 64px;
				height: 64px;

				border-radius: 50%;
			}

			.create-dialogue {
				display: flex;
				justify-content: center;
				align-items: center;

				user-select: none;

				cursor: pointer;

				position: absolute;
				bottom: 16px;
				left: 144px;

				height: 64px;

				div {
					background-color: #ffb511;
					color: black;
					border-radius: 5px;
					margin: 8px;
					height: 32px;
					width: 150px;

					display: flex;
					justify-content: center;
					align-items: center;
				}
			}
		}

		.list {
			// border: 1px solid green;

			padding: 16px;
		}
	}
</style>
