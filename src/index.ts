import express from 'express';
import { Server } from 'http';
import * as c from 'ansi-colors';
import { apiRouter } from './routes';
import { createConnection, Connection } from 'typeorm';
import ENTITIES from './entities';

// #region print messaged
const printSuccessMessage = () => {
	const b = c.green('|');

	console.clear();
	console.log(
		c.green('\n\t|------------------- SUCCESS ------------------|')
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
	console.log(c.green('\t|------------------- SUCCESS ------------------|'));
	console.log();

	// console.log(process.cwd() + '/public/dist/');
};
//#endregion

console.log(c.bold.yellow('Creating Application'));
const app = express();
app.use(express.json());
let server: Server | null | undefined = null;
let connection: Connection | null | undefined = null;

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
		logging: true,
	})
		.then(async (conn) => {
			connection = conn;

			app.use('/', (req, res, next) => {
				console.log(
					`${c.bold.magentaBright('REQUEST')} RECEIVED ${
						req.method
					} REQUEST TO ${req.url}`
				);
				// req.next
				next();
			});

			console.log(c.bold.yellow('Adding JSON Module'));
			app.use(express.json());

			console.log(c.bold.yellow('Initialising API Router'));
			app.use('/api', apiRouter);

			console.log(c.bold.yellow('Initialising STATIC Router'));
			app.use('/', express.static(process.cwd() + '/public/dist/'));

			console.log(c.bold.yellow('Starting App Listening Cycle'));
			server = app.listen(3000);

			printSuccessMessage();
		})
		.catch((err) => {
			console.clear();
			console.log(c.bold.red('AN ERROR HAS OCCURED'));
			console.error(err);
		});
};

const shutDown = () => {
	if (connection != null && connection != undefined) {
		console.log('closing connection to database');
		connection.close();
	} else process.exit(1);

	if (server != null && server != undefined) {
		console.log('shutting down server');
		server.close();
	} else process.exit(2);

	console.log('done');
	process.exit(0);
};

process.on('exit', shutDown);
// process.on('SIGINT', shutDown);
// process.on('SIGTERM', shutDown);

main();
