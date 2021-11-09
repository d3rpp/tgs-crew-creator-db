<script lang="ts">
	import { get } from 'svelte/store';
	import type { Writable } from 'svelte/store';
	import type { Crew } from '../../types';
	import Item from './Item.svelte';

	export let crew: Writable<Crew>;

	let c = $crew;
	let loading = c.is_loading;
</script>

<div class="cr">
	{#key $loading}
		<div class="left">
			<div class="title">{c.crewName}</div>
			<div class="oars">
				<b>Oars:</b>
				{c.oars}
			</div>
			<div class="coach"><b>Coach:</b> {c.coach}</div>
			<div class="boat"><b>Boat:</b> {c.boatName}</div>
		</div>
		<div
			class="mems"
			class:single={c.seats.length == 1}
			class:double={c.seats.length == 2}
			class:quad={[4, 5].includes(c.seats.length)}
			class:eight={c.seats.length == 9}
			class:coxed={c.seats.length % 2 == 1}
		>
			{#each c.seats as s, i}
				{#if [5, 9].includes(c.seats.length) && i == c.seats.length - 1}
					<div class="item separator">-</div>
				{/if}
				<Item mem={s} />
			{/each}
		</div>
	{/key}
</div>

<style lang="scss" scoped>
	.cr {
		display: grid;
		grid-template-columns: 1fr 2fr;

		height: 300px;

		padding: 8px;

		border: 1px solid white;
		border-radius: 5px;

		.left {
			height: 100%;

			.title {
				font-size: 1.5em;
				color: #ffb511;
			}

			b {
				color: #ffb511;
			}
			display: flex;
			flex-direction: column;
			justify-content: space-evenly;
			align-items: left;
		}
		.mems {
			height: 100%;
			width: 100%;

			padding: 0 16px;

			.separator {
				display: flex;
				justify-content: center;
				align-items: center;
			}

			// SINGLE
			&.single,
			&.double {
				display: flex;
				flex-direction: row;
				justify-content: center;
				align-items: center;

				padding: 20% 0;
			}

			&.quad {
				&:not(.coxed) {
					display: grid;
					grid-template-columns: 1fr 1fr;
					grid-template-rows: 1fr 1fr;
				}

				&.coxed {
					display: grid;
					grid-template-columns: 1fr 1fr 1fr 1fr;
					grid-template-rows: 1fr 1fr;
				}
			}

			&.eight {
				display: grid;
				grid-template-columns: 1fr 1fr 1fr 1fr 1fr;
				grid-template-rows: 1fr 1fr;
			}
		}
	}
</style>
