import { cwd } from 'process';
import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToOne,
	JoinTable,
	OneToMany,
} from 'typeorm';
import Coach from './Coach.entity';
import { BoatSize } from './common';
import Seat from './Seat.entity';

@Entity({ name: 'crews' })
export default class Crew {
	constructor(
		name: string,
		boat: string,
		oars: string,
		coach: Coach,
		// seats: Seat[],
		size: BoatSize
	) {
		this.crewName = name;
		this.boatName = boat;
		this.oars = oars;
		this.coach = coach;
		// this.seats = seats;
		this.size = size;
	}

	@PrimaryGeneratedColumn()
	// @ts-ignore
	id: number;

	@Column({ length: 30 })
	crewName: string;

	@Column({ length: 30 })
	boatName: string;

	@Column({ length: 30 })
	oars: string;

	@OneToOne((_) => Coach, (c) => c.id, { cascade: true, primary: true })
	@JoinTable()
	coach: Coach;

	// @OneToMany((_) => Seat, (s) => s.crewMember, {
	// 	cascade: true,
	// 	primary: false,
	// })
	// @JoinTable()
	// seats: Seat[];

	@Column({ length: 1 })
	size: BoatSize;
}
