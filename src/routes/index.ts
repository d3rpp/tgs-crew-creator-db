import { Router } from 'express';
import { router as crewRouter } from './crews';

export const apiRouter = Router();

apiRouter.use('/crews', crewRouter);

apiRouter.use('/', async (req, res) => {
	// res.json({ message: 'Hello World!' });
	res.json({ message: 'No Endpoint' }).status(400);
});
