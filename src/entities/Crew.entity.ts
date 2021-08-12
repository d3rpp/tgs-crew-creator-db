import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	JoinTable,
	OneToMany,
	ManyToOne,
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
		size: BoatSize
	) {
		this.crewName = name;
		this.boatName = boat;
		this.oars = oars;
		this.coach = coach;
		this.boatSize = size;
	}

	@PrimaryGeneratedColumn()
	id!: number;

	@Column({ length: 30, nullable: true })
	crewName: string;

	@Column({ length: 30, nullable: true })
	boatName: string;

	@Column({ length: 30, nullable: true })
	oars: string;

	@ManyToOne((_) => Coach, (c) => c.id, {
		cascade: false,
		nullable: true,
	})
	@JoinTable()
	coach: Coach;

	@Column({ length: 1, nullable: true })
	boatSize: BoatSize;

	@Column({ nullable: true })
	seats?: number;
}
