const express = require('express');
const router = express.Router();
const db = require('./db');

// Admin: create doctor
router.post('/admin/doctors', async (req, res) => {
  const { name, specialization } = req.body;
  if (!name) return res.status(400).json({ error: 'name required' });
  try {
    const result = await db.query(
      'INSERT INTO doctors (name, specialization) VALUES ($1,$2) RETURNING *',
      [name, specialization]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

// Admin: create slot
router.post('/admin/slots', async (req, res) => {
  const { doctor_id, start_time, end_time, max_patients } = req.body;
  if (!doctor_id || !start_time || !end_time) return res.status(400).json({ error: 'missing fields' });
  try {
    const result = await db.query(
      'INSERT INTO slots (doctor_id, start_time, end_time, max_patients) VALUES ($1,$2,$3,$4) RETURNING *',
      [doctor_id, start_time, end_time, max_patients || 1]
    );
    res.json(result.rows[0]);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

// Public: list slots with doctor info and available seats
router.get('/slots', async (req, res) => {
  try {
    const slots = await db.query(`
      SELECT s.*, d.name as doctor_name, d.specialization,
        (s.max_patients - COALESCE(b.cnt,0)) as available
      FROM slots s
      JOIN doctors d ON d.id = s.doctor_id
      LEFT JOIN (
        SELECT slot_id, COUNT(*) as cnt FROM bookings WHERE status = 'CONFIRMED' GROUP BY slot_id
      ) b ON b.slot_id = s.id
      ORDER BY s.start_time
    `);
    res.json(slots.rows);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

// Booking endpoint - concurrency safe
router.post('/bookings', async (req, res) => {
  const { slot_id, user_name } = req.body;
  if (!slot_id || !user_name) return res.status(400).json({ error: 'missing fields' });

  const client = await db.getClient();
  try {
    await client.query('BEGIN');

    // lock the slot row
    const slotRes = await client.query('SELECT * FROM slots WHERE id=$1 FOR UPDATE', [slot_id]);
    if (slotRes.rows.length === 0) {
      await client.query('ROLLBACK');
      return res.status(404).json({ error: 'slot not found' });
    }
    const slot = slotRes.rows[0];

    // count confirmed bookings
    const cntRes = await client.query('SELECT COUNT(*) FROM bookings WHERE slot_id=$1 AND status=$2', [slot_id, 'CONFIRMED']);
    const confirmed = parseInt(cntRes.rows[0].count, 10);

    if (confirmed >= slot.max_patients) {
      // no capacity
      await client.query('ROLLBACK');
      return res.status(409).json({ error: 'slot full' });
    }

    // insert as PENDING then confirm (atomic)
    const insertRes = await client.query(
      'INSERT INTO bookings (slot_id, user_name, status) VALUES ($1,$2,$3) RETURNING *',
      [slot_id, user_name, 'PENDING']
    );
    const booking = insertRes.rows[0];

    // Immediately mark CONFIRMED (in real app, might hold pending)
    await client.query('UPDATE bookings SET status=$1 WHERE id=$2', ['CONFIRMED', booking.id]);

    await client.query('COMMIT');

    const final = (await db.query('SELECT * FROM bookings WHERE id=$1', [booking.id])).rows[0];
    res.json(final);
  } catch (err) {
    await client.query('ROLLBACK');
    console.error(err);
    res.status(500).json({ error: 'booking failed' });
  } finally {
    client.release();
  }
});

// Optional: endpoint to force fail old pending bookings (run as cron)
router.post('/admin/expire-pending', async (req, res) => {
  try {
    const result = await db.query(
      "UPDATE bookings SET status='FAILED' WHERE status='PENDING' AND created_at < NOW() - INTERVAL '2 minutes' RETURNING *"
    );
    res.json({ updated: result.rowCount });
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: 'db error' });
  }
});

module.exports = router;
