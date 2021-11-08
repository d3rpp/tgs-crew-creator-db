import { writable, Writable } from 'svelte/store';
import { get } from 'svelte/store';
import members from '../stores/members';
import type { Options as SortableOptions } from 'sortablejs';

export type AgeGroup = 'U15' | 'U16' | 'U17' | 'U18';
export type Gender = 'M' | 'F';
export type BoatSize = '1' | '2' | '4' | '5' | '9';

export const SORTABLE_CONFIG: SortableOptions = {
	group: 'member',
	delay: 100,
	delayOnTouchOnly: true,
	animation: 100,
	easing: 'cubic-bezier(0.33, 1, 0.68, 1)',
	dataIdAttr: 'data-id',
	filter: '.empty',
	forceFallback: true,
	swapThreshold: 1,
	setData: (dataTransfer: DataTransfer, draggedElement: HTMLElement) => {
		if (draggedElement.getAttribute('data-id') == null) return;

		dataTransfer.setData('id', draggedElement.getAttribute('data-id'));
	},
};

// #region EXPORTED INTERFACES
export interface CrewMemberInterface {
	id?: number;
	name?: string;
	ageGroup?: AgeGroup;
	gender?: Gender;
	novice?: boolean;
}

export interface CrewInterface {
	id?: number;
	crewName?: string;
	boatName?: string;
	oars?: string;
	coach?: { id: number; name: string };
	boatSize?: BoatSize;
	seats?: (CrewMemberInterface | null)[];
}
// #endregion

// #region API INTERFACES
export interface CrewMemberAPIInterface {
	id: number;
	name: string;
	ageGroup: AgeGroup;
	gender: Gender;
	novice: boolean;
}

export interface CrewAPIInterface {
	crewName: string;
	boatName: string;
	oars: string;
	coach: string;
	seats: number[];
	size: BoatSize;
}
// #endregion

// #region Crew Member Class
export class CrewMember {
	public id: number;
	public name?: string;
	public ageGroup?: AgeGroup;
	public gender?: Gender;
	public is_novice?: boolean;
	public is_loading: boolean;
	public is_in_crew: boolean;

	public constructor(id: number);
	public constructor(params: CrewMemberInterface);

	public constructor(...args: any[]) {
		this.is_in_crew = false;
		if (typeof args[0] == 'number') {
			this.id = args[0];

			this.is_loading = true;
			fetch(`/api/members/${this.id}`).then((response) => {
				response.json().then((value: CrewMemberAPIInterface) => {
					console.log({ value });

					this.name = value.name;
					this.ageGroup = value.ageGroup;
					this.gender = value.gender;
					this.is_novice = value.novice;

					this.is_loading = false;
					return;
				});
			});
		} else if (typeof args[0] == 'object') {
			this.id = args[0].id || 0;
			this.name = args[0].name;
			this.ageGroup = args[0].ageGroup;
			this.gender = args[0].gender;
			this.is_novice = args[0].novice;
			this.is_loading = false;
		} else {
			console.log('INVALID CONSTRUCTION USING ARGS', args);
		}
	}

	public create() {
		return new Promise<void>((resolve, reject) => {
			this.is_loading = true;

			let xhr = new XMLHttpRequest();

			xhr.onreadystatechange = (_ev: Event) => {
				if (xhr.readyState == 4 && xhr.status.toString()[0] == '2') {
					this.id = JSON.parse(xhr.response).id;

					console.info(
						`Successfully created ${this.name} with ID of ${this.id}`
					);

					this.is_loading = false;

					resolve();
				} else if (['4', '5'].includes(xhr.status.toString()[0])) {
					reject();
				}
			};

			xhr.open('POST', '/api/members');
			xhr.setRequestHeader('Content-Type', 'application/json');
			xhr.send(
				JSON.stringify({
					name: this.name || '',
					ageGroup: this.ageGroup || 'U18',
					gender: this.gender || 'M',
					novice: this.is_novice || false,
				} as CrewMemberAPIInterface)
			);
		});
	}

	public update() {
		return new Promise<void>((resolve, reject) => {
			this.is_loading = true;

			let xhr = new XMLHttpRequest();

			xhr.onreadystatechange = (_ev: Event) => {
				if (xhr.readyState == 4 && xhr.status.toString()[0] == '2') {
					console.info(
						`Successfully updated ${this.name} with ID of ${this.id}`
					);
					this.is_loading = false;

					resolve();
				} else if (['4', '5'].includes(xhr.status.toString()[0])) {
					reject();
				}
			};

			xhr.open('PUT', `/api/members/${this.id}`);
			xhr.setRequestHeader('Content-Type', 'application/json');
			xhr.send(
				JSON.stringify({
					name: this.name || '',
					ageGroup: this.ageGroup || 'U18',
					gender: this.gender || 'M',
					novice: this.is_novice || false,
				} as CrewMemberAPIInterface)
			);
		});
	}

	public delete() {
		return new Promise<void>((resolve, reject) => {
			if (this.id < 0) reject();

			let xhr = new XMLHttpRequest();

			xhr.onreadystatechange = (_ev: Event) => {
				if (xhr.readyState == 4 && xhr.status.toString()[0] == '2') {
					console.info(
						`Successfully Deleted ${this.name || ''} with ID: ${
							this.id
						}`
					);

					resolve();
				} else if (['4', '5'].includes(xhr.status.toString()[0])) {
					reject();
				}
			};

			xhr.open('DELETE', `/api/members/${this.id}`);
			xhr.send();
		});
	}
}
// #endregion

// #region Crew Class

export class Crew {
	id?: number;
	crewName: string;
	boatName: string;
	oars: string;
	coach: string;
	boatSize?: BoatSize;
	seats: (Writable<CrewMember> | Writable<null>)[];

	has_changed = false;

	is_valid: boolean;

	is_loading: boolean;

	public constructor({ size: number });
	public constructor({ id: number });

	public constructor(args: any) {
		if (args.id) {
			this.id = args.id;
			this.crewName = '';
			this.boatName = '';
			this.oars = '';
			this.coach = '';

			// Fetch the crew from /api/crews/:id
			this.is_loading = true;
			fetch(`/api/crews/${this.id}`).then((response) => {
				response.json().then((value: CrewAPIInterface) => {
					console.log({ value });

					this.crewName = value.crewName;
					this.boatName = value.boatName;
					this.oars = value.oars;
					this.coach = value.coach;
					this.boatSize = value.size;

					// gets the members store and finds the crew members with the ids given from the API, it the stores them in the crew, if the member doesnt exist, it stores null in its place
					this.seats = value.seats.map((id) => {
						if (id == null) return writable(null);
						get(members).forEach((member) => {
							if (get(member).id == id) {
								return member;
							}
						});

						this.is_loading = false;
						return;
					});
				});
			});
		} else {
			// Otherwise intialise the crew with default values
			this.id = -1;
			this.crewName = '';
			this.boatName = '';
			this.oars = '';
			this.coach = '';
			this.boatSize = args.size as BoatSize;

			// fill the seats array with nulls for all the seats
			this.seats = Array.apply('none', Array(+this.boatSize));

			console.log(this);
		}

		setInterval(() => {
			this.save();
		}, 1000);
	}

	// a function that converts this crew into a CrewApiInterface to be sent to the server
	public toAPI(): CrewAPIInterface {
		return {
			crewName: this.crewName || '',
			boatName: this.boatName || '',
			oars: this.oars || '',
			coach: this.coach || '',
			size: this.boatSize,
			seats: this.seats.map((member) => {
				if (get(member) == null) return -1;

				return get(member).id;
			}),
		};
	}
	// a function that saves the crew to the server
	private save() {
		if (this.is_loading || !this.is_valid) return;

		if (this.has_changed && !this.is_loading) {
			// create an XHR to send a PUT request to /api/crews/:id
			this.is_loading = true;

			let xhr = new XMLHttpRequest();

			xhr.onreadystatechange = (_ev: Event) => {
				if (xhr.readyState == 4 && xhr.status.toString()[0] == '2') {
					if (this.id == -1) {
						this.id = JSON.parse(xhr.responseText).id;
					}
					console.log(JSON.parse(xhr.responseText));
					console.info(`Successfully saved ${this.crewName}`);
				} else if (['4', '5'].includes(xhr.status.toString()[0])) {
					console.error(`Failed to save ${this.crewName}`);
					console.error(JSON.parse(xhr.responseText));
				}

				this.is_loading = false;
				this.has_changed = false;
			};

			if (this.id != -1) {
				xhr.open('PUT', `/api/crews/${this.id}`);
			} else {
				xhr.open('POST', '/api/crews');
			}
			xhr.setRequestHeader('Content-Type', 'application/json');
			xhr.send(JSON.stringify(this.toAPI()));
		}
	}
}

// #endregion
