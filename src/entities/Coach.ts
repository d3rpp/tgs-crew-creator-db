import {
	Entity,
	PrimaryGeneratedColumn,
	Column,
	OneToOne,
	Unique,
} from 'typeorm';
import Crew from './Crew';

@Entity({ name: 'coaches' })
export default class Coach {
	constructor(name: string) {
		this.name = name;
	}

	@PrimaryGeneratedColumn()
	@OneToOne((_) => Crew, (c) => c.coach)
	// @ts-ignore
	id: number;

	@Column({ unique: true })
	name: string;
}
