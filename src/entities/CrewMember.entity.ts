import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AgeGroup, Gender } from './common';

@Entity({ name: 'crew_members' })
export default class CrewMember {
	constructor(name: string, ageGroup: AgeGroup, gender: Gender) {
		this.name = name;
		this.ageGroup = ageGroup;
		this.gender = gender;
	}

	@PrimaryGeneratedColumn()
	// @ts-ignore
	id: number;

	@Column({ length: 30 })
	name: string;

	@Column()
	ageGroup: AgeGroup;

	@Column()
	gender: Gender;
}
