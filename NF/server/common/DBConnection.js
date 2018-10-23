var mysql = require('mysql');
var config = require('../config/config');

var DBConnection = mysql.createPool({
    host: config.dbconcfig.host,
    user: config.dbconcfig.user,
    password: config.dbconcfig.password,
    database: config.dbconcfig.database,
    multipleStatements: true
  });

  
  module.exports = DBConnection;