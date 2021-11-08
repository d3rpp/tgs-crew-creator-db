<script lang="ts">
	import type { CrewMember } from '../../types';

	export let member: CrewMember;
</script>

<div class="item" data-id={member.id}>
	{JSON.stringify(member, null, 4)}
</div>

<style lang="scss" scoped>
	.item {
		width: 100%;
		/* height: 100%; */

		border: 1px solid orange;

		padding: 8px 0;

		/* user-select: none;
		-ms-user-select: none;
		-moz-user-select: none;
		-webkit-user-select: none; */

		cursor: pointer;

		transition: opacity 100ms ease;
	}

	:global(.sortable-ghost) {
		opacity: 0.6;
	}
</style>
