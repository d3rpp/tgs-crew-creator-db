<script lang="ts">
	import { onDestroy, onMount } from 'svelte';
	import { get, writable } from 'svelte/store';
	import type { Writable } from 'svelte/store';
	import { CrewMember } from '../../types/index';
	import type { CrewMemberInterface } from '../../types/index';
	import AnimateOnChangeSpan from '../global/animateOnChangeSPAN.svelte';
	import members from '../../stores/members';

	import TextField from '../global/TextField.svelte';
	import Select from '../global/Select.svelte';
	import Checkbox from '../global/Checkbox.svelte';
	import Button from '../global/Button.svelte';

	export let buffer: Writable<Writable<CrewMember>>;

	let currentBuffer: Writable<CrewMember> = get(buffer);

	let unsubFromCurrentValue: { (): void };
	let currentValue: CrewMember = get(currentBuffer);

	let unsubscribe: { (): void };

	let currentErrorState:
		| ''
		| 'Name is Too Long (Max 30 Characters)'
		| 'No Name is inputted' = '';

	const MAX_NAME_LENGTH = 30;

	$: {
		if (currentValue.name.length > MAX_NAME_LENGTH) {
			currentErrorState = 'Name is Too Long (Max 30 Characters)';
		} else if (currentValue.name.trim().length == 0) {
			currentErrorState = 'No Name is inputted';
		} else {
			currentErrorState = '';
		}
	}

	function clearBuffer() {
		buffer.set(
			writable(
				new CrewMember({
					id: 0,
					name: '',
					ageGroup: 'U15',
					gender: 'M',
					novice: false,
				} as CrewMemberInterface)
			)
		);
	}

	function resetBuffer(_ev) {
		currentValue = get(currentBuffer);

		console.log('Resetting Buffer to', { currentValue });
	}

	function pushValue(_ev) {
		if (currentErrorState != '') {
			console.log(currentErrorState, 'unable to push value');
			return;
		}

		console.log('Pushing Value', { currentValue });

		if (currentValue.name.trim() == '') {
			alert("There doesn't seem to be a name entered");
			return;
		}

		if (currentValue.id > 0) {
			currentValue.update().then(() => {
				currentBuffer.set(currentValue);
				clearBuffer();
			});
		} else {
			currentValue.create().then(() => {
				currentBuffer.set(currentValue);
				members.update((buf: Writable<CrewMember>[]) => [
					...buf,
					currentBuffer,
				]);
				clearBuffer();
			});
		}
	}

	onMount(() => {
		unsubscribe = buffer.subscribe((newBuf) => {
			if (unsubFromCurrentValue) unsubFromCurrentValue();

			currentBuffer = newBuf;

			unsubFromCurrentValue = currentBuffer.subscribe((newVal) => {
				currentValue = newVal;
			});
		});
	});

	onDestroy(() => {
		unsubscribe();
	});
</script>

<div id="member-editor-buffer">
	<form on:submit|preventDefault on:reset|preventDefault>
		<div class="spacer" />
		<div class="row">
			<TextField label="Name" bind:value={currentValue.name} />
		</div>
		<div class="row">
			<span
				style="width:90%; display: flex; flex-direction: row; justify-content:space-evenly;"
			>
				<Select
					label="Gender"
					options={['M', 'F']}
					bind:value={currentValue.gender}
				/>

				<div style="width: 16px;" />

				<Select
					label="Age Group"
					options={['U15', 'U16', 'U17', 'U18']}
					bind:value={currentValue.ageGroup}
				/>
			</span>
		</div>
		<div class="row">
			<Checkbox label="Novice?" bind:checked={currentValue.is_novice} />
		</div>
		<div class="spacer" />
		<div class="row">
			<Button onClick={pushValue} type="submit" style="filled">
				{currentValue.id > 0 ? 'Update' : 'Create'}
			</Button>
			<span style="width:16px;" />
			<Button onClick={resetBuffer} type="reset" style="hollow">
				Clear
			</Button>
		</div>
		<div class="spacer" />
	</form>
	{#if currentErrorState != ''}
		<div class="error">
			{currentErrorState}
		</div>
	{/if}
	<div class="id">
		ID:&nbsp;
		<AnimateOnChangeSpan
			value={`${currentValue.id <= 0 ? 'none' : currentValue.id}`}
		/>
	</div>

	{#if currentValue.is_loading && currentValue.id > 0}
		<div class="loading">loading...</div>
	{/if}
</div>

<style scoped>
	#member-editor-buffer {
		border: 1px solid #aaaaaa22;

		width: 80%;
		height: 40%;
	}

	form {
		width: 100%;
		height: 100%;

		display: flex;
		justify-content: center;
		align-items: center;

		flex-direction: column;
	}

	.spacer {
		flex: 1 1 auto;
	}

	.error {
		position: absolute;
		left: calc(5% + 8px);
		bottom: 29%;

		width: fit-content;

		display: flex;
		justify-content: center;
		align-items: flex-end;

		color: #d80000ee;
	}

	.id {
		position: absolute;
		right: calc(55% + 8px);
		bottom: 29%;

		width: fit-content;

		display: flex;
		justify-content: center;
		align-items: flex-end;

		color: #eeeeee88;
	}

	.row {
		display: flex;
		justify-content: center;
		align-items: center;
		width: 90%;
		margin: 0 auto;
	}
</style>
