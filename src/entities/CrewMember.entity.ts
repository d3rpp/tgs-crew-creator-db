import { Column, Entity, OneToOne, PrimaryGeneratedColumn } from 'typeorm';
import { AgeGroup, Gender } from './common';
import Seat from './Seat.entity';

@Entity({ name: 'crew_members' })
export default class CrewMember {
	constructor(
		name: string,
		ageGroup: AgeGroup,
		gender: Gender,
		novice: boolean
	) {
		this.name = name;
		this.ageGroup = ageGroup;
		this.gender = gender;
		this.novice = novice;
	}

	@PrimaryGeneratedColumn()
	// @ts-ignore
	id: number;

	@Column({ length: 30 })
	name: string;

	@Column({ type: 'varchar', length: 3 })
	ageGroup: AgeGroup;

	@Column({ type: 'varchar', length: 1 })
	gender: Gender;

	@Column()
	novice: boolean;
}
