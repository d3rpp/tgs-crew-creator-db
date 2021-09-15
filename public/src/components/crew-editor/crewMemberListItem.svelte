<script lang="ts">
	import type { Writable } from 'svelte/store';
	import type { CrewMember } from '../../types';

	export let member: Writable<CrewMember>;
</script>

<tr>
	{JSON.stringify($member)}
</tr>

<style scoped>
	tr {
		width: 100%;
		/* height: 100%; */

		border: 1px solid orange;

		/* user-select: none;
		-ms-user-select: none;
		-moz-user-select: none;
		-webkit-user-select: none; */

		cursor: pointer;
	}
</style>
