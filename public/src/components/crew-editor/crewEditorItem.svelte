<script lang="ts">
	import { onMount } from 'svelte';
	import { get, writable } from 'svelte/store';
	import type { Writable } from 'svelte/store';

	import { Crew, CrewMember } from '../../types/index';
	import CrewEditorItemMember from './crewEditorItemMember.svelte';
	import { getMember } from '../../stores/members';

	type AgeGroup = 'U15' | 'U16' | 'U17' | 'U18';
	type Gender = 'M' | 'F';
	type BoatSize = '1' | '2' | '4' | '5' | '9';

	export let initSize: BoatSize | null = null;
	export let crew: Writable<Crew> | Writable<null> = writable(null);

	let c = $crew;

	type currentErrorInEditor =
		| ''
		| 'Not All Seats Filled'
		| 'No Coach'
		| 'No Crew Name'
		| 'Invalid Name'
		| 'No Oars'
		| 'No Boat Allocated'
		| 'Crew Type does not match size';
	type currentWarningInEditor =
		| ''
		| 'Mixed Age Groups Detected'
		| 'Mixed Genders Selected'
		| 'Non-Novices in Novice Boat';

	let currentError: currentErrorInEditor = '';
	let currentWarning: currentWarningInEditor = '';

	let memberInputs: (HTMLDivElement | null)[] = [];

	function validate(): boolean {
		if (get(crew) == null) return;

		currentError = '';
		currentWarning = '';

		console.log('VALIDATING', c);

		$crew.is_valid = false;

		// MMMMMMMMMM REGEX
		// Matches boat crews
		// B U18 8+ is valid in this bs
		let crewNameRegex =
			/(M|W|G|B) (U|N)((1)(5|6|7|8)) ((1|2|4|8)X?(\+|-)?)/;

		if (c.crewName.trim() == '') {
			currentError = 'No Crew Name';
			return false;
		}

		if (!c.crewName.trim().toUpperCase().match(crewNameRegex)) {
			currentError = 'Invalid Name';
			return false;
		}

		if (c.oars.trim() == '') {
			currentError = 'No Oars';
			return false;
		}

		if (c.coach.trim() == '') {
			currentError = 'No Coach';
			return false;
		}

		if (c.boatName.trim() == '') {
			currentError = 'No Boat Allocated';
			return false;
		}

		// OH BOY, Time to validate the CREWS;

		if (c.crewName.trim().toUpperCase().match(crewNameRegex)) {
			let ageGroup: AgeGroup;
			let gender: Gender;
			let boatSize: BoatSize;
			let novice: boolean;

			let n = c.crewName.trim().toUpperCase();

			if (n.match(/(8X?\+)/)) boatSize = '9';
			// TODO: CAN BE 4+ for 4-
			else if (n.match(/(4X?(\+|-))/)) boatSize = '4';
			else if (n.match(/(2X?-?)/)) boatSize = '2';
			else if (n.match(/(1X-?)/)) boatSize = '1';
			else {
				currentError = 'Invalid Name';
				return false;
			}

			if (boatSize != c.boatSize) {
				currentError = 'Crew Type does not match size';
				return false;
			}

			if (n.match(/((U|N)18)/)) ageGroup = 'U18';
			else if (n.match(/((U|N)17)/)) ageGroup = 'U17';
			else if (n.match(/((U|N)16)/)) ageGroup = 'U16';
			else if (n.match(/((U|N)15)/)) ageGroup = 'U15';
			else {
				currentError = 'Invalid Name';
				return false;
			}

			if (n.match(/(M|B)/)) gender = 'M';
			else if (n.match(/(G|W)/)) gender = 'F';
			else {
				currentError = 'Invalid Name';
				return false;
			}

			if (n.match(/(N)(1)(5|6|7|8)/)) novice = true;
			else if (n.match(/(U)(1)(5|6|7|8)/)) novice = false;
			else {
				currentError = 'Invalid Name';
				return false;
			}

			c.seats.forEach((val: Writable<CrewMember>, index: number) => {
				let a = get(val);
				let cox: boolean = false;

				if (index == +c.boatSize && +c.boatSize % 2 == 1) {
					cox = true;
				}

				if (novice && !a.is_novice && !cox) {
					this.currentWarning = 'Non-Novices in Novice Boat';
				}

				if (a != undefined && a != null && !cox) {
					if (a.ageGroup != ageGroup) {
						// console.info(`${val.name} is a ${val.ageGroup} ${val.gender}, the age group of this boat is ${ageGroup}`)

						this.currentWarning = 'Mixed Age Groups Detected';
					} else if (a.gender != gender) {
						// console.info(`${val.name} is a ${val.ageGroup} ${val.gender}, the gender of this boat is ${gender}`)
						this.currentWarning = 'Mixed Genders Selected';
					}
				}
			});

			// All of that just for warnings
			// and some more error detection i guess but the situations wont pop up
			// if they do, something is VERY wrong
		}

		$crew.is_valid = true;

		c.seats.forEach((val) => {
			if (val == undefined) {
				currentError = 'Not All Seats Filled';
				return false;
			}
		});

		return true;
	}

	onMount(() => {
		// IF CREATING NEW CREW, INITIALISE WITH DEFAULT PARAMETERS
		if (crew == null) {
			crew = writable(new Crew({ size: initSize! }));
			memberInputs = Array.apply(null, Array(parseInt(c.boatSize)));
			// console.log('EDITOR', crew.boatSize, crew, memberInputs);
		}
	});

	$: {
		if (crew != null) {
			validate();
		}
	}

	$: {
		console.log(memberInputs);
	}

	$: {
		console.log(crew);
	}

	const crew_has_changed = () => {
		console.log('CREW UPDATED', crew);
		c.has_changed = true;
	};
</script>

<div class="crew-editor">
	{#if crew != null}
		<!-- Top Row Inputs -->
		<div class="inputs">
			<input
				type="text"
				name="name"
				bind:value={c.crewName}
				on:input={crew_has_changed}
			/>
			<input
				type="text"
				name="oars"
				bind:value={c.oars}
				on:input={crew_has_changed}
			/>
		</div>
		<!-- Bottom Row Inputs -->
		<div class="inputs">
			<input
				type="text"
				name="coach"
				bind:value={c.coach}
				on:input={crew_has_changed}
			/>
			<input
				type="text"
				name="boat"
				bind:value={c.boatName}
				on:input={crew_has_changed}
			/>
		</div>

		<!-- Crew Inputs -->

		<div
			class="members"
			class:single={c.boatSize == '1'}
			class:double={c.boatSize == '2'}
			class:quad={['4', '5'].includes(c.boatSize)}
			class:eight={c.boatSize == '9'}
			class:coxed={+c.boatSize % 2 == 1}
		>
			{#each c.seats as s, i}
				{#if ['5', '9'].includes(c.boatSize) && i == +c.boatSize - 1}
					<div class="item separator">-</div>
				{/if}
				<CrewEditorItemMember
					member={$crew.seats[i]}
					onChange={(id) => {
						s = getMember(id);
						crew_has_changed();
					}}
				/>
			{/each}
		</div>
		<!-- Errors -->

		<div class="error-binn">
			{#if currentError != ''}
				<div class="error">{currentError}</div>
			{:else if currentWarning != ''}
				<div class="warning">currentWarning</div>
			{:else}
				<div class="valid">This is a Valid Crew</div>
			{/if}

			<div class="right">
				<!-- TODO: Delete Button -->
			</div>
		</div>
	{/if}
</div>

<style lang="scss">
	.crew-editor {
		width: 75%;
		margin: 32px auto;
		height: fit-content;

		border: 1px solid red;

		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;

		.members {
			height: 300px;
			width: 100%;

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
