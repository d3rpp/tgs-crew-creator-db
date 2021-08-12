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

			// try {
			// 	await crewRepo.save(cr);
			// } catch (e) {
			// 	res.status(500)
			// 		.json({ message: 'UNABLE TO SAVE CREW', error: e })
			// 		.send();
			// 	return;
			// }

			try {
				await crewRepo.save(cr);

				cr.seats = cr.id;

				await crewRepo.save(cr);
			} catch (e) {
				res.json({ message: 'error saving crew', error: e })
					.status(500)
					.send();
				return;
			}

			let success = true;

			await Promise.all(
				seats.map((val, index) => {
					return new Promise(async (resolve, reject) => {
						let cm = await crewMemberRepo.findOne({ id: val });

						if (!cm) {
							res.status(400)
								.json({ message: 'CREW MEMBER NON EXISTENT' })
								.send();
							reject({});
							return;
						} else {
							let s = new Seat(index + 1, cm!.id, cr.seats!);

							seatsRepo.save(s);

							resolve({});
						}
					});
				})
			).catch(() => {
				success = false;
			});

			if (!success) {
				return;
			}
			// THIS MAY OR MAY NOT BREAK
			// I AM VERY SCARED THAT THIS WON'T WORK
			res.json(
				await crewRepo
					.findOne({
						where: { id: cr.id },
						relations: ['coach'],
					})
					.then(async (val) => {
						let int: CrewInterface = {
							boatName: val!.boatName,
							coach: val!.coach.name,
							crewName: val!.crewName,
							oars: val!.oars,
							size: val!.boatSize,
							seats: (
								await seatsRepo.find({
									where: { crewId: val!.seats },
									order: { seat: 'ASC' },
								})
							).map((s) => {
								return s.crewMember;
							}),
						};

						return int;
					})
			)
				.status(200)
				.send();
		} catch (e) {
			res.json({
				message: 'an error has occured',
				error: e,
			})
				.status(500)
				.send();

			return;
		}
	} catch (e) {
		res.json({ message: 'missing body parts', error: e })
			.status(400)
			.send();

		return;
	}
});

/**
 *
 * READ
 *
 */
router.get('/', async (req: Request, res: Response) => {
	try {
		const repo = getRepository(Crew);
		const seatsRepo = getRepository(Seat);

		if ((await repo.find()).length < 1) {
			res.status(404).send();
			return;
		}

		let crews = await repo.find({
			relations: ['coach'],
		});

		crews.forEach(async (val) => {
			let int: CrewInterface = {
				boatName: val!.boatName,
				coach: val!.coach.name,
				crewName: val!.crewName,
				oars: val!.oars,
				size: val!.boatSize,
				seats: (
					await seatsRepo.find({
						where: { crewId: val!.seats },
						order: { seat: 'ASC' },
					})
				).map((s) => {
					return s.crewMember;
				}),
			};

			return int;
		});

		res.json(crews).status(200).send();
		return;
	} catch (e) {
		res.json({ message: 'an error has occured', error: e });
	}
});

router.get('/:id', async (req: Request, res: Response) => {
	try {
		const repo = getRepository(Crew);
		const seatsRepo = getRepository(Seat);

		if (!(await repo.findOne({ id: req.params.id as unknown as number }))) {
			res.status(404).send();
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

		res.json(int).status(200).send();
		return;

		// 	return tmp;
	} catch (e) {
		res.json({ message: 'an error has occured', error: e });
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
		!req.body.oars ||
		!req.body.seats
	) {
		res.json({ message: 'missing part of body' }).status(400).send();
		return;
	}

	let crew: Crew | undefined = undefined;

	try {
		crew = await repo.findOne({
			id: req.params.id as unknown as number,
		});
	} catch (e) {
		res.json({ message: 'id was not a number', error: e })
			.status(400)
			.send();
		return;
	}

	if (!crew) {
		res.json({ message: 'not found' }).status(404).send();
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
			await seatsRepo.delete(val);
		});

		await Promise.all(
			(req.body.seats as number[]).map((val: number, index: number) => {
				return new Promise(async (resolve, reject) => {
					let cm = await crewMemberRepo.findOne({ id: val });

					if (!cm) {
						res.status(400)
							.json({
								message: 'CREW MEMBER NON EXISTENT',
							})
							.send();
						reject({});
						return;
					} else {
						let s = new Seat(index + 1, cm!.id, crew!.seats!);

						seatsRepo.save(s);

						resolve({});
					}
				});
			})
		);
	} catch (e) {
		res.json({ message: 'server side error', error: e }).status(500).send();
		return;
	}

	repo.save(crew);

	res.json(crew).status(200).send();
});

/**
 *
 * DELETE
 * TODO: THIS
 */
router.delete('/:id', async (req: Request, res: Response) => {
	const repo = getRepository(Crew);
	const seatsRepo = getRepository(Seat);

	if (parseInt(req.params.id) == NaN) {
		res.json({ message: 'invalid id' }).status(400).send();
		return;
	}

	let crew = await repo.findOne({ id: parseInt(req.params.id) });

	if (!crew) {
		res.json({ message: 'crew not found' }).status(404).send();
		return;
	}

	(await seatsRepo.find({ where: { crewId: crew.id } })).forEach(
		async (val) => {
			seatsRepo.delete(val);
		}
	);

	await repo.delete(crew);

	res.json({ message: 'success' }).status(204).send();
});

// MUST BE AT BOTTOM

router.use('/*', async (req: Request, res: Response) => {
	res.json({ message: 'no endpoint' }).status(400);
});
