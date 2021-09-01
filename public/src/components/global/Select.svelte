<script lang="ts">
	export let value = '';
	export let label = '';
	export let options: string[] = [];
</script>

<div class="select-field">
	<select bind:value name={label} style="border-radius: 0;">
		{#each options as value}
			<option {value}>{value}</option>
		{/each}
	</select>

	{#if label != ''}
		<label for={label}>{label}</label>
	{/if}
</div>

<style scoped>
	.select-field {
		position: relative;
		width: 100%;
	}

	select {
		/* -webkit-appearance: none; */

		width: 100%;

		padding: 0px 8px;

		height: 36px;
		font-size: 16px;
		margin: 16px 8px;
		border: none;
		outline: none;
		background: none;

		overflow: visible;

		border-radius: 0;

		border-bottom: 1px solid #eee;
		color: #fff;
	}

	label {
		position: absolute;
		top: -4px;
		left: 10px;
		padding: 10px 0;
		font-size: 12px;
		pointer-events: none;
		transition: 0.2s;
		color: #eeeeeedd;
	}
</style>
