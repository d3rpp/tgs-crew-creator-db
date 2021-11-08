<script lang="ts">
	import { onMount } from 'svelte';
	import { pop } from 'svelte-spa-router';

	onMount(() => {
		pop();
	});
</script>
