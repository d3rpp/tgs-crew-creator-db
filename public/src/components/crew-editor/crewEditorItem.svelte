<script lang="ts">
	import { onMount } from 'svelte';
	import { get, writable } from 'svelte/store';
	import type { Writable } from 'svelte/store';

	import type { Crew } from '../../types/index';
	import CrewEditorItemMember from './crewEditorItemMember.svelte';
	import { getMember } from '../../stores/members';
	import TextField from '../global/TextField.svelte';
	import SvelteTooltip from 'svelte-tooltip';

	type AgeGroup = 'U15' | 'U16' | 'U17' | 'U18';
	type Gender = 'M' | 'F';
	type BoatSize = '1' | '2' | '4' | '5' | '9';

	export let crew: Writable<Crew> | Writable<null> = writable(null);

	let buffer = $crew.toInterface();
	let is_loading = $crew.is_loading;

	type currentErrorInEditor =
		| ''
		| 'No Coach'
		| 'No Crew Name'
		| 'Invalid Name'
		| 'No Oars'
		| 'No Boat Allocated'
		| 'Crew Type does not match size';
	type currentWarningInEditor =
		| ''
		| 'Not All Seats Filled'
		| 'Mixed Age Groups Detected'
		| 'Mixed Genders Selected'
		| 'Non-Novices in Novice Boat';

	let currentError: currentErrorInEditor = '';
	let currentWarning: currentWarningInEditor = '';

	let updateKey = 0;

	let memberInputs: (HTMLDivElement | null)[] = [];

	function validate(): boolean {
		if (get(crew) == null) return;

		currentError = '';
		currentWarning = '';

		console.log('VALIDATING', buffer);

		$crew.is_valid = false;

		// MMMMMMMMMM REGEX
		// Matches boat crews
		// B U18 8+ is valid in this bs
		let crewNameRegex =
			/(M|W|G|B) (U|N)((1)(5|6|7|8)) ((1|2|4|8)X?(\+|-)?)/;

		if (buffer.crewName.trim() == '') {
			currentError = 'No Crew Name';
			return false;
		}

		if (!buffer.crewName.trim().toUpperCase().match(crewNameRegex)) {
			currentError = 'Invalid Name';
			return false;
		}

		if (buffer.oars.trim() == '') {
			currentError = 'No Oars';
			return false;
		}

		if (buffer.coach.trim() == '') {
			currentError = 'No Coach';
			return false;
		}

		if (buffer.boatName.trim() == '') {
			currentError = 'No Boat Allocated';
			return false;
		}

		// OH BOY, Time to validate the CREWS;

		if (buffer.crewName.trim().toUpperCase().match(crewNameRegex)) {
			let ageGroup: AgeGroup;
			let gender: Gender;
			let boatSize: BoatSize;
			let novice: boolean;

			let n = buffer.crewName.trim().toUpperCase();

			if (n.match(/(8X?\+)/)) boatSize = '9';
			else if (n.match(/(4X?(-))/)) boatSize = '4';
			else if (n.match(/(4X?(\+))/)) boatSize = '5';
			else if (n.match(/(2X?-?)/)) boatSize = '2';
			else if (n.match(/(1X-?)/)) boatSize = '1';
			else {
				currentError = 'Invalid Name';
				return false;
			}

			if (boatSize != buffer.boatSize) {
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

			buffer.seats.forEach((val: number, index: number) => {
				let a = get(getMember(val));
				let cox: boolean = false;

				if (index == +buffer.boatSize && +buffer.boatSize % 2 == 1) {
					cox = true;
				}

				if (novice && !a.is_novice && !cox) {
					currentWarning = 'Non-Novices in Novice Boat';
					return;
				}

				if (a != undefined && a != null && !cox) {
					if (a.ageGroup != ageGroup) {
						// console.info(`${val.name} is a ${val.ageGroup} ${val.gender}, the age group of this boat is ${ageGroup}`)

						currentWarning = 'Mixed Age Groups Detected';
						return;
					} else if (a.gender != gender) {
						// console.info(`${val.name} is a ${val.ageGroup} ${val.gender}, the gender of this boat is ${gender}`)
						currentWarning = 'Mixed Genders Selected';
						return;
					}
				} else {
					currentWarning = 'Not All Seats Filled';
					return;
				}
			});

			// All of that just for warnings
			// and some more error detection i guess but the situations wont pop up
			// if they do, something is VERY wrong
		}

		buffer.seats.forEach((val) => {
			if (val == undefined) {
				currentWarning = 'Not All Seats Filled';
			}
		});

		$crew.is_valid = true;

		return true;
	}

	onMount(() => {
		// IF CREATING NEW CREW, INITIALISE WITH DEFAULT PARAMETERS

		memberInputs = Array.apply(-1, Array(parseInt(buffer.boatSize || '0')));

		$crew.onChange = () => {
			buffer = get(crew).toInterface();
			updateKey += 1;
			is_loading.set(false);
		};

		$crew.onChange();
	});

	$: {
		if (buffer != null) {
			validate();
		}
	}

	$: {
		if ($is_loading) {
			if (memberInputs.length == 0) {
				memberInputs = Array.apply(
					-1,
					Array(parseInt(buffer.boatSize || '0'))
				);
			}

			console.log($crew);
		}
	}

	const crew_has_changed = () => {
		console.log('CREW UPDATED', $crew, buffer);
		$crew.crewName = buffer.crewName;
		$crew.boatName = buffer.boatName;
		$crew.oars = buffer.oars;
		$crew.coach = buffer.coach;
		$crew.seats = buffer.seats.map((val) => {
			return getMember(val);
		});

		$crew.has_changed = true;
	};
</script>

{#key updateKey}
	<div class="crew-editor">
		{#if crew != null}
			<!-- Top Row Inputs -->
			<div class="inputs">
				<TextField
					label="Crew Name"
					bind:value={buffer.crewName}
					onChange={crew_has_changed}
				/>

				<TextField
					label="Oars"
					bind:value={buffer.oars}
					onChange={crew_has_changed}
				/>
			</div>
			<!-- Bottom Row Inputs -->
			<div class="inputs">
				<!-- <input
					type="text"
					name="coach"
					bind:value={buffer.coach}
					on:input={crew_has_changed}
				/>
				<input
					type="text"
					name="boat"
					bind:value={buffer.boatName}
					on:input={crew_has_changed}
				/> -->

				<TextField
					label="Coach"
					bind:value={buffer.coach}
					onChange={crew_has_changed}
				/>

				<TextField
					label="Boat"
					bind:value={buffer.boatName}
					onChange={crew_has_changed}
				/>
			</div>

			<!-- Crew Inputs -->

			<div
				class="dnd-members"
				class:single={buffer.seats.length == 1}
				class:double={buffer.seats.length == 2}
				class:quad={[4, 5].includes(buffer.seats.length)}
				class:eight={buffer.seats.length == 9}
				class:coxed={buffer.seats.length % 2 == 1}
			>
				{#each buffer.seats as s, i (getMember(s))}
					{#if [5, 9].includes(buffer.seats.length) && i == buffer.seats.length - 1}
						<div class="item separator">-</div>
					{/if}
					<CrewEditorItemMember
						member={getMember(s)}
						onChange={(id) => {
							buffer.seats[i] = id;
							crew_has_changed();
						}}
					/>
				{/each}
			</div>
			<!-- Errors -->

			<div class="error-bin">
				<div class="e">
					{#if currentError != ''}
						<div class="error">{currentError}</div>
					{:else if currentWarning != ''}
						<div class="warning">{currentWarning}</div>
					{:else}
						<div class="valid">This is a Valid Crew</div>
					{/if}
				</div>
				<div class="right">
					<!-- TODO: Delete Button -->

					<SvelteTooltip
						bottom
						tip="Delete this Crew Member"
						color="#002a37"
					>
						<span
							class="material-icons"
							on:click={() => $crew.delete()}
						>
							delete
						</span>
					</SvelteTooltip>
				</div>
			</div>
		{/if}

		<!-- DEBUG STUFF -->
		<!-- {JSON.stringify(buffer)}
		<br />
		{#each $crew.seats as s}
			{JSON.stringify(get(s))}
		{/each} -->
	</div>
{/key}

<style lang="scss">
	.crew-editor {
		width: 75%;
		margin: 32px auto;
		height: fit-content;

		border: 1px solid white;
		border-radius: 3px;

		display: flex;
		flex-direction: column;
		justify-content: flex-start;
		align-items: center;

		.inputs {
			display: flex;
			justify-content: space-around;
			align-items: center;
			width: 100%;
			height: 100%;

			:global(.text-field) {
				width: 40%;
				margin: 16px auto;
			}
		}

		.error-bin {
			height: 64px;
			width: 100%;

			padding: 0 16px;

			display: grid;
			grid-template-columns: 1fr 1fr;

			.e,
			.right {
				display: flex;
				flex-direction: row;
				align-items: center;
			}

			.e {
				grid-column: 1;
				justify-content: flex-start;

				.error {
					color: red;
				}

				.warning {
					color: orange;
				}
				.valid {
					color: green;
				}
			}

			.right {
				grid-column: 2;
				justify-content: flex-end;

				span {
					cursor: pointer;
				}
			}
		}

		.dnd-members {
			height: 300px;
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
