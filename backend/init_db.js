// Run with: node init_db.js (after setting DATABASE_URL in .env)
const db = require('./db');

async function init() {
  const client = await db.getClient();
  try {
    await client.query('BEGIN');
    await client.query(`
      CREATE TABLE IF NOT EXISTS doctors (
        id SERIAL PRIMARY KEY,
        name TEXT NOT NULL,
        specialization TEXT
      );
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS slots (
        id SERIAL PRIMARY KEY,
        doctor_id INTEGER REFERENCES doctors(id) ON DELETE CASCADE,
        start_time TIMESTAMP NOT NULL,
        end_time TIMESTAMP NOT NULL,
        max_patients INTEGER NOT NULL DEFAULT 1
      );
    `);
    await client.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id SERIAL PRIMARY KEY,
        slot_id INTEGER REFERENCES slots(id) ON DELETE CASCADE,
        user_name TEXT NOT NULL,
        status TEXT NOT NULL CHECK (status IN ('PENDING','CONFIRMED','FAILED')),
        created_at TIMESTAMP DEFAULT now()
      );
    `);
    await client.query('COMMIT');
    console.log('DB initialized');
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
  } finally {
    client.release();
    process.exit(0);
  }
}

init();
