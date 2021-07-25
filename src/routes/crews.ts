import { Router, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Coach from '../entities/Coach.entity';
import { BoatSize } from '../entities/common';
import Crew from '../entities/Crew.entity';
import CrewMember from '../entities/CrewMember.entity';
import Seat from '../entities/Seat.entity';

interface CrewInterface {
	crewName: string;
	boatName: string;
	oars: string;
	coach: string;
	seats: number[];
	size: BoatSize;
}

export const router = Router();

// CREATE CREW WITH EXISTING SEATS FROM POST REQUEST
/**
 *
 * CREATE
 *
 */
router.post('/', async (req: Request, res: Response) => {
	const crewRepo = getRepository(Crew);
	const crewMemberRepo = getRepository(CrewMember);
	const seatsRepo = getRepository(Seat);
	const coachesRepo = getRepository(Coach);

	try {
		const crew = req.body as CrewInterface;
		const { seats } = crew;

		try {
			let c = new Crew(
				crew.crewName,
				crew.boatName,
				crew.oars,
				(await coachesRepo.findOne({ name: crew.coach }))!,
				crew.size
			);

			await Promise.all(
				seats.map(async (val, index) => {
					return new Promise(async (resolve, reject) => {
						let cm = await crewMemberRepo.findOne({ id: val });

						if (!cm) {
							reject(`MISSING CREW MEMBER WITH ID ${val}`);
						}
						let s = new Seat(index + 1, cm!, c.id);

						await seatsRepo.save(s);

						resolve({});
					});
				})
			).catch((e) => {});

			// THIS MAY OR MAY NOT BREAK
			// I AM VERY SCARED THAT THIS WON'T WORK
			crewRepo.save(c);
		} catch (e) {
			res.json({ message: 'an error has occured' }).status(500).send();
		}
	} catch (e) {
		res.json({ message: 'missing body parts' }).status(400).send();
	}
});

/**
 *
 * READ
 *
 */
router.get('/', async (req: Request, res: Response) => {
	const repo = getRepository(Crew);
	const seats = getRepository(Seat);

	let crews = await Promise.all(
		(
			await repo.find()
		).map(async (val) => {
			return {
				...val,
				seats: (await seats.find({ where: { crewId: val.id } })).map(
					(se) => {
						return se.crewMember.id;
					}
				),
			};
		})
	);

	return crews;
});

router.get('/:id', async (req: Request, res: Response) => {});

/**
 *
 * UPDATE
 *
 */
router.put('/:id', async (req: Request, res: Response) => {});

/**
 *
 * DELETE
 *
 */
router.delete('/:id', async (req: Request, res: Response) => {});

// MUST BE AT BOTTOM

router.use('/*', async (req: Request, res: Response) => {
	res.json({ message: 'no endpoint' }).status(400);
});
