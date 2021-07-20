import { Router, Request, Response } from 'express';
import { getRepository } from 'typeorm';
import Crew from '../entities/Crew';

export const router = Router();

router.get('/', async (req: Request, res: Response) => {
	const repo = getRepository(Crew);
});

router.get('/all', async (req: Request, res: Response) => {
	const repo = getRepository(Crew);

	res.status(200).json(repo.find());
});
