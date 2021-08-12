import { CrewDisplayItem } from './components/CrewDisplayItem';
import { CrewEditorSerialised } from './components/CrewEditorItem';

class CrewDisplay {
	mainPoint: HTMLElement;
	items: CrewDisplayItem[] = [];
	crews: CrewEditorSerialised[];

	constructor(querySelector: string) {
		try {
			this.mainPoint = document.querySelector(querySelector)!;
		} catch (e) {
			throw new Error(
				'Crew Display: Unable to find master element for page'
			);
		}

		// window.addEventListener('storage', () => {
		// 	this.loadCrews();
		// 	this.renderCrews();
		// 	console.log('updated');
		// });

		this.loadCrews().then((val) => {
			this.crews = val;
			this.renderCrews();
			console.info('Crew Display: Initialised Successfuly');
		});
	}

	private async loadCrews() {
		let data = await fetch('/api/crews/');

		return data.json().then((val) => {
			return val.map((v2) => {
				return {
					boatName: v2.boatName,
					coachName: v2.coach.name,
					crewType: v2.crewName,
					oars: v2.oars,
					seats: v2.seats,
				} as CrewEditorSerialised;
			});
		});

		// this.crews = JSON.parse(
		// 	atob(window.localStorage.getItem('crews'))
		// ) as CrewEditorSerialised[];
	}

	private renderCrews() {
		// console.log("RENDER CREW DISPLAY")

		this.items = [];
		this.mainPoint.innerHTML = `<div class="container"></div>`;
		let container = this.mainPoint.querySelector('.container');

		try {
			this.crews.forEach((val: CrewEditorSerialised) => {
				this.items.push(new CrewDisplayItem(val));
			});
		} catch (e) {
			console.warn(e);
			return;
		}

		this.items.forEach((val: CrewDisplayItem) => {
			container.appendChild(val.render());
		});
	}
}

export { CrewDisplay };
