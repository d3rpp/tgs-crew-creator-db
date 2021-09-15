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
	import { somethingIsLoading } from './stores/buffers';

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
		somethingIsLoading.set(true);
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

							somethingIsLoading.set(false);
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

<Header />
<StackRouter {routes} transitionFn={transition} on:error={console.error} />
