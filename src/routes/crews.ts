// Import the required functions to run the server middleware
import { Router, Request, Response } from 'express';

// Import the access database function
import { getRepository } from 'typeorm';

// Import entities/types
import Coach from '../entities/Coach.entity';
import { BoatSize } from '../entities/common';
import Crew from '../entities/Crew.entity';
import CrewMember from '../entities/CrewMember.entity';
import Seat from '../entities/Seat.entity';

// create a crew interface (a simplified form of the Crew Entity)
interface CrewInterface {
	crewName: string;
	boatName: string;
	oars: string;
	coach: string;
	seats: (number | null)[];
	size: BoatSize;
}

// Create new Router (acting as middleware)
export const router = Router();

/**
 *
 * CREATE
 *
 */
router.post('/', async (req: Request, res: Response) => {
	// get access to the crew table
	const crewRepo = getRepository(Crew);

	// get access to the crew members table
	const crewMemberRepo = getRepository(CrewMember);

	// get access to the seats table
	const seatsRepo = getRepository(Seat);

	// get access to the coach table
	const coachesRepo = getRepository(Coach);

	try {
		// attempt to pull the crew from the request body
		const crew = req.body as CrewInterface;

		// destruct the crew into its seats
		const { seats } = crew;

		try {
			
			let coach: Coach | undefined = undefined;

			// if a coach with the same name exists, use it instead, otherwise create a new coach
			if (
				(await coachesRepo.findOne({ name: crew.coach })) == undefined
			) {
				coach = await coachesRepo.save(new Coach(crew.coach));
			} else {
				coach = await coachesRepo.findOne({ name: crew.coach });
			}

			// if this failed coach will be undefined, if this prints out 'no coach found' then there is something very very wrong with this program
			console.log({ coach } || 'no coach found');

			// create new crew
			let cr = new Crew(
				crew.crewName,
				crew.boatName,
				crew.oars,
				coach!, // yes typescript, the coach DOES exist
				crew.size
			);

			try {
				// save the crew
				await crewRepo.save(cr);

				// update the seat ids
				cr.seats = cr.id;

				// save it again
				await crewRepo.save(cr);
			} catch (e) {
				// unable to save
				res.status(500).json({
					message: 'error saving crew',
					error: e,
				});

				return;
			}

			// assume everything is going to plan
			let success = true;

			/**
			 * await all of the promises used to create the seats in parallel
			 * based on the seat list it will calculate how to construct the seat
			 * it will then create and save the seat, ready to be read out in
			 * only one sql statement
			 */
			await Promise.all(
				seats.map((val, index) => {
					if (val != null) {
						// never rejects manually since all errors will cause it to reject automatically
						return new Promise(async (resolve, reject) => {
							// get the crew member of a given id
							let cm = await crewMemberRepo.findOne({ id: val });
							let s;

							// if the crew member exists, assign it to this seat, otherwise set the id of the seat to -1, the equivalent of null
							// except JSON doesn't encode null.
							if (!cm) {
								s = new Seat(index + 1, -1, cr.seats!);
							} else {
								s = new Seat(index + 1, cm!.id, cr.seats!);
							}

							// save seat
							seatsRepo.save(s);

							// gtfo
							resolve({});
						});
					}
				})
			).catch(() => {
				// something did not go to plan
				success = false;
			});

			if (!success) {
				return;
			}
			// THIS MAY OR MAY NOT BREAK
			// I AM VERY SCARED THAT THIS WON'T WORK
			res.status(200).json({ id: cr.id });
		} catch (e) {
			// something went wrong and we couldnt catch it
			res.status(500).json({
				message: 'an error has occured',
				error: e,
			});
		}
	} catch (e) {
		// the front end broke
		res.status(400).json({ message: 'missing body parts', error: e });
	}
});

/**
 *
 * READ
 *
 */
// this isn't used in the front end abd is useless code, but i dont want to break the codebase so i wont touch it
router.get('/count', async (req: Request, res: Response) => {
	try {
		const repo = getRepository(Crew);

		res.status(200).json({ message: 'success', count: await repo.count() });

		return;
	} catch (e) {
		res.status(500).json({ message: 'an error has occured', error: e });
	}
});

// get a list of all valid IDs of crews, we cant just go up because MySQL refuses to recycle IDs when auto-generated
// so we do this instead
router.get('/ids', async (req: Request, res: Response) => {
	try {
		// get the crews table
		const repo = getRepository(Crew);

		// get all of the crews
		let cs = await repo.createQueryBuilder('c').select('c.id').getMany();

		// map the crews from the whole ass thing to just their IDs
		// there is probably a way to do this that doesnt involve fetching potentially 10s of crews
		// but i don't really care
		res.status(200).json(cs.map((c) => c.id));
	} catch (e) {
		console.error(e);
	}
});

// get crew of specified id
router.get('/:id', async (req: Request, res: Response) => {
	try {
		// get crews and seats tables respectively
		const repo = getRepository(Crew);
		const seatsRepo = getRepository(Seat);

		// check if the crew exists
		if (!(await repo.findOne({ id: req.params.id as unknown as number }))) {
			res.status(404).json({ message: 'crew not found' });
			return;
		}

		// get the crew
		let crew = await repo.findOne(
			{ id: req.params.id as unknown as number }, // as unknown as number is dumb but tsc is also dumb
			{
				relations: ['coach'], // the standard required join (left join in this case)
			}
		);

		// create API interfaces crew
		// easier to serialise
		let int: CrewInterface = {
			boatName: crew!.boatName,
			coach: crew!.coach.name,
			crewName: crew!.crewName,
			oars: crew!.oars,
			size: crew!.boatSize,
			// list of numbers, and -1 for null since null doesnt really exist properly in json
			seats: (
				await seatsRepo.find({
					where: { crewId: crew!.seats },
					order: { seat: 'ASC' },
				})
			).map((s) => {
				return s.crewMember;
			}),
		};

		// everything went well
		res.status(200).json(int);
		return;
	} catch (e) {
		// there was a problem
		res.status(500).json({ message: 'an error has occured', error: e });
	}
});

/**
 *
 * UPDATE
 * 
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
