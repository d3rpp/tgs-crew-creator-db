<script lang="ts">
	import { fly } from 'svelte/transition';
</script>

<main
	id="crew-display"
	class="page"
	in:fly={{ duration: 200, delay: 200, y: 10 }}
	out:fly={{ duration: 200, y: 10 }}
>
	CREW DISPLAY
</main>

<style>
	main {
		background-color: blue;
	}
</style>
