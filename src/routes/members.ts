import { Router, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import { AgeGroup, Gender } from '../entities/common';
import CrewMember from '../entities/CrewMember.entity';

interface CrewMemberInterface {
	name: string;
	ageGroup: AgeGroup;
	gender: Gender;
}

export const router = Router();

/**
 *
 * CREATE
 *
 */
router.post('/', async (req: Request, res: Response) => {
	// console.log(req.body);

	if (!req.body || req.body == {}) {
		res.status(400).send();
		return;
	}

	const repo = getRepository(CrewMember);

	let name: string, ageGroup: AgeGroup, gender: Gender;

	try {
		let int = req.body as CrewMemberInterface;

		name = int.name ? int.name : 'unnamed';
		ageGroup = int.ageGroup ? int.ageGroup : 'U18';
		gender = int.gender ? int.gender : 'M';
	} catch (e) {
		res.status(400).send();
		return;
	}

	let toSave = new CrewMember(name!, ageGroup!, gender!);

	let { id } = await repo.save(toSave);

	res.json({ status: 'success', id: id }).status(201).send();
});

/**
 *
 * READ
 *
 */
router.get('/', async (req: Request, res: Response) => {
	const repo = getRepository(CrewMember);

	res.status(200).json(await repo.find());
});

/**
 *
 * UPDATE
 *
 */

router.put('/:id', async (req: Request, res: Response) => {
	if (!req.body || req.body == {}) {
		res.status(400).send();
		return;
	}

	const repo = getRepository(CrewMember);

	let found = await repo.findOne({ id: +req.params.id });

	if (!found) {
		res.status(404).json({ message: 'not found' }).send();
	} else {
		let int = req.body as CrewMemberInterface;

		found.ageGroup = int.ageGroup;
		found.gender = int.gender;
		found.name = int.name;

		repo.save(found);

		res.status(200).json({ message: 'done', id: found.id });
	}
});

/**
 *
 * DELETE
 *
 */
router.delete('/:id', async (req: Request, res: Response) => {
	if (req.params.id) {
		const repo = getRepository(CrewMember);

		// let repo.findOne(+req.params.id);

		if (await repo.findOne({ id: +req.params.id })) {
			try {
				await repo.delete({ id: +req.params.id });
			} catch (e) {
				res.json({ message: 'invalid id' }).status(400).send();
			}

			res.json({ message: 'done', id: req.params.id }).status(200).send();
		} else {
			res.json({ message: 'not found' }).status(404).send();
		}
	} else {
		res.json({ message: 'error has occured' }).status(500).send();
	}
});

// MUST BE AT BOTTOM

router.use('/*', async (req: Request, res: Response) => {
	res.json({ message: 'no endpoint' }).status(400);
});
