#!/usr/bin/env node

const fs = require('fs');
const cp = require('child_process');
const path = require('path');

let status = 0;
fs.readFile(
	path.join(__dirname + '/src/api/.dbschema/schema.sql'),
	'utf-8',
	(err, data) => {
		if (err) {
			return console.error(err);
		}

		let p = cp.spawn('mysql', [
			'-u',
			'root',
			'-e',
			`CREATE DATABASE IF NOT EXISTS HUDSON_CURREN_INTERNAL_DB_2021;`,
		]);

		p.stdout.on('data', (data) => {
			console.log(`stdout: ${data}`);
		});

		p.stderr.on('data', (data) => {
			console.error(`stderr: ${data}`);
		});

		p.on('close', (code) => {
			console.log(`child process exited with code ${code}\n\n\n`);

			let schema = data
				.split('\n')
				.join(' ')
				.split('\t')
				.join(' ')
				.split(';');

			// console.log(schema);

			schema.forEach((val) => {
				if (val == '') return;

				let p = cp.spawn('mysql', [
					'-u',
					'root',
					'-e',
					`USE HUDSON_CURREN_INTERNAL_DB_2021; ${val};`,
				]);

				// p.stdout.on('data', (data) => {
				// 	// console.log(`stdout: ${data}`);
				// });

				// p.stderr.on('data', (data) => {
				// 	// console.error(`stderr: ${data}`);
				// });

				p.on('close', (code) => {
					status += code;
					console.log(`child process exited with code ${code}\n\n\n`);

					if (status != 0) {
						console.error('errors occured', status);
					} else {
						console.log('it worked!');
					}
				});
			});
		});
	}
);
