<script lang="ts">
	// Component Import
	import Header from './components/Header.svelte';

	// PAGE IMPORT
	import CrewDisplay from './pages/CrewDisplay.svelte';
	import CrewEditor from './pages/CrewEditor.svelte';
	import MemberEditor from './pages/MemberEditor.svelte';

	import RedirToEditor from './utils/RedirToEditor.svelte';
	import RedirToLast from './utils/RedirToLast.svelte';

	// Stores
	import tr from './stores/transition';
	import members from './stores/members';

	// LIB IMPORT
	import { dive, StackRouter } from 'svelte-stack-router';
	import { onDestroy, onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { CrewMember } from './types';
	import type { CrewMemberAPIInterface } from './types';

	const routes = {
		'/': RedirToEditor,
		'/member-editor': MemberEditor,
		'/crew-editor': CrewEditor,
		'/crew-display': CrewDisplay,
		'*': RedirToLast,
	};

	let transition: any = dive(300);

	const unsubscribe = tr.subscribe((anim) => {
		transition = anim;
	});

	onMount(() => {
		fetch('/api/members/ids').then((val) => {
			val.json().then((list: number[]) => {
				list.forEach((num) => {
					fetch(`/api/members/${num}`).then((val) => {
						val.json().then((member: CrewMemberAPIInterface) => {
							console.log({ member });

							members.update((current) => {
								return [
									...current,
									writable(new CrewMember(member)),
								];
							});
						});
					});
				});
			});
		});
	});

	onDestroy(() => {
		unsubscribe();
	});
</script>

<svelte:head>
	<meta name="theme-color" content="#002a37" />

	<link rel="shortcut icon" href="/icons/favicon.ico" type="image/x-icon" />
	<link rel="apple-touch-icon" href="/icons/apple-touch-icon.png" />
	<link
		rel="apple-touch-icon"
		sizes="57x57"
		href="/icons/apple-touch-icon-57x57.png"
	/>
	<link
		rel="apple-touch-icon"
		sizes="72x72"
		href="/icons/apple-touch-icon-72x72.png"
	/>
	<link
		rel="apple-touch-icon"
		sizes="76x76"
		href="/icons/apple-touch-icon-76x76.png"
	/>
	<link
		rel="apple-touch-icon"
		sizes="114x114"
		href="/icons/apple-touch-icon-114x114.png"
	/>
	<link
		rel="apple-touch-icon"
		sizes="120x120"
		href="/icons/apple-touch-icon-120x120.png"
	/>
	<link
		rel="apple-touch-icon"
		sizes="144x144"
		href="/icons/apple-touch-icon-144x144.png"
	/>
	<link
		rel="apple-touch-icon"
		sizes="152x152"
		href="/icons/apple-touch-icon-152x152.png"
	/>
	<link
		rel="apple-touch-icon"
		sizes="180x180"
		href="/icons/apple-touch-icon-180x180.png"
	/>

	<link
		rel="stylesheet"
		href="https://necolas.github.io/normalize.css/latest/normalize.css"
	/>
	<title>TGSRC Crew Creator</title>
</svelte:head>

<Header />
<StackRouter
	{routes}
	transitionFn={transition}
	on:navigation-start={console.log}
	on:navigation-end={console.log}
	on:error={console.error}
/>

<style scoped>
</style>
