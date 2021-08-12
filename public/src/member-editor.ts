import { AgeGroup, CrewMember, CrewMemberInterface, Gender } from './types';

type Validation = 'name' | 'gender' | 'ageGroup' | undefined;

export interface CrewMemberAPIInterface {
	id: number;
	name: string;
	ageGroup: AgeGroup;
	gender: Gender;
	novice: boolean;
}

class MemberEditor {
	mainPoint: HTMLElement;

	table: HTMLTableElement;
	viewer: HTMLElement;
	editor: HTMLElement;

	index: number | null;

	name: HTMLInputElement;
	// _name: string;

	ageGroupSelect: HTMLSelectElement;
	// _ageGroup: AgeGroup;

	genderSelect: HTMLSelectElement;
	// buffer.gender: Gender;

	noviceSwitch: HTMLInputElement;
	// _novice: boolean;

	clearButton: HTMLButtonElement;

	submitButton: HTMLButtonElement;

	_val: Validation;

	buffer!: CrewMemberInterface;

	data!: CrewMember[];

	private testAgeGroups = ['U15', 'U16', 'U17', 'U18'];

	/**
	 * Create a randomly generated ascii string, good for getting test data
	 *
	 * @param length Length of the string wanted
	 * @returns A Random string of ascii text
	 */
	private testRandomNameGenerator(length: number) {
		return Math.random().toString(36).substr(2, length);
	}

	// public update() {
	// 	this.load();
	// 	this.insertDataIntoTable();
	// 	this.updateViewer();
	// }

	constructor(querySelector: string) {
		this.index = -1;

		this.buffer = {
			id: -1,
			name: '',
			gender: '',
			ageGroup: '',
			novice: undefined,
		};
		// main point of the element
		// prevents clashes between tabs, as long as i use this in place of `document`;
		try {
			this.mainPoint = document.querySelector(querySelector)!;
		} catch (error) {
			throw new Error('Member Editor: MainPoint not found');
		}

		// Get all of the elements
		try {
			this.table = this.mainPoint.querySelector('table')!;
			this.editor = this.mainPoint.querySelector('.editor')!;
			this.viewer = this.mainPoint.querySelector('.viewer')!;

			this.name = this.editor.querySelector('input.nameInput')!;
			this.name.addEventListener('input', () => {
				this.buffer.name = this.name.value;
				this.updateViewer();
			});

			this.ageGroupSelect =
				this.editor.querySelector('select.age-group')!;
			this.ageGroupSelect.addEventListener('input', () => {
				this.buffer.ageGroup = this.ageGroupSelect.value as AgeGroup;
				this.updateViewer();
			});

			this.genderSelect = this.editor.querySelector('select.gender')!;
			this.genderSelect.addEventListener('input', () => {
				this.buffer.gender = this.genderSelect.value as Gender;
				this.updateViewer();
			});

			this.noviceSwitch = this.editor.querySelector('.novice')!;
			this.noviceSwitch.addEventListener('change', () => {
				this.buffer.novice = this.noviceSwitch.checked;
				this.updateViewer();
			});

			this.clearButton = this.editor.querySelector(
				'.buttons button.clear'
			)!;
			this.clearButton.addEventListener('mouseup', () => {
				// this.buffer = {};
				this.resetBuffer();
				this.updateInputForm();
				this.updateViewer();
			});

			this.submitButton = this.editor.querySelector(
				'.buttons button.submit'
			)!;
			this.submitButton.addEventListener('mouseup', () => {
				if (!this.confirmAndSubmitDataFromForm()) {
					alert('There was an error: ' + this._val);
				}
				// this.buffer = {};
				// this.resetBuffer();
				// this.updateViewer();
			});
		} catch (error) {
			throw new Error('Member Editor: Element(s) missing');
		}

		try {
			fetch('/api/members').then((val) => {
				val.json()
					.then((v2) => {
						this.data = v2;

						this.sort(this.data);

						this.insertDataIntoTable();

						this.updateViewer();

						console.info('Member Editor: Initialised Successfully');
					})
					.catch((_) => {
						this.data = [];
						console.info('Member Editor: Initialised Successfully');
					});
			});
		} catch (error) {
			console.error(error);
			throw new Error(
				'Member Editor: Failed when loading stuff or getting test data'
			);
		}

		// this.initTestData();

		// } catch (e) {
		// 	throw new Error("Member Editor: " + e);
		// }
	}

	/**
	 * Dump the buffere element to the console
	 */
	private dumpBuffer() {
		console.warn('CURRENT BUFFER IN MEMBER EDITOR', this.buffer);
	}

	/**
	 * Checks if the ID is in use
	 *
	 * @param id The ID to be checked
	 * @returns true if the id is in use
	 */
	private idIsUsedforCrewMember(id: number): boolean {
		let tmp: boolean = false;

		for (let i: number = 0; i < this.data.length; i++) {
			if (this.data[i].id == id) {
				tmp = true;
			}
		}

		return tmp;
	}

	/**
	 * Give the editor buttons their functionality, uses events in order to wait for clicking
	 */
	private setupButtons() {
		this.mainPoint.querySelectorAll('.actions').forEach((val: Element) => {
			val.querySelectorAll('button').forEach(
				(button: HTMLButtonElement) => {
					if (button.classList.contains('edit')) {
						button.addEventListener('click', () => {
							this.dumpBuffer();

							this.buffer.id = +button.getAttribute('data-id')!;
							this.pushInputToBuffer();

							this.loadDataIntoInputForm(
								// Welcome to casting strings to numbers in typescript
								+button.getAttribute('data-index')!
							);

							this.dumpBuffer();
						});
					} else if (button.classList.contains('delete')) {
						// this.buffer = {};
						this.resetBuffer();
						this.updateInputForm();

						button.addEventListener('click', () => {
							let tmp: CrewMember =
								this.data[+button.getAttribute('data-index')!];

							console.log('DELETE: ', tmp);

							if (
								confirm(
									"are you sure you'd like to delete " +
										tmp.name
								)
							) {
								let xhr = new XMLHttpRequest();

								xhr.onreadystatechange = () => {
									if (
										xhr.readyState == 4 &&
										xhr.status == 200
									) {
										this.load();
									}
								};

								xhr.open('DELETE', `/api/members/${tmp.id}`);
								xhr.send();
							}
						});
					}
				}
			);
		});
	}

	/**
	 * Verifies and Validates the buffer, which is synced with the inputs, so this serves as a form of input validation
	 * @returns true if the contents of the buffer and be considered a valid CrewMember Object
	 */
	private validateBuffer(): boolean {
		if (
			this.buffer.name == '' ||
			this.buffer.name == undefined ||
			this.buffer.name == null
		) {
			this._val = 'name';
			this.dumpBuffer();
			return false;
		}
		if (!(this.buffer.ageGroup as AgeGroup)) {
			this._val = 'ageGroup';
			this.dumpBuffer();
			return false;
		}
		if (!(this.buffer.gender == 'M' || this.buffer.gender == 'F')) {
			this._val = 'gender';
			this.dumpBuffer();
			return false;
		}

		return true;
	}

	/**
	 * Updates the viewer element with the latest data from the buffer
	 */
	private updateViewer() {
		// this.dumpBuffer();
		this.viewer.innerHTML =
			(!!this.buffer.gender ? this.buffer.gender : 'Gender') +
			' | ' +
			(!!this.buffer.ageGroup ? this.buffer.ageGroup : 'Age Group') +
			' ' +
			(this.buffer.novice ? 'Novice' : '') +
			' | ' +
			(!!this.buffer.name ? this.buffer.name : 'Name');
	}

	/**
	 * loads the data of a crew member from the data array into the buffer
	 *
	 * @param index index of a CrewMember object in the data array
	 */
	private loadDataIntoInputForm(index: number) {
		this.buffer.id = this.data[index].id;
		this.name.value = this.data[index].name;
		this.noviceSwitch.checked = this.data[index].novice;
		this.ageGroupSelect.value = this.data[index].ageGroup;
		this.genderSelect.value = this.data[index].gender;
		// this.

		this.pushInputToBuffer();
		this.submitButton.innerHTML = `Update`;
	}

	/**
	 * Sets the buffer to its default 0 value
	 */
	private resetBuffer() {
		this.buffer.name = '';
		this.buffer.ageGroup = '';
		this.buffer.gender = '';
		this.buffer.id = -1;
		this.buffer.novice = false;

		this.updateInputForm();
		this.updateViewer();
	}

	/**
	 * Pushes the buffer to the UI Form
	 */
	private updateInputForm() {
		// this.dumpBuffer();

		this.name.value = !!this.buffer.name ? this.buffer.name : '';
		this.ageGroupSelect.value = !!this.buffer.ageGroup
			? this.buffer.ageGroup
			: '';
		this.genderSelect.value = !!this.buffer.gender
			? this.buffer.gender
			: '';
		this.noviceSwitch.checked = this.buffer.novice
			? this.buffer.novice
			: false;
	}

	/**
	 * Creates test data, uses the random name generator from above
	 */
	private initTestData() {
		this.data = [];

		const amountOfData = 100;

		for (var i: number = 0; i < amountOfData; i++) {
			this.addCrewMember({
				name: this.testRandomNameGenerator(
					Math.floor(Math.random() * 7) + 5
				),
				gender: (!!Math.round(Math.random()) ? 'M' : 'F') as Gender,
				ageGroup: this.testAgeGroups[
					Math.floor(Math.random() * 4)
				] as AgeGroup,
				novice: !!Math.round(Math.random()),
			});
		}

		// console.info(this.data);
	}

	private pushInputToBuffer() {
		this.buffer.name = this.name.value;
		this.buffer.ageGroup = this.ageGroupSelect.value as AgeGroup;
		this.buffer.gender = this.genderSelect.value as Gender;
		this.buffer.novice = this.noviceSwitch.checked;
	}

	/**
	 * Returns the index in this.data of an element with the specified id
	 *
	 * @param id The id of the element you'd like to find the index of
	 * @returns the index in this.data of the element with the id or `undefined` if not found
	 */
	private getIndexOfID(id: number): number | null {
		let i: number = -1;

		if (id < 0) return null;

		this.data.some((val: CrewMember, index: number) => {
			if (val.id == id) {
				i = index;
				return true;
			}

			return false;
		});

		return i;
	}

	// createUID(): number {
	// 	let ids: number[] = [];
	// 	let valid: boolean = false;
	// 	let i = 0;

	// 	this.data.forEach((val: CrewMember) => {
	// 		ids.push(val.id);
	// 	});

	// 	while (!valid) {
	// 		i++;

	// 		if (!ids.includes(i)) valid = true;
	// 	}

	// 	return i;
	// }

	/**
	 * Validates the data in the buffer and adds it to the data array, immediately saving the data array to window.localStorage
	 * the updates the UI with the latest changes
	 *
	 * @returns true if the submition of the data was successful, otherwise the problem will be pushed to this._val
	 */
	private confirmAndSubmitDataFromForm(): boolean {
		if (!this.validateBuffer()) {
			console.error('Error In ', this._val);
			this.dumpBuffer();
			return false;
		}
		if (this.buffer.id! == -1) {
			if (
				!confirm(
					`Are you sure that you'd like to add ${
						this.buffer.gender
					} ${this.buffer.ageGroup}${
						this.buffer.novice ? ' Novice' : ''
					} named ${this.buffer.name}`
				)
			)
				return false;

			// this.buffer.id = this.createUID();

			this.buffer.novice = this.noviceSwitch.checked;

			// this.buffer.id = -1;
			this.addCrewMember(this.buffer);

			// let xhr = new XMLHttpRequest()
		} else {
			if (
				!confirm(
					`Are you sure that you'd like to update ${
						this.buffer.gender
					} ${this.buffer.ageGroup}${
						this.buffer.novice ? ' Novice' : ''
					} named ${this.buffer.name}`
				)
			) {
				return false;
			} else {
				this.updateCrewMember(this.buffer);
			}
		}

		this.submitButton.innerHTML = `Save`;

		this.insertDataIntoTable();
		return true;
	}

	/**
	 *
	 * Pushes the supplied crew member to the data array object and saves it
	 *
	 * @param member the member to be added
	 */
	private addCrewMember(member: CrewMemberInterface) {
		let xhr = new XMLHttpRequest();

		xhr.onreadystatechange = (ev: Event) => {
			if (xhr.readyState == 4 && xhr.status == 200) {
				console.log('SAVED CREW MEMBER');
				this.load();
			}
		};

		xhr.open('POST', '/api/members');

		xhr.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');

		xhr.send(
			JSON.stringify({
				ageGroup: member.ageGroup!,
				gender: member.gender!,
				name: member.name!,
				novice: member.novice!,
			} as CrewMemberAPIInterface)
		);

		// this.save();
	}

	private updateCrewMember(member: CrewMemberInterface) {
		let xhr = new XMLHttpRequest();

		xhr.onreadystatechange = (ev: Event) => {
			if (xhr.readyState == 4 && xhr.status == 200) {
				console.log('SAVED CREW MEMBER');
				this.load();
			}
		};

		xhr.open('PUT', `/api/members/${member.id!}`);
		xhr.send(
			JSON.stringify({
				ageGroup: member.ageGroup!,
				gender: member.gender!,
				name: member.name!,
				novice: member.novice!,
			} as CrewMemberAPIInterface)
		);
	}

	private sort(list: CrewMember[]) {
		if (!list) return;
		if (list.length == 0 || list.length == 1) return;

		let ageGroups = ['U15', 'U16', 'U17', 'U18'];

		list.sort((a: CrewMember, b: CrewMember) => {
			if (a.gender == 'M' && b.gender == 'F') return -1;
			if (a.gender == 'F' && b.gender == 'M') return 1;
			if (a.gender == b.gender) return 0;
		});

		list.sort((a: CrewMember, b: CrewMember) => {
			if (a.novice && !b.novice) return 1;
			if (!a.novice && b.novice) return -1;
			return 0;
		});

		list.sort((a: CrewMember, b: CrewMember) => {
			return (
				ageGroups.indexOf(b.ageGroup) - ageGroups.indexOf(a.ageGroup)
			);
		});

		return list;
	}

	/**
	 * Loads the data from window.localStorage into the data array
	 *
	 * if there is no data to load, it initialises the data array to an empty array
	 * also inserts data into table
	 */
	load() {
		return async function () {
			return fetch('/api/members/').then(async (val) => {
				const val2 = await val.json();
				// return val2;
				this.data = val2;
				this.insertDataIntoTable();
			});
		};
	}

	/**
	 * Updates the table with the up to date information by deleting all of the rows and adding the new ones in,
	 * it isnt the most efficient way to do it but it works
	 */
	insertDataIntoTable() {
		this.clearTable();

		if (this.data == [] || this.data == undefined) return;

		this.data.forEach((val: CrewMember, i: number) => {
			let row = this.table.insertRow();

			row.innerHTML = `
				<td>${val.gender}</td>
				<td>${val.ageGroup} ${val.novice ? 'Novice' : ''}</td>
				<td class="big">${val.name}</td>
				<td class="actions">
					<button class="edit material-icons" data-index="${i}" data-id="${
				val.id
			}">edit</button>
					<button class="delete material-icons" data-index="${i}" data-id="${
				val.id
			}">delete</button>
				</td>
			
			`;
		});

		// calls setup buttons afterwards to make the edit and delete buttons work
		this.setupButtons();
	}

	clearTable() {
		this.table.innerHTML = `
			<tr class="header">
				<th>Gender</th>
				<th>Age Group</th>
				<th class="big">Name</th>
				<th>Actions</th>
			</tr>
		`;
	}
}

export { MemberEditor };
