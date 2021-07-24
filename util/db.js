var mysql = require('mysql');

var con = mysql.createConnection({
  host: "localhost",
  user: "root",
  password: "",
});

con.connect(function(err) {
  if (err) throw err;
  con.query("DROP DATABASE IF EXISTS HUDSON_CURREN_TGS_CREW_CREATOR", function (err, result, fields) {
    if (err) throw err;
    console.log("DROPPED DB");

    con.query("CREATE DATABASE IF NOT EXISTS HUDSON_CURREN_TGS_CREW_CREATOR",function (err, result, fields) {
      if (err) throw err;
      console.log("CREATED DB");

      process.exit(0);
    });
  });
});