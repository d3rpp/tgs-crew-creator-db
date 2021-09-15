export type AgeGroup = 'U15' | 'U16' | 'U17' | 'U18';
export type Gender = 'M' | 'F';
export type BoatSize = '1' | '2' | '4' | '5' | '9';

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
	seats?: CrewMemberInterface[];
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
// #endregion

// #region Crew Member Class
export class CrewMember {
	public id: number;
	public name?: string;
	public ageGroup?: AgeGroup;
	public gender?: Gender;
	public is_novice?: boolean;
	public is_loading: boolean;

	public constructor(id: number);
	public constructor(params: CrewMemberInterface);

	public constructor(...args: any[]) {
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

export class Crew {}

// #endregion
