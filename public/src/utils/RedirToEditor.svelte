<script lang="ts">
	import { onMount } from 'svelte';
	import { push } from 'svelte-stack-router';

	onMount(() => {
		push('/member-editor');
	});
</script>
