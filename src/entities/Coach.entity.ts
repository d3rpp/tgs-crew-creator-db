import { Entity, PrimaryGeneratedColumn, Column, OneToOne } from 'typeorm';
import Crew from './Crew.entity';

@Entity({ name: 'coaches' })
export default class Coach {
	constructor(name: string) {
		this.name = name;
	}

	@PrimaryGeneratedColumn()
	@OneToOne((_) => Crew, (c) => c.coach)
	// @ts-ignore
	id: number;

	@Column({ unique: true, length: 30 })
	name: string;
}
