<script lang="ts">
	export let onClick: { (ev: Event): void };
	export let style: 'hollow' | 'filled';
	export let type = '';
</script>

<div class="button-field">
	<button on:click={onClick} class={style} {type}>
		<slot />
	</button>
</div>

<style>
	.button-field {
		height: 48px;
		width: 128px;

		display: flex;
		justify-content: center;
		align-items: center;
	}

	button {
		width: 90%;
		height: 90%;

		border: 2px solid #ffb511;
		border-radius: 3px;

		cursor: pointer;
	}

	.filled {
		background-color: #ffb511;

		transition: background-color 100ms ease;
	}

	.filled:hover {
		background-color: #ffa600;
	}

	.hollow {
		background: none;
		color: #ffe3a7;
	}
</style>
