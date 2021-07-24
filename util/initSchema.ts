import { createConnection } from 'typeorm';

import ENTITIES from '../src/entities/index';

console.log('CREATING TABLES');

createConnection({
	type: 'mysql',
	host: 'localhost',
	port: 3306,
	username: 'root',
	password: '',
	database: 'HUDSON_CURREN_TGS_CREW_CREATOR',
	entities: ENTITIES,
	synchronize: true,
})
	.then(async (c) => {
		// try {
		// 	c.synchronize();
		// } catch (e) {
		// 	console.error('something happened what the bruh');
		// }
		console.log('DONE');
	})
	.catch((e) => {
		console.error('a problem occured');
	});
