<script lang="ts">
	import type { Writable } from 'svelte/store';

	import type { CrewMember } from '../../types/index';

	export let member: Writable<CrewMember> | Writable<null>;
	let id = $member == null ? -1 : $member.id;
</script>

{#if $member != null}
	<div class="item" data-id={id}>
		<span>{$member.name}</span>
		<span>{$member.ageGroup} | {$member.gender}</span>
	</div>
{/if}

<style lang="scss" scoped>
	.item {
		width: 100%;
		/* height: 100%; */

		// border: 1px solid orange;

		padding: 8px 0;

		/* user-select: none;
		-ms-user-select: none;
		-moz-user-select: none;
		-webkit-user-select: none; */

		cursor: pointer;

		transition: opacity 100ms ease;

		span {
			margin: 8px;
		}
	}

	:global(.sortable-ghost) {
		opacity: 0.6;
	}
</style>
