const { Pool } = require("pg");

module.exports = new Pool({
    user: 'ecalazans',
    password: 'erisabela',
    host: 'localhost',
    port: '5432',
    database: 'gymmanager'
});