<script lang="ts">
	import { get } from 'svelte/store';

	import { fly } from 'svelte/transition';

	import Crew from '../components/display/crew.svelte';

	import crews from '../stores/crews';
</script>

<main
	id="crew-display"
	class="page"
	in:fly={{ duration: 200, delay: 200, y: 10 }}
	out:fly={{ duration: 200, y: -10 }}
>
	<div class="title"><h1>Crew Display</h1></div>

	<div class="container">
		{#each $crews as crew (get(crew).id)}
			<Crew {crew} />
		{/each}
	</div>
</main>

<style>
	.title {
		position: absolute;
		top: 72px;
		left: 8px;
	}

	.container {
		position: relative;
		/* width: 100%; */

		max-height: calc(100vh - 72px);

		overflow-y: auto;

		margin: 96px 16px 0 16px;

		/* border: 1px solid red; */

		display: grid;
		grid-template-columns: 1fr 1fr 1fr;
	}
</style>
