const { Pool } = require('pg');

const pool = new Pool({
    host: 'dpg-cql1k956l47c73f1gfb0-a.singapore-postgres.render.com',
    user: 'leaveappdb_user',
    password: 'LWhPxuYXldyYxUI3DWBHivX8OCFNy9HM',
    database: 'leaveappdb',
    port: 5432,
    ssl: {
        rejectUnauthorized: false
    }
});

pool.connect((err) => {
    if (err) throw err;
    console.log('Connected to PostgreSQL database');
});

module.exports = pool;
