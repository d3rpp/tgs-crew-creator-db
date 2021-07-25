import { createConnection } from 'typeorm';

import ENTITIES from '../src/entities';

console.log('CREATING TABLES');

try {
	createConnection({
		type: 'mysql',
		host: 'localhost',
		port: 3306,
		username: 'root',
		password: '',
		database: 'HUDSON_CURREN_TGS_CREW_CREATOR',
		entities: ENTITIES,
		// synchronize: true,
	})
		.then(async (c) => {
			try {
				c.synchronize(true).then(() => {
					console.log('DONE');
					c.close();
					process.exit(0);
				});
			} catch (e) {
				console.error('something happened what the bruh');
			}
		})
		.catch((e) => {
			console.error('a problem occured');
			process.exit(1);
		});
} catch (e) {
	// console.error(e);
	process.exit(2);
}
