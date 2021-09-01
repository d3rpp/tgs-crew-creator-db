<script lang="ts">
	export let label = '';
	export let checked = false;
</script>

<div class="checkbox-input">
	<input type="checkbox" bind:checked name={label} />
	<label for={label}>{label}</label>
</div>

<style>
	.checkbox-input {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;

		margin: 16px;
	}

	input {
		border: 2px solid #eeeeee88;
		border-radius: 3px;

		width: 24px;
		height: 24px;

		margin-right: 8px;

		transition: background-color 100ms ease;
	}

	input:not(:checked) {
		background-color: #882222aa;
	}

	input:checked {
		background-color: #228822aa;
	}
</style>
