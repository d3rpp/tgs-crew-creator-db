import { Entity, PrimaryGeneratedColumn, Column, OneToMany } from 'typeorm';
import Crew from './Crew.entity';

@Entity({ name: 'coaches' })
export default class Coach {
	constructor(name: string) {
		this.name = name;
	}

	@PrimaryGeneratedColumn()
	@OneToMany((_) => Crew, (c) => c.coach, { cascade: false })
	id!: number;

	@Column({ unique: true, length: 30 })
	name: string;
}
