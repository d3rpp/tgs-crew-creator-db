<script lang="ts">
	import tr from '../stores/transition';

	import { location, link } from 'svelte-spa-router';
	import { onDestroy } from 'svelte';

	let pageIndicatorBarClasslist = 'nav-show';

	let unsubscribeFromLocation = location.subscribe((val) => {
		pageIndicatorBarClasslist = `nav-show ${val.substring(1, val.length)}`;
	});

	onDestroy(() => {
		unsubscribeFromLocation();
	});
</script>

<header>
	<h1 class="title">
		<img src="/lion.png" alt="logo" width="36" />
		TGSRC Crew Creator
	</h1>
	<nav>
		<a class="nav-link" use:link href="/member-editor"> Member Editor </a>
		<a class="nav-link" use:link href="/crew-editor"> Crew Editor </a>
		<a class="nav-link" use:link href="/crew-display"> Crew Display </a>
	</nav>
	<div class={pageIndicatorBarClasslist} />
</header>

<style scoped>
	header {
		z-index: 1000;
		position: absolute;
		top: 0;
		left: 0;
		right: 0;

		width: 100vw;
		height: 64px;

		background-color: #002a37;

		display: grid;
		grid-template-rows: 64px;
		grid-template-columns: 1fr 1fr;

		user-select: none;
	}

	.title {
		display: flex;
		flex-direction: row;
		justify-content: flex-start;
		align-items: center;

		padding-left: 16px;

		font-weight: 500;

		font-size: 18px;
	}

	.title img {
		margin-right: 16px;
	}

	nav {
		display: flex;
		flex-direction: row;
		justify-content: space-evenly;
	}

	.nav-link {
		display: flex;
		justify-content: center;
		align-items: center;
		text-align: center;

		width: 100%;
		height: 100%;

		user-select: none;
		-webkit-user-select: none;

		cursor: pointer;

		color: white;
		text-decoration: none;

		background-color: #002a37;
		box-shadow: 0px 1px 3px #002a37 inset;

		transition: background-color 200ms ease, box-shadow 200ms ease;
	}

	.nav-link:hover {
		color: white;
		background-color: #002530;
		box-shadow: 0px 3px 5px #00253088, 0px 1px 3px #002a37 inset;
	}

	.nav-show {
		position: absolute;
		top: 62px;

		width: calc(calc(100vw / 6));
		height: 2px;

		transition: left 300ms ease;

		background-color: #eee;
	}

	.nav-show.member-editor {
		left: 50vw;
	}

	.nav-show.crew-editor {
		left: calc(50vw + calc(50vw / 3));
	}

	.nav-show.crew-display {
		left: calc(50vw + calc(calc(50vw / 3) * 2));
	}
</style>
