import { cwd } from 'process';
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToOne,
	JoinTable,
	OneToMany,
} from 'typeorm';
import Coach from './Coach';
import Seat from './Seat';

@Entity({ name: 'crews' })
export default class Crew {
	constructor(
		name: string,
		boat: string,
		oars: string,
		coach: Coach,
		seats: Seat[],
		size: 1 | 2 | 4 | 5 | 9
	) {
		this.crewName = name;
		this.boatName = boat;
		this.oars = oars;
		this.coach = coach;
		this.seats = seats;
		this.size = size;
	}

	@PrimaryGeneratedColumn()
	// @ts-ignore
	id: number;

	@Column()
	crewName: string;

	@Column()
	boatName: string;

	@Column()
	oars: string;

	@OneToOne((_) => Coach, (c) => c.id, { cascade: true, primary: true })
	@JoinTable()
	coach: Coach;

	@OneToMany((_) => Seat, (s) => s.crewMember, {
		cascade: true,
		primary: false,
	})
	@JoinTable()
	seats: Seat[];

	@Column()
	size: 1 | 2 | 4 | 5 | 9;
}
