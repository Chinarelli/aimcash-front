const { Pool } = require('pg');
const configPostgresql = require('../config/config').postgresql;

const pg = new Pool({
    connectionString: configPostgresql.url, 
    ssl: false
});

module.exports = pg;