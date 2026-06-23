import { getDb } from './server/db.ts';

const pool = getDb();
pool.query('SELECT id, name, email, role FROM users').then(res => {
  console.log('USERS IN DB:');
  console.log(res.rows);
  process.exit(0);
}).catch(err => {
  console.error(err);
  process.exit(1);
});
