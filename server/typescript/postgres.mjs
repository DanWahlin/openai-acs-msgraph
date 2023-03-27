import pgPkg from 'pg';
import dotenv from 'dotenv';
const { Pool } = pgPkg;

dotenv.config();

const pool = new Pool({
    user: process.env.POSTGRES_USER,
    host: 'localhost',
    database: 'CustomersDB',
    password: process.env.POSTGRES_PASSWORD,
    port: 5432,
});

async function getCustomers() {
    return await pool.query('SELECT * FROM get_customers()');
}

async function queryDb(sqlCommandObject) {
    if (!sqlCommandObject) {
        return { error: 'Missing SQL command object.' };
    }

    try {
        const result = await pool.query(sqlCommandObject.sql, sqlCommandObject.paramValues);

        // Check if the result has rows or an object literal, and handle accordingly
        if (!result.rows) {
            return [];
        }

        if (Array.isArray(result.rows)) {
            return result.rows;
        }

        if (typeof result.rows === 'object') {
            return [result.rows];
        }
    }
    catch (error) {
        console.error('Error executing query:', error);
        res.status(500).json({ error: 'Error executing query.' });
    }
}

export { getCustomers, queryDb };