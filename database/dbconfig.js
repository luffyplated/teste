const mysql = require('mysql2');
require("dotenv").config()

var db_config = {
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USUARIO,
    password: process.env.MYSQL_SENHA,
    database: process.env.MYSQL_DATABASE
};

var connection;

function handleDisconnect() {
    connection = mysql.createConnection(db_config);

    connection.connect(function (err) {
        if (err) {
            console.log('error when connecting to db:', err);
            setTimeout(handleDisconnect, 2000);
        }
    });
    connection.on('error', function (err) {
        console.log('db error', err);
        if (err.code === 'PROTOCOL_CONNECTION_LOST') {
            handleDisconnect();
        } else {
            throw err;
        }
    });
}

handleDisconnect();
module.exports = connection