var mysql = require('mysql');

const Constant = {
    host: "localhost",
    user: "root",
    password: "",
    database: "anonchat",
    table: {
        chatting: 'chatting',
        users: 'users',
        broadcast: 'broadcast'
    }
}

var db = mysql.createConnection(Constant);

module.exports = { db, Constant }