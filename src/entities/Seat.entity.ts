import {
	Column,
	Entity,
	JoinTable,
	ManyToOne,
	OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
import CrewMember from './CrewMember.entity';

@Entity({ name: 'seats' })
export default class Seat {
	constructor(pos: number, mem: number, crew: number) {
		// const memberRepo = getRepository(CrewMember);
		this.seat = pos;
		this.crewMember = mem;
		this.crewId = crew;
	}

	@PrimaryGeneratedColumn()
	// @ts-ignore
	id: number;

	@Column()
	crewId: number;

	@Column()
	crewMember: number;

	@Column()
	seat: number;
}
