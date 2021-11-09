import { Router, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Coach from '../entities/Coach.entity';

export const router = Router();

/**
 *
 * CREATE
 *
 */
router.post('/', async (req: Request, res: Response) => {
	if (req.body.name) {
		const repo = getRepository(Coach);

		let all = await (
			await repo.find()
		).map((val) => {
			return val.name.toLowerCase();
		});

		if (all.includes((req.body.name as string).toLowerCase())) {
			let everything = await (
				await repo.find()
			)
				.map((val) => {
					return { name: val.name.toLowerCase(), id: val.id };
				})
				.forEach((val) => {
					if (val.name == (req.body.name as string).toLowerCase())
						res.json({ message: 'already exists', id: val.id });
				});
		}

		let c = new Coach(req.body.name);

		repo.save(c);

		res.status(200).json({ message: 'done', ...(await repo.save(c)) });
	} else {
		res.status(400).json({ message: 'missing name' });
	}
});

/**
 *
 * READ
 *
 */
router.get('/', async (req: Request, res: Response) => {
	const repo = getRepository(Coach);

	res.status(200).json(await repo.find());
});
router.get('/:id', async (req: Request, res: Response) => {
	const repo = getRepository(Coach);

	let found = await repo.findOne({ id: +req.params.id });

	if (found) {
		res.status(200).json(found);
	} else {
		res.status(404).json({ message: 'not found' });
	}
});

/**
 *
 * UPDATE
 *
 */
router.put('/:id', async (req: Request, res: Response) => {
	if (req.params.id && req.body.name) {
		const repo = getRepository(Coach);

		let f = await repo.findOne({ id: +req.params.id });

		if (!f) {
			res.status(404).json({ message: 'not found' });
			return;
		}

		f.name = req.body.name;

		repo.save(f);

		res.status(200).json({ message: 'success', id: f.id });
	} else {
		res.status(400).json({ message: 'missing ID to NAME' });
	}
});

/**
 *
 * DELETE
 *
 */
router.delete('/:id', async (req: Request, res: Response) => {
	const repo = getRepository(Coach);

	if (await repo.findOne({ id: +req.params.id })) {
		await repo.delete({ id: +req.params.id });

		res.status(200).json({ message: 'done' });
	} else {
		res.status(404).json({ message: 'not found' });
	}
});

// MUST BE AT BOTTOM

router.use('/*', async (req: Request, res: Response) => {
	res.json({ message: 'no endpoint' }).status(400);
});
