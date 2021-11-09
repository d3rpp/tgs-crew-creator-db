<script lang="ts">
	export let placeholder = ' ';
	export let value = '';
	export let onChange: (ev: any) => void = () => {};

	export let label = '';

	export let errorState: 'normal' | 'error' | 'warn' = 'normal';

	let state: 'full' | 'empty' = 'empty';

	$: state = value.trim() != '' ? 'full' : 'empty';
</script>

<div class="text-field">
	<input
		type="text"
		on:input={onChange}
		bind:value
		{placeholder}
		name={label}
		class={state + ' ' + errorState}
	/>
	{#if label != ''}
		<label for={label}>{label}</label>
	{/if}
</div>

<style scoped>
	.text-field {
		position: relative;

		width: 90%;
	}

	input {
		width: 100%;
		padding: 10px 8px;
		font-size: 16px;
		margin: 16px 8px;
		border: none;
		outline: none;
		background: transparent;
		color: #fff;
		border-bottom: 1px solid #eeeeee88;
		transition: border-bottom 200ms ease;
	}

	input:focus,
	input.full {
		border-bottom: 1px solid #eee;
	}

	label {
		position: absolute;
		top: 16px;
		left: 10px;
		padding: 10px 0;
		font-size: 16px;
		pointer-events: none;
		transition: 0.2s;
		color: #eee;
	}

	input:focus ~ label,
	input.full ~ label {
		top: 0px;
		left: 10;
		color: #eeeeeedd;
		font-size: 12px;
	}

	.warn {
		border-bottom: 1px solid #c9c900;
	}

	.error {
		border-bottom: 1px solid #8d0d0d;
	}
</style>
