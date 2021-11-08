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
	import members from './stores/members';

	// LIB IMPORT
	import Router from 'svelte-spa-router';
	import { onMount } from 'svelte';
	import { writable } from 'svelte/store';
	import { CrewMember, Crew } from './types';
	import type { CrewMemberAPIInterface } from './types';
	import { somethingIsLoading } from './stores/buffers';
	import crews from './stores/crews';

	const routes = {
		'/': RedirToEditor,
		'/member-editor': MemberEditor,
		'/crew-editor': CrewEditor,
		'/crew-display': CrewDisplay,
		'*': RedirToLast,
	};

	onMount(() => {
		somethingIsLoading.set(true);

		fetch_members();
	});

	const fetch_members = () => {
		fetch('/api/members/ids').then((val) => {
			val.json().then((list: number[]) => {
				list.forEach((num) => {
					fetch(`/api/members/${num}`).then((val) => {
						val.json().then((member: CrewMemberAPIInterface) => {
							members.update((current) => {
								return [
									...current,
									writable(new CrewMember(member)),
								];
							});
						});
					});
				});
				somethingIsLoading.set(false);
				fetch_crews();
			});
		});
	};

	const fetch_crews = () => {
		fetch('/api/crews/ids').then((val) => {
			val.json().then((list: number[]) => {
				list.forEach((num) => {
					crews.update((current) => {
						return [...current, writable(new Crew({ id: num }))];
					});
				});
				somethingIsLoading.set(false);
			});
		});
	};
</script>

<Header />
<Router {routes} />
