<script lang="ts">
	import { get } from 'svelte/store';
	import type { Writable } from 'svelte/store';
	import type { CrewMember } from '../../types/index';
	import { onDestroy, onMount } from 'svelte';

	import { fade, slide } from 'svelte/transition';
	import { expoOut } from 'svelte/easing';

	import ChangeOnAnimate from '../global/animateOnChangeTD.svelte';

	import SvelteTooltip from 'svelte-tooltip';

	let unsubscribe: { (): void };

	export let member: Writable<CrewMember>;
	export let pushToBuffer: { (mem: Writable<CrewMember>): void };
	export let deleteFunction: { (mem: Writable<CrewMember>): void };

	let intMem = get(member);

	onMount(() => {
		unsubscribe = member.subscribe((newVal) => {
			intMem = newVal;
		});
	});

	onDestroy(() => {
		unsubscribe();
	});
</script>

<tr in:fade={{ delay: 100, duration: 200, easing: expoOut }}>
	<ChangeOnAnimate value={intMem.gender == 'M' ? 'Male' : 'Female'} />

	<ChangeOnAnimate
		value={`${intMem.ageGroup} ${intMem.is_novice ? 'Novice' : ''}`}
	/>

	<ChangeOnAnimate value={intMem.name || 'unnamed'} initialClasses="left" />

	<td class="icons">
		<SvelteTooltip bottom tip="Edit this Crew Member" color="#002a37">
			<span
				class="material-icons"
				on:click={() => {
					console.log('Pushing to buffer buffer');
					pushToBuffer(member);
				}}
			>
				edit
			</span>
		</SvelteTooltip>
		<SvelteTooltip bottom tip="Delete this Crew Member" color="#002a37">
			<span
				class="material-icons"
				on:click={() => deleteFunction(member)}
			>
				delete
			</span>
		</SvelteTooltip>
	</td>
</tr>

<style>
	tr {
		display: grid;
		grid-template-rows: 100%;
		grid-template-columns: 1fr 1fr 3fr 1fr;

		/* overflow: hidden; */

		height: 48px;

		margin: 0;
	}

	td {
		display: flex;
		flex-direction: column;
		justify-content: center;

		border-left: 0.5px solid #aaaaaa88;

		border-bottom: 0.5px solid #aaaaaa88;
		border-right: 0.5px solid #aaaaaa88;

		text-align: center;
	}

	.icons {
		display: flex;
		flex-direction: row;
		justify-content: space-evenly;
		align-items: center;
	}

	.icons span {
		cursor: pointer;
		color: #eee;

		user-select: none;
		-webkit-user-select: none;
		-ms-user-select: none;
	}

	.icons span:active {
		color: #ccc;
	}
</style>
