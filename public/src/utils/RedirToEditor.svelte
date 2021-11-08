<script lang="ts">
	import { onMount } from 'svelte';
	import { push } from 'svelte-spa-router';

	onMount(() => {
		push('/member-editor');
	});
</script>
