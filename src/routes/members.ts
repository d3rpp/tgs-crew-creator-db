import { Router, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { AgeGroup, Gender } from '../entities/common';
import CrewMember from '../entities/CrewMember.entity';

interface CrewMemberInterface {
	name: string;
	ageGroup: AgeGroup;
	gender: Gender;
	novice: boolean;
}

export const router = Router();

/**
 *
 * CREATE
 *
 */
router.post('/', async (req: Request, res: Response) => {
	try {
		console.log(req.body);

		if (!req.body || req.body == {}) {
			res.status(400).send();
			return;
		}

		const repo = getRepository(CrewMember);

		// get all members and map them to lower case
		if (
			(await repo.find())
				.map((val) => {
					return val.name.toLowerCase();
				})
				.includes(req.body.name.toLowerCase())
		) {
			res.status(409).send();
			return;
		}

		let name: string, ageGroup: AgeGroup, gender: Gender, novice: boolean;

		try {
			let int = req.body as CrewMemberInterface;

			name = int.name ? int.name : 'unnamed';
			ageGroup = int.ageGroup ? int.ageGroup : 'U18';
			gender = int.gender ? int.gender : 'M';
			novice = int.novice ? int.novice : false;
		} catch (e) {
			res.status(400).send();
			return;
		}

		let toSave = new CrewMember(name!, ageGroup!, gender!, novice!);

		let { id } = await repo.save(toSave);

		res.status(201).json({ status: 'success', id: id });
	} catch (e) {
		console.error(e);
	}
});

/**
 *
 * READ
 *
 */
router.get('/', async (req: Request, res: Response) => {
	try {
		const repo = getRepository(CrewMember);

		let c = await repo.find({ order: { ageGroup: 'ASC', gender: 'DESC' } });

		if (c.length < 1) {
			res.status(404).send();
			return;
		}

		res.status(200).json(c);
	} catch (e) {
		const repo = getRepository(CrewMember);
		if ((await repo.find()).length < 1) {
			res.status(404).send();
			return;
		}
		// console.error(e);
	}
});

router.get('/ids', async (req: Request, res: Response) => {
	try {
		const repo = getRepository(CrewMember);

		let cms = await repo.createQueryBuilder('cm').select('cm.id').getMany();

		res.json(cms.map((cm) => cm.id));
		res.status(200).send();
	} catch (e) {
		console.error(e);
	}
});

router.get('/:id', async (req: Request, res: Response) => {
	try {
		const repo = getRepository(CrewMember);

		if (+req.params.id <= 0) {
			res.status(404).json({ message: 'not found' });
			return;
		}

		let b = await repo.findOne({ id: +req.params.id });

		if (b) {
			res.status(200).json({
				id: b.id,
				name: b.name,
				ageGroup: b.ageGroup,
				gender: b.gender,
				novice: b.novice,
			});
		}
	} catch (e) {
		console.error(e);
	}
});

/**
 *
 * UPDATE
 *
 */

router.put('/:id', async (req: Request, res: Response) => {
	try {
		if (!req.body || req.body == {}) {
			res.status(400).send();
			return;
		}

		const repo = getRepository(CrewMember);

		let found = await repo.findOne({ id: +req.params.id });

		if (!found) {
			res.status(404).json({ message: 'not found' });
		} else {
			let int = req.body as CrewMemberInterface;

			await repo.update(found, {
				name: int.name,
				ageGroup: int.ageGroup,
				gender: int.gender,
				novice: int.novice,
			});

			res.status(200).json({ message: 'done', id: found.id });
		}
	} catch (e) {
		console.error(e);
		res.status(500).json(e);
	}
});

/**
 *
 * DELETE
 *
 */
router.delete('/:id', async (req: Request, res: Response) => {
	try {
		if (req.params.id) {
			const repo = getRepository(CrewMember);

			// let repo.findOne(+req.params.id);

			if (await repo.findOne({ id: +req.params.id })) {
				try {
					await repo.delete({ id: +req.params.id });
				} catch (e) {
					res.status(400).json({ message: 'invalid id' });
				}

				res.status(200).json({ message: 'done', id: req.params.id });
			} else {
				res.status(404).json({ message: 'not found' });
			}
		} else {
			res.status(500).json({ message: 'error has occured' });
		}
	} catch (e) {
		console.error(e);
	}
});

// MUST BE AT BOTTOM

router.use('/*', async (req: Request, res: Response) => {
	res.json({ message: 'no endpoint' }).status(400);
	return;
});
