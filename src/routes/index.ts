import { Router } from 'express';
import { router as crewRouter } from './crews';
import { router as crewMemberRouter } from './members';

export const apiRouter = Router();

apiRouter.use('/crews', crewRouter);

apiRouter.use('/members', crewMemberRouter);

apiRouter.use('/', async (req, res) => {
	// res.json({ message: 'Hello World!' });
	res.json({ message: 'No Endpoint' }).status(400);
});
