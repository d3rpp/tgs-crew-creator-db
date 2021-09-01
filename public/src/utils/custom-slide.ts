import { commonTransitionGenerator, NavigationType } from 'svelte-stack-router';

function makeStyleTag(content) {
	const styleTag = document.createElement('style');
	styleTag.innerHTML = content;
	return styleTag;
}

export function leftSlide(duration) {
	return commonTransitionGenerator(duration, [
		(loadClass, unloadClass, routerClass, { navigationType }) =>
			makeStyleTag(`
				html {
					scroll-behavior: smooth;
				}
				.${loadClass} {
					position: absolute;
					z-index: 2;
					left: 0;
					top: 0;
					right: 0;
					opacity: 1;
					transform: translateX(${
						navigationType === NavigationType.GoBackward ? '-' : ''
					}100%);
				}
				.${unloadClass} {
					position: relative;
					z-index: 1;
					opacity: 1;
					transform: translateX(0%);
				}
				.${routerClass} {
					position: relative;
					overflow: hidden;
				}
			`),
		(_1, _2, routerClass, { mountPointToLoad, mountPointToUnload }) =>
			makeStyleTag(`
				.${routerClass} {
					min-height: ${Math.max(
						mountPointToLoad.offsetHeight,
						mountPointToUnload?.offsetHeight || 0
					)}px;
					min-width: ${Math.max(
						mountPointToLoad.offsetWidth,
						mountPointToUnload?.offsetWidth || 0
					)}px;
				}
			`),
		(loadClass, unloadClass, _, { navigationType }) =>
			makeStyleTag(`
				.${loadClass} {
					transition: transform ${duration}ms, opacity ${Math.floor(
				duration / 2
			)}ms linear ${Math.floor(duration / 2)}ms;
					opacity: 1;
					transform: translateX(0%);
				}
				.${unloadClass} {
					transition: transform ${duration}ms, opacity ${Math.floor(
				duration / 2
			)}ms linear;
					opacity: 1;
					transform: translateX(${
						navigationType === NavigationType.GoBackward ? '' : '-'
					}100%);
				}
			`),
	]);
}

export function rightSlide(duration) {
	return commonTransitionGenerator(duration, [
		(loadClass, unloadClass, routerClass, { navigationType }) =>
			makeStyleTag(`
				html {
					scroll-behavior: smooth;
				}
				.${loadClass} {
					position: absolute;
					z-index: 2;
					left: 0;
					top: 0;
					right: 0;
					opacity: 1;
					transform: translateX(-100%);
				}
				.${unloadClass} {
					position: relative;
					z-index: 1;
					opacity: 1;
					transform: translateX(0%);
				}
				.${routerClass} {
					position: relative;
					overflow: hidden;
				}
			`),
		(_1, _2, routerClass, { mountPointToLoad, mountPointToUnload }) =>
			makeStyleTag(`
				.${routerClass} {
					min-height: ${Math.max(
						mountPointToLoad.offsetHeight,
						mountPointToUnload?.offsetHeight || 0
					)}px;
					min-width: ${Math.max(
						mountPointToLoad.offsetWidth,
						mountPointToUnload?.offsetWidth || 0
					)}px;
				}
			`),
		(loadClass, unloadClass, _, { navigationType }) =>
			makeStyleTag(`
				.${loadClass} {
					transition: transform ${duration}ms, opacity ${Math.floor(
				duration / 2
			)}ms linear ${Math.floor(duration / 2)}ms;
					opacity: 1;
					transform: translateX(0%);
				}
				.${unloadClass} {
					transition: transform ${duration}ms, opacity ${Math.floor(
				duration / 2
			)}ms linear;
					opacity: 1;
					transform: translateX(100%);
				}
			`),
	]);
}
