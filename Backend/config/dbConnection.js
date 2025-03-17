const mysql = require("mysql2");
require('dotenv').config();


const pool = mysql.createPool({

    host: process.env.HOST,
    user: process.env.USER,
    password: process.env.PASS,
    database: process.env.DATABASE,
    waitForConnections: true,
    connectionLimit: 10,
    queueLimit: 0
});


function dbconnect() {
    pool.getConnection((error, connection) => {

        if (error) {
            console.log(error.message);
            return;
        }
        console.log("Mysql Database Connected !")
        connection.release();
    })


}
module.exports = { dbconnect, pool };


