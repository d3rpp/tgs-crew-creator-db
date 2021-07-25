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

		res.json({ message: 'done', ...(await repo.save(c)) })
			.status(200)
			.send();
	} else {
		res.json({ message: 'missing name' }).status(400).send();
	}
});

/**
 *
 * READ
 *
 */
router.get('/', async (req: Request, res: Response) => {
	const repo = getRepository(Coach);

	res.json(await repo.find())
		.status(200)
		.send();
});
router.get('/:id', async (req: Request, res: Response) => {
	const repo = getRepository(Coach);

	let found = await repo.findOne({ id: +req.params.id });

	if (found) {
		res.json(found).status(200).send();
	} else {
		res.json({ message: 'not found' }).status(404).send();
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
			res.json({ message: 'not found' }).status(404).send();
			return;
		}

		f.name = req.body.name;

		repo.save(f);

		res.json({ message: 'success', id: f.id }).status(200).send();
	} else {
		res.json({ message: 'missing ID to NAME' }).status(400).send();
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

		res.json({ message: 'done' }).status(200).send();
	} else {
		res.json({ message: 'not found' }).status(404).send();
	}
});

// MUST BE AT BOTTOM

router.use('/*', async (req: Request, res: Response) => {
	res.json({ message: 'no endpoint' }).status(400);
});
