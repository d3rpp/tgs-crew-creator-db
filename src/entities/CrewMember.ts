import { Column, Entity, PrimaryGeneratedColumn } from 'typeorm';
import { AgeGroup, Gender } from './common';

@Entity({ name: 'crew_memebers' })
export default class CrewMember {
	constructor(name: string, ageGroup: AgeGroup, gender: Gender) {
		this.name = name;
		this.ageGroup = ageGroup;
		this.gender = gender;
	}

	@PrimaryGeneratedColumn()
	// @ts-ignore
	id: number;

	@Column()
	name: string;

	@Column({ name: 'age_group' })
	ageGroup: AgeGroup;

	@Column()
	gender: Gender;
}
