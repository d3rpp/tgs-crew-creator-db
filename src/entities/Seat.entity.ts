import {
	Column,
	Entity,
	getRepository,
	JoinTable,
	OneToOne,
	PrimaryGeneratedColumn,
} from 'typeorm';
// import Crew from './Crew';
import CrewMember from './CrewMember.entity';
// import Crew from './Crew';

@Entity({ name: 'seats' })
export default class Seat {
	constructor(pos: number, mem: CrewMember, crew: number) {
		const memberRepo = getRepository(CrewMember);

		this.seat = pos;
		this.crewId = crew;
		this.crewMember = mem;
	}

	@PrimaryGeneratedColumn()
	// @ts-ignore
	id: number;

	@Column()
	crewId: number;

	@OneToOne((_) => CrewMember, (c) => c.id)
	@JoinTable()
	// @ts-ignore
	crewMember: CrewMember;

	@Column()
	seat: number;
}
