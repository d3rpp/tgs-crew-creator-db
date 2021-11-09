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
	seats: (number | null)[];
	size: BoatSize;
}

export const router = Router();

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
			let coach: Coach | undefined = undefined;

			if (
				(await coachesRepo.findOne({ name: crew.coach })) == undefined
			) {
				coach = await coachesRepo.save(new Coach(crew.coach));
			} else {
				coach = await coachesRepo.findOne({ name: crew.coach });
			}

			console.log({ coach } || 'no coach found');

			let cr = new Crew(
				crew.crewName,
				crew.boatName,
				crew.oars,
				coach!,
				crew.size
			);

			try {
				await crewRepo.save(cr);

				cr.seats = cr.id;

				await crewRepo.save(cr);
			} catch (e) {
				res.status(500).json({
					message: 'error saving crew',
					error: e,
				});

				return;
			}

			let success = true;

			await Promise.all(
				seats.map((val, index) => {
					if (val != null) {
						return new Promise(async (resolve, reject) => {
							let cm = await crewMemberRepo.findOne({ id: val });
							let s;
							if (!cm) {
								s = new Seat(index + 1, -1, cr.seats!);
							} else {
								s = new Seat(index + 1, cm!.id, cr.seats!);
							}

							seatsRepo.save(s);

							resolve({});
						});
					}
				})
			).catch(() => {
				success = false;
			});

			if (!success) {
				return;
			}
			// THIS MAY OR MAY NOT BREAK
			// I AM VERY SCARED THAT THIS WON'T WORK
			res.status(200).json({ id: cr.id });
		} catch (e) {
			res.status(500).json({
				message: 'an error has occured',
				error: e,
			});
		}
	} catch (e) {
		res.status(400).json({ message: 'missing body parts', error: e });
	}
});

/**
 *
 * READ
 *
 */
router.get('/count', async (req: Request, res: Response) => {
	try {
		const repo = getRepository(Crew);

		res.status(200).json({ message: 'success', count: await repo.count() });

		return;
	} catch (e) {
		res.status(500).json({ message: 'an error has occured', error: e });
	}
});

router.get('/ids', async (req: Request, res: Response) => {
	try {
		const repo = getRepository(Crew);

		let cs = await repo.createQueryBuilder('c').select('c.id').getMany();

		res.status(200).json(cs.map((c) => c.id));
	} catch (e) {
		console.error(e);
	}
});

router.get('/:id', async (req: Request, res: Response) => {
	try {
		const repo = getRepository(Crew);
		const seatsRepo = getRepository(Seat);

		if (!(await repo.findOne({ id: req.params.id as unknown as number }))) {
			res.status(404).json({ message: 'crew not found' });
			return;
		}

		let crew = await repo.findOne(
			{ id: req.params.id as unknown as number },
			{
				relations: ['coach'],
			}
		);

		let int: CrewInterface = {
			boatName: crew!.boatName,
			coach: crew!.coach.name,
			crewName: crew!.crewName,
			oars: crew!.oars,
			size: crew!.boatSize,
			seats: (
				await seatsRepo.find({
					where: { crewId: crew!.seats },
					order: { seat: 'ASC' },
				})
			).map((s) => {
				return s.crewMember;
			}),
		};

		res.status(200).json(int);
		return;
	} catch (e) {
		res.status(500).json({ message: 'an error has occured', error: e });
	}
});

/**
 *
 * UPDATE
 * TODO: THIS
 */
router.put('/:id', async (req: Request, res: Response) => {
	const repo = getRepository(Crew);
	const coachesRepo = getRepository(Coach);
	const seatsRepo = getRepository(Seat);
	const crewMemberRepo = getRepository(CrewMember);

	if (
		!req.body.boatName ||
		!req.body.coach ||
		!req.body.crewName ||
		!req.body.oars
	) {
		console.log('MISSING PART OF BODY', req.body);
		res.status(400).json({ message: 'missing part of body' });
		return;
	}

	let crew: Crew | undefined = undefined;

	try {
		crew = await repo.findOne({
			id: req.params.id as unknown as number,
		});
	} catch (e) {
		res.status(400).json({ message: 'id was not a number', error: e });

		return;
	}

	if (!crew) {
		res.status(404).json({ message: 'not found' });
		return;
	}

	let coach: Coach | undefined = undefined;

	if ((await coachesRepo.findOne({ name: req.body.coach })) == undefined) {
		coach = await coachesRepo.save(new Coach(req.body.coach));
	} else {
		coach = await coachesRepo.findOne({ name: req.body.coach });
	}

	crew.boatName = req.body.boatName;
	crew.coach = coach!;
	crew.crewName = req.body.crewName;
	crew.oars = req.body.oars;

	try {
		let toDelete = await seatsRepo.find({ where: { crewId: crew.id } });

		toDelete.forEach(async (val) => {
			await seatsRepo.delete(val.id);
		});

		await Promise.all(
			(req.body.seats as number[]).map((val: number, index: number) => {
				return new Promise(async (resolve, reject) => {
					let cm = await crewMemberRepo.findOne({ id: val });
					let s: Seat;
					if (cm) {
						s = new Seat(index + 1, cm!.id, crew!.seats!);
						await seatsRepo.save(s);
					}
					if (!cm) {
						s = new Seat(index + 1, -1, crew!.seats!);
						await seatsRepo.save(s);
					}

					resolve({});
				});
			})
		);
	} catch (e) {
		res.status(500).json({ message: 'server side error', error: e });
		return;
	}

	repo.save(crew);

	res.status(200).json(crew);
});

/**
 *
 * DELETE
 * TODO: THIS
 */
router.delete('/:id', async (req: Request, res: Response) => {
	try {
		const repo = getRepository(Crew);
		const seatsRepo = getRepository(Seat);

		if (parseInt(req.params.id) == NaN) {
			res.json({ message: 'invalid id' }).status(400);
			throw new Error('invalid id');
		}

		let crew = await repo.findOne({ id: parseInt(req.params.id) });

		if (!crew) {
			res.json({ message: 'crew not found' }).status(404);
			throw new Error('crew not found');
		}

		(await seatsRepo.find({ where: { crewId: crew.id } })).forEach(
			async (val) => {
				await seatsRepo.delete(val.id);
			}
		);

		await repo.delete(crew.id);

		res.status(204).json({ message: 'success' });
	} catch (e) {
		console.error(e);
	}
});

// MUST BE AT BOTTOM

router.use('/*', async (req: Request, res: Response) => {
	res.json({ message: 'no endpoint' }).status(400);
});
