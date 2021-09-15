<script lang="ts">
	export let value: number | string;
	export let initialClasses: string = '';

	let currentClasses = '';

	function anim() {
		currentClasses = initialClasses + ' leave';

		setTimeout(() => {
			currentClasses = initialClasses + ' animate';

			setTimeout(() => {
				currentClasses = initialClasses;
			}, 155);
		}, 55);
	}

	$: {
		value;
		anim();
	}
</script>

<td class={currentClasses}>{value}</td>

<style scoped>
	@keyframes slideIn {
		0% {
			text-indent: -5px;
			color: #eeeeee00;
		}

		100% {
			text-indent: 0px;
			color: #eeeeee;
		}
	}

	.animate {
		animation: slideIn 150ms ease-out forwards;
	}

	.leave {
		color: #eeeeee00;
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

	.left {
		text-align: left;
		padding-left: 8px;
	}
</style>
