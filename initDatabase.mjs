import pgPrg from 'pg';
const { Pool } = pgPrg;

const pool = new Pool({
  user: 'web',
  host: 'localhost',
  database: 'CustomersDB',
  password: 'web-password',
  port: 5432,
});

async function checkTables() {
  const query = `SELECT table_name
    FROM information_schema.tables
    WHERE table_schema = 'public';`;

  const res = await pool.query(query);
  const tableNames = res.rows.map(row => row.table_name);
  return tableNames.includes('customers') && tableNames.includes('orders') && tableNames.includes('order_items');
}

async function createTables() {
  const createCustomersTable = `CREATE TABLE customers (
    id SERIAL PRIMARY KEY,
    company VARCHAR(255) NOT NULL,
    city VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(255) NOT NULL
  );`;

  const createOrdersTable = `CREATE TABLE orders (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    date DATE NOT NULL,
    total NUMERIC(10,2) NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
  );`;

  const createOrderItemsTable = `CREATE TABLE order_items (
    id SERIAL PRIMARY KEY,
    order_id INTEGER NOT NULL,
    product_id INTEGER NOT NULL,
    quantity INTEGER NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    FOREIGN KEY (order_id) REFERENCES orders(id)
  );`;

  const createReviewsTable = `CREATE TABLE reviews (
    id SERIAL PRIMARY KEY,
    customer_id INTEGER NOT NULL,
    review INTEGER NOT NULL,
    date DATE NOT NULL,
    comment VARCHAR(500) NOT NULL,
    FOREIGN KEY (customer_id) REFERENCES customers(id)
  );`;

  await pool.query(createCustomersTable);
  await pool.query(createOrdersTable);
  await pool.query(createOrderItemsTable);
  await pool.query(createReviewsTable);
}

async function seedData() {
  const insertCustomers = `INSERT INTO customers (company, city, email, phone)
    VALUES
      ('Adatum Corporation', 'New York', 'jane.doe@example.com', '+11231111234'),
      ('Adventure Works Cycles', 'London', 'john.smith@example.com', '+14561111234'),
      ('Contoso Pharmaceuticals', 'Austin', 'peter.gibbons@example.com', '+17891111234'),
      ('Tailwind Traders', 'Sydney', 'lisa.taylor@example.com', '+10121111234');`;

  const insertOrders = `INSERT INTO orders (customer_id, date, total)
    VALUES
      (1, '2023-03-15', 10000.00),
      (2, '2023-03-14', 45000.00),
      (3, '2023-03-14', 100.00),
      (4, '2023-03-14', 30000.00),
      (1, '2023-02-22', 2000.00),
      (2, '2023-01-31', 75000.00),
      (4, '2023-04-12', 15000.00);`;

  const insertOrderItems = `INSERT INTO order_items (order_id, product_id, quantity, price)
    VALUES
      (1, 1, 1, 5000.00),
      (1, 2, 1, 5000.00),
      (2, 1, 9, 5000.00),
      (3, 3, 1, 100.00),
      (4, 2, 1, 30000.00),
      (5, 2, 1, 2000.00),
      (6, 3, 1, 75000.00),
      (7, 3, 1, 7500.00);`;

  const insertReviews = `INSERT INTO reviews (customer_id, review, date, comment)
    VALUES
      (1, 4, '2023-03-15', 'Excellent company!'),
      (2, 3, '2023-03-14', 'Average company. Not that impressed.'),
      (3, 5, '2023-03-14', 'Excellent company!'),
      (4, 1, '2023-03-14', 'Hated them - not good at all.'),
      (1, 5, '2023-02-22', 'Very nice company!'),
      (2, 3, '2023-01-31', 'They get the job done.'),
      (4, 5, '2023-04-12', 'Would buy from them again!');`;

  const customersSelectSproc = `CREATE OR REPLACE FUNCTION get_customers()
      RETURNS SETOF customers 
      LANGUAGE SQL 
  AS $$
  SELECT id, company, city, email, phone FROM customers
  $$;`

  await pool.query(insertCustomers);
  await pool.query(insertOrders);
  await pool.query(insertOrderItems);
  await pool.query(insertReviews);
  await pool.query(customersSelectSproc);
}

export async function initializeDb() {
  await pool.connect();
  console.log('Connected to database...');

  const tablesExist = await checkTables();

  if (!tablesExist) {
    await createTables();
    await seedData();
    console.log('Database initialized');
  } else {
    console.log('Database already initialized');
  }

  pool.end();
  return;
}
