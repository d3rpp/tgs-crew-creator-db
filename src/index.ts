import express from 'express';
import * as c from 'ansi-colors';
import { apiRouter } from './routes';
import { createConnection } from 'typeorm';
import ENTITIES from './entities';

const printSuccessMessage = () => {
	const b = c.bold.green('|');

	console.clear();
	console.log(
		c.bold.green('\n\t|------------------- SUCCESS ------------------|')
	);
	console.log(`\t${b}                                              ${b}`);
	console.log(`\t${b} Server is Listening on:                      ${b}`);
	console.log(`\t${b}                                              ${b}`);
	console.log(`\t${b}     http://localhost:3000                    ${b}`);
	console.log(`\t${b}     http://0.0.0.0:3000                      ${b}`);
	console.log(`\t${b}                                              ${b}`);
	console.log(`\t${b} Database Connection:                         ${b}`);
	console.log(`\t${b}                                              ${b}`);
	console.log(`\t${b} Database: HUDSON_CURREN_TGS_CREW_CREATOR     ${b}`);
	console.log(
		`\t${b} Port: ${c.yellow(
			'3306'
		)}                                   ${b}`
	);
	console.log(`\t${b}                                              ${b}`);
	console.log(
		c.bold.green('\t|------------------- SUCCESS ------------------|')
	);
	console.log();

	// console.log(process.cwd() + '/public/dist/');
};

const main = () => {
	console.clear();
	console.log(c.bold.underline.green('Initialising Server'));
	createConnection({
		type: 'mysql',
		host: 'localhost',
		port: 3306,
		username: 'root',
		password: '',
		database: 'HUDSON_CURREN_TGS_CREW_CREATOR',
		entities: ENTITIES,
	})
		.then((_conn) => {
			console.log(c.bold.yellow('Creating Application'));
			const app = express();

			console.log(c.bold.yellow('Adding JSON Module'));
			app.use(express.json());

			console.log(c.bold.yellow('Initialising API Router'));
			app.use('/api', apiRouter);

			console.log(c.bold.yellow('Initialising STATIC Router'));
			app.use('/', express.static(process.cwd() + '/public/dist/'));

			console.log(c.bold.yellow('Starting App Listening Cycle'));
			app.listen(3000);

			printSuccessMessage();
		})
		.catch((err) => {
			console.clear();
			console.log(c.bold.red('AN ERROR HAS OCCURED'));
			console.error(err);
		});
};

main();
