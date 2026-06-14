import { getDb } from './server/db.ts';

const pool = getDb();
pool.query('SELECT id, name, "additionalImages" FROM kosts').then(res => {
  console.log(res.rows);
  process.exit(0);
}).catch(err => {
  console.error(err);
});
