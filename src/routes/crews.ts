import { Router, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Crew from '../entities/Crew.entity';
import Seat from '../entities/Seat.entity';

export const router = Router();

router.get('/', async (req: Request, res: Response) => {
	const repo = getRepository(Crew);

	res.status(200).json(repo.find());
});

// MUST BE AT BOTTOM

router.use('/*', async (req: Request, res: Response) => {
	res.json({ message: 'no endpoint' }).status(400);
});
