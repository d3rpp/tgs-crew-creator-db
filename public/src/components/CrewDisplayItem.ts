import { BoatSize } from '../types';
import { CrewEditorSerialised } from './CrewEditorItem';

export class CrewDisplayItem {
	mainElement: HTMLElement;
	crew: CrewEditorSerialised;
	sizeString: string;
	size: BoatSize;
	coxed: boolean;

	constructor(crew: CrewEditorSerialised) {
		this.mainElement = document.createElement('div');
		this.crew = crew;
		this.sizeString = this.calculateBoatSizeStringForRenderer();
	}

	calculateBoatSizeStringForRenderer(): string {
		let str: string = '';

		switch (this.crew.seats.length) {
			case 1:
				str = 'single coxless';
				this.size = 1;
				this.coxed = false;
				break;
			case 2:
				str = 'double coxless';
				this.size = 2;
				this.coxed = false;
				break;
			case 4:
				str = 'quad coxless';
				this.size = 4;
				this.coxed = false;
				break;
			case 5:
				str = 'quad coxed';
				this.size = 4;
				this.coxed = true;
				break;
			case 9:
				str = 'octuple coxed';
				this.size = 8;
				this.coxed = true;
				break;
			default:
				throw new Error('INVALID CREW');
		}

		return str;
	}

	render(): HTMLElement {
		this.mainElement.classList.add('item');
		this.mainElement.innerHTML = `
			<div class="left">
				<div class="header">
					<h1>${this.crew.crewType.toUpperCase()}</h1>
				</div>
				<div class="sep">hi</div>
				<div class="sub">
					<h2>Boat</h2>
					<span>${this.crew.boatName}</span>
					<h2>Coach</h2>
					<span>${this.crew.coachName}</span>
					<h2>Oars</h2>
					<span>${this.crew.oars}</span>
				</div>
			</div>
			<div class="right ${this.sizeString}">

			<!-- Every Boat has a Stroke Seat, even  singles -->

				<div 
					${
						!!this.crew.seats[0]
							? `
						data-id="${this.crew.seats[0].id}" 
						data-name="${this.crew.seats[0].name}"
						data-novice="${this.crew.seats[0].novice ? 'true' : 'false'}"
						data-age-group="${this.crew.seats[0].ageGroup}
						data-gender="${this.crew.seats[0].gender}"
					`
							: ``
					}>
					${this.crew.seats[0] ? `${this.crew.seats[0].name}` : ``}
				</div>



				${
					this.size == 4 || this.size == 8
						? `
				<div 
				${
					!!this.crew.seats[1]
						? `
					data-id="${this.crew.seats[1].id}" 
					data-name="${this.crew.seats[1].name}"
					data-novice="${this.crew.seats[1].novice ? 'true' : 'false'}"
					data-age-group="${this.crew.seats[1].ageGroup}
					data-gender="${this.crew.seats[1].gender}"
					`
						: ``
				}>
					${this.crew.seats[1] ? `${this.crew.seats[1].name}` : ``}
				</div>

				<div 
				${
					!!this.crew.seats[2]
						? `
					data-id="${this.crew.seats[2].id}" 
					data-name="${this.crew.seats[2].name}"
					data-novice="${this.crew.seats[2].novice ? 'true' : 'false'}"
					data-age-group="${this.crew.seats[2].ageGroup}
					data-gender="${this.crew.seats[2].gender}"
					`
						: ``
				}>
					${this.crew.seats[2] ? `${this.crew.seats[2].name}` : ``}
				</div>
				`
						: ``
				}

				${
					this.size == 8
						? `

				<div 
				${
					!!this.crew.seats[3]
						? `
					data-id="${this.crew.seats[3].id}" 
					data-name="${this.crew.seats[3].name}"
					data-novice="${this.crew.seats[3].novice ? 'true' : 'false'}"
					data-age-group="${this.crew.seats[3].ageGroup}
					data-gender="${this.crew.seats[3].gender}"
					`
						: ``
				}>
					${this.crew.seats[3] ? `${this.crew.seats[3].name}` : ``}
				</div>

				<div 
				${
					!!this.crew.seats[4]
						? `
					data-id="${this.crew.seats[4].id}" 
					data-name="${this.crew.seats[4].name}"
					data-novice="${this.crew.seats[4].novice ? 'true' : 'false'}"
					data-age-group="${this.crew.seats[4].ageGroup}
					data-gender="${this.crew.seats[4].gender}"
					`
						: ``
				}>
					${this.crew.seats[4] ? `${this.crew.seats[4].name}` : ``}
				</div>
				
				<div 
				${
					!!this.crew.seats[5]
						? `
					data-id="${this.crew.seats[5].id}" 
					data-name="${this.crew.seats[5].name}"
					data-novice="${this.crew.seats[5].novice ? 'true' : 'false'}"
					data-age-group="${this.crew.seats[5].ageGroup}
					data-gender="${this.crew.seats[5].gender}"
					`
						: ``
				}>
					${this.crew.seats[5] ? `${this.crew.seats[5].name}` : ``}
				</div>
				
				<div 
				${
					!!this.crew.seats[6]
						? `
					data-id="${this.crew.seats[6].id}" 
					data-name="${this.crew.seats[6].name}"
					data-novice="${this.crew.seats[6].novice ? 'true' : 'false'}"
					data-age-group="${this.crew.seats[6].ageGroup}
					data-gender="${this.crew.seats[6].gender}"
					`
						: ``
				}>
					${this.crew.seats[6] ? `${this.crew.seats[6].name}` : ``}
				</div>
				`
						: ``
				} 

				${
					(this.size == 2 || this.size == 4 || this.size == 8) &&
					this.coxed
						? `
					<div 
					${
						!!this.crew.seats[this.size - 1]
							? `
						data-id="${this.crew.seats[this.size - 1].id}" 
						data-name="${this.crew.seats[this.size - 1].name}"
						data-novice="${this.crew.seats[this.size - 1].novice ? 'true' : 'false'}"
						data-age-group="${this.crew.seats[this.size - 1].ageGroup}
						data-gender="${this.crew.seats[this.size - 1].gender}"
					`
							: ``
					}>
					${
						this.crew.seats[this.size - 1]
							? `${this.crew.seats[this.size - 1].name}`
							: ``
					}
				</div>

				`
						: ``
				}

				${
					this.coxed
						? `<div class="separator"> - </div>
				
					
				`
						: ``
				}

				${
					this.coxed
						? `
								<div
					${
						!!this.crew.seats[this.size]
							? `
						data-id="${this.crew.seats[this.size].id}" 
						data-name="${this.crew.seats[this.size].name}"
						data-novice="${this.crew.seats[this.size].novice ? 'true' : 'false'}"
						data-age-group="${this.crew.seats[this.size].ageGroup}
						data-gender="${this.crew.seats[this.size].gender}"
					`
							: ``
					}>
					${this.crew.seats[this.size] ? `${this.crew.seats[this.size].name}` : ``}
				</div>`
						: ``
				}
				</div>

		`;

		return this.mainElement;
	}
}
