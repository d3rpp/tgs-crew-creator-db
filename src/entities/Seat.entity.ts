import { Entity, JoinTable, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
// import Crew from './Crew';
import CrewMember from './CrewMember.entity';
// import Crew from './Crew';

@Entity({ name: 'seats' })
export default class Seat {
	constructor() {}

	@PrimaryGeneratedColumn()
	// @ts-ignore
	id: number;

	@OneToOne((_) => CrewMember, (c) => c.id)
	@JoinTable()
	// @ts-ignore
	crewMember: CrewMember;

	
}
