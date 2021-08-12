var mysql = require('mysql');

var con = mysql.createConnection({
	host: 'localhost',
	user: 'root',
	password: '',
});

const db_name = 'HUDSON_CURREN_TGS_CREW_CREATOR';

con.connect(function (err) {
	if (err) {
		throw err;
		process.exit(1);
	}

	con.query(
		'DROP DATABASE IF EXISTS ' + db_name,
		function (err, result, fields) {
			if (err) throw err;
			console.log('DROPPED DB');

			con.query(
				'CREATE DATABASE IF NOT EXISTS ' + db_name,
				function (err, result, fields) {
					if (err) throw err;
					console.log('CREATED DB');

					process.exit(0);
				}
			);
		}
	);
});
