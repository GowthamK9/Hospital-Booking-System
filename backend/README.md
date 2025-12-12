# Modex Backend (Minimal)

## Setup
1. Copy `.env.example` to `.env` and set `DATABASE_URL` and `PORT`.
2. `npm install`
3. `npm run init-db` to create tables
4. `npm start`

## Endpoints
- POST /api/admin/doctors { name, specialization }
- POST /api/admin/slots { doctor_id, start_time, end_time, max_patients }
- GET  /api/slots
- POST /api/bookings { slot_id, user_name }
- POST /api/admin/expire-pending  (cron-style)
