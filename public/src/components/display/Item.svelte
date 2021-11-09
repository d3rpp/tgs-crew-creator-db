<script lang="ts">
	import type { Writable } from 'svelte/store';
	import type { CrewMember } from '../../types';

	export let mem: Writable<CrewMember> | Writable<null>;
</script>

<div class="item">
	{#if $mem != null}
		<span>{$mem.name}</span>
	{:else}
		<span class="empty">Empty Seat</span>
	{/if}
</div>

<style>
	.item {
		display: flex;
		width: 100%;
		height: 100%;

		margin: 8px;
		justify-content: center;
		align-items: center;

		border: 1px solid whitesmoke;
		border-radius: 5px;
	}
	span {
		text-align: center;
	}

	.empty {
		color: red;
	}
</style>
