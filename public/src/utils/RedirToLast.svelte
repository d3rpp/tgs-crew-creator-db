<script lang="ts">
	import { onMount } from 'svelte';
	import { pop } from 'svelte-stack-router';

	onMount(() => {
		pop();
	});
</script>
