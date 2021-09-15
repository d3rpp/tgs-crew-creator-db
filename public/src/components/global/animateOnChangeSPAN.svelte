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

<span class={currentClasses}>{value}</span>

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

	span {
		display: flex;
		flex-direction: column;
		justify-content: center;

		text-align: center;
	}

	.left {
		text-align: left;
		padding-left: 8px;
	}
</style>
