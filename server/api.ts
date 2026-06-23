import express from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { getDb } from './db.js';
import { sendBookingConfirmation, sendBookingStatusUpdate } from './email.js';

const router = express.Router();
const JWT_SECRET = process.env.JWT_SECRET as string;

// Middleware to verify JWT token
export const requireAuth = (req: any, res: any, next: any) => {
  const authHeader = req.headers.authorization;
  if (!authHeader) {
    return res.status(401).json({ error: 'Unauthorized: Missing token' });
  }

  const token = authHeader.split(' ')[1];
  try {
    const payload = jsonwebtoken.verify(token, JWT_SECRET);
    req.user = payload;
    next();
  } catch (err) {
    return res.status(401).json({ error: 'Unauthorized: Invalid token' });
  }
};

// =======================
// KOSTS API
// =======================

// Get all Kosts (Public)
router.get('/kosts', async (req, res) => {
  try {
    const db = getDb();
    const compact = req.query.compact === 'true';
    
    let queryText = 'SELECT * FROM kosts';
    if (compact) {
      // Omit heavy additionalImages and description columns
      queryText = 'SELECT id, "ownerId", name, type, "roomClass", price, rating, "reviewsCount", location, image, facilities, "availableRooms", "totalRooms", address, author FROM kosts';
    }
    
    const result = await db.query(queryText);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching kosts:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get Single Kost by ID (Public)
router.get('/kosts/:id', async (req, res) => {
  try {
    const kostId = req.params.id;
    const db = getDb();
    const result = await db.query('SELECT * FROM kosts WHERE id = $1', [kostId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Kost not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching kost details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a new Kost (Protected, Owner only)
router.post('/kosts', requireAuth, async (req: any, res: any) => {
  if (req.user.role?.toLowerCase() !== 'owner') {
    return res.status(403).json({ error: 'Forbidden: Only owners can add properties' });
  }

  try {
    const { id, name, type, roomClass, price, rating, location, image, additionalImages, facilities, availableRooms, totalRooms, description, address, author } = req.body;
    const db = getDb();
    
    await db.query(`
      INSERT INTO kosts (id, "ownerId", name, type, "roomClass", price, rating, "reviewsCount", location, image, "additionalImages", facilities, "availableRooms", "totalRooms", description, address, author)
      VALUES ($1, $2, $3, $4, $5, $6, $7, 0, $8, $9, $10, $11, $12, $13, $14, $15, $16)
    `, [id, req.user.id, name, type, roomClass, price, rating, location, image, JSON.stringify(additionalImages || []), JSON.stringify(facilities), availableRooms, totalRooms, description, address, author]);

    res.status(201).json({ message: 'Kost added successfully' });
  } catch (error) {
    console.error('Error adding kost:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Edit Kost (Protected, Owner only)
router.put('/kosts/:id', requireAuth, async (req: any, res: any) => {
  console.log('[PUT /kosts/:id] Request user payload:', req.user);
  if (req.user.role?.toLowerCase() !== 'owner') {
    console.log('[PUT /kosts/:id] Role check failed. User role:', req.user.role);
    return res.status(403).json({ error: 'Forbidden: Only owners can edit properties' });
  }

  try {
    const kostId = req.params.id;
    const { name, type, roomClass, price, location, image, additionalImages, facilities, availableRooms, totalRooms, description, address } = req.body;
    const db = getDb();

    // Verify ownership (allow if ownerId is null for seed data)
    const check = await db.query('SELECT "ownerId" FROM kosts WHERE id = $1', [kostId]);
    if (check.rows.length === 0) {
      console.log('[PUT /kosts/:id] Kost not found in DB:', kostId);
      return res.status(404).json({ error: 'Kost not found' });
    }
    console.log('[PUT /kosts/:id] DB ownerId:', check.rows[0].ownerId, 'Request user ID:', req.user.id);
    if (check.rows[0].ownerId !== null && check.rows[0].ownerId !== req.user.id) {
      console.log('[PUT /kosts/:id] Ownership check failed. DB ownerId:', check.rows[0].ownerId, 'Request user ID:', req.user.id);
      return res.status(403).json({ error: 'Forbidden: Not the owner' });
    }


    await db.query(`
      UPDATE kosts SET 
        name = $1, type = $2, "roomClass" = $3, price = $4, location = $5, 
        image = $6, "additionalImages" = $7, facilities = $8, "availableRooms" = $9, 
        "totalRooms" = $10, description = $11, address = $12
      WHERE id = $13
    `, [name, type, roomClass, price, location, image, JSON.stringify(additionalImages || []), JSON.stringify(facilities), availableRooms, totalRooms, description, address, kostId]);

    res.json({ message: 'Kost updated successfully' });
  } catch (error) {
    console.error('Error updating kost:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete Kost (Protected, Owner only)
router.delete('/kosts/:id', requireAuth, async (req: any, res: any) => {
  if (req.user.role?.toLowerCase() !== 'owner') {
    return res.status(403).json({ error: 'Forbidden: Only owners can delete properties' });
  }

  try {
    const kostId = req.params.id;
    const db = getDb();

    // Verify ownership
    const check = await db.query('SELECT "ownerId" FROM kosts WHERE id = $1', [kostId]);
    if (check.rows.length === 0) return res.status(404).json({ error: 'Kost not found' });
    if (check.rows[0].ownerId !== null && check.rows[0].ownerId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: Not the owner' });
    }

    // Delete related bookings first to avoid foreign key constraints
    await db.query('DELETE FROM bookings WHERE "kostId" = $1', [kostId]);
    await db.query('DELETE FROM kosts WHERE id = $1', [kostId]);

    res.json({ message: 'Kost deleted successfully' });
  } catch (error) {
    console.error('Error deleting kost:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// =======================
// BOOKINGS API
// =======================

// Get Bookings (Protected)
// Users see their own bookings. Owners see bookings for their kosts.
router.get('/bookings', requireAuth, async (req: any, res: any) => {
  try {
    const db = getDb();
    let result;

    if (req.user.role?.toLowerCase() === 'user') {
      result = await db.query('SELECT * FROM bookings WHERE "userId" = $1 ORDER BY "bookingDate" DESC', [req.user.id]);
    } else {
      // For owners, we should ideally filter by kosts they own, but for simplicity we return all or join
      result = await db.query(`
        SELECT b.* FROM bookings b
        JOIN kosts k ON b."kostId" = k.id
        WHERE k."ownerId" = $1 OR k."ownerId" IS NULL
        ORDER BY b."bookingDate" DESC
      `, [req.user.id]);
    }

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching bookings:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Get booked slots for a specific Kost (Public)
router.get('/kosts/:id/booked-slots', async (req, res) => {
  try {
    const kostId = req.params.id;
    const db = getDb();
    const result = await db.query(
      'SELECT "startDate" as date, "surveyTime" as time FROM bookings WHERE "kostId" = $1 AND status != \'Ditolak\'',
      [kostId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching booked slots:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Create a Booking (Protected, User only)
router.post('/bookings', requireAuth, async (req: any, res: any) => {
  try {
    const { id, kostId, kostName, kostImage, userName, userPhone, userEmail, startDate, surveyTime, duration, totalPrice, bookingDate, paymentMethod } = req.body;
    const db = getDb();
    
    // Check if slot is already booked for this property
    const checkSlot = await db.query(
      'SELECT id FROM bookings WHERE "kostId" = $1 AND "startDate" = $2 AND "surveyTime" = $3 AND status != \'Ditolak\'',
      [kostId, startDate, surveyTime]
    );
    if (checkSlot.rows.length > 0) {
      return res.status(400).json({ error: 'Jadwal survey pada tanggal dan jam tersebut sudah dipesan. Silakan pilih slot lain.' });
    }

    await db.query(`
      INSERT INTO bookings (id, "kostId", "kostName", "kostImage", "userId", "userName", "userPhone", "userEmail", "startDate", "surveyTime", duration, "totalPrice", status, "bookingDate", "paymentMethod")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, 'Pending', $13, $14)
    `, [id, kostId, kostName, kostImage, req.user.id, userName, userPhone, userEmail, startDate, surveyTime, duration || 0, totalPrice || 0, bookingDate, paymentMethod]);

    // Send confirmation email asynchronously
    const newBooking = {
      id,
      kostId,
      kostName,
      kostImage,
      userId: req.user.id,
      userName,
      userPhone,
      userEmail,
      startDate,
      surveyTime,
      duration,
      totalPrice,
      status: 'Pending',
      bookingDate,
      paymentMethod
    };
    sendBookingConfirmation(userEmail, newBooking).catch(console.error);

    res.status(201).json({ message: 'Booking created successfully' });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update Booking Status (Protected, Owner only)
router.put('/bookings/:id/status', requireAuth, async (req: any, res: any) => {
  if (req.user.role?.toLowerCase() !== 'owner') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const { status } = req.body; // 'Disetujui' | 'Ditolak' | 'Penyewa'
    const bookingId = req.params.id;
    const db = getDb();

    await db.query('UPDATE bookings SET status = $1 WHERE id = $2', [status, bookingId]);

    // If status changed to 'Penyewa' (Fiks Tinggal), decrement available rooms and auto-record income transaction!
    if (status === 'Penyewa') {
      const bookingRes = await db.query('SELECT * FROM bookings WHERE id = $1', [bookingId]);
      if (bookingRes.rows.length > 0) {
        const booking = bookingRes.rows[0];
        await db.query('UPDATE kosts SET "availableRooms" = GREATEST("availableRooms" - 1, 0) WHERE id = $1', [booking.kostId]);
        
        // Auto-record booking total price as Income in financial_transactions!
        const todayStr = new Date().toISOString().split('T')[0]; // 'YYYY-MM-DD'
        await db.query(`
          INSERT INTO financial_transactions ("ownerId", "kostId", type, amount, category, description, date, "createdAt")
          VALUES ($1, $2, 'Income', $3, 'Sewa Kamar', $4, $5, $6)
        `, [
          req.user.id,
          booking.kostId,
          booking.totalPrice,
          `Reservasi Otomatis: ${booking.userName} - ${booking.kostName}`,
          todayStr,
          Date.now()
        ]);
      }
    }

    // Fetch booking details to send status update email
    db.query('SELECT * FROM bookings WHERE id = $1', [bookingId])
      .then(result => {
        if (result.rows.length > 0) {
          const booking = result.rows[0];
          sendBookingStatusUpdate(booking.userEmail, booking, status).catch(console.error);
        }
      })
      .catch(console.error);

    res.json({ message: `Booking ${status}` });
  } catch (error) {
    console.error('Error updating booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cancel Booking (Protected, User cancels own pending booking by status update)
router.patch('/bookings/:id', requireAuth, async (req: any, res: any) => {
  try {
    const bookingId = req.params.id;
    const { status } = req.body;
    const db = getDb();

    if (status !== 'Dibatalkan') {
      return res.status(400).json({ error: 'Regular users can only cancel bookings' });
    }

    // Verify ownership and status
    const check = await db.query('SELECT "userId", status FROM bookings WHERE id = $1', [bookingId]);
    if (check.rows.length === 0) return res.status(404).json({ error: 'Booking not found' });

    const booking = check.rows[0];

    // Users can only cancel their own bookings
    if (booking.userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: Not your booking' });
    }

    // Only Pending bookings can be cancelled
    if (booking.status !== 'Pending') {
      return res.status(400).json({ error: 'Hanya booking berstatus Pending yang dapat dibatalkan' });
    }

    await db.query('UPDATE bookings SET status = \'Dibatalkan\' WHERE id = $1', [bookingId]);

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Cancel/Delete Booking (Protected, User cancels own pending booking)
router.delete('/bookings/:id', requireAuth, async (req: any, res: any) => {
  try {
    const bookingId = req.params.id;
    const db = getDb();

    // Verify ownership and status
    const check = await db.query('SELECT "userId", status FROM bookings WHERE id = $1', [bookingId]);
    if (check.rows.length === 0) return res.status(404).json({ error: 'Booking not found' });

    const booking = check.rows[0];

    // Users can only cancel their own bookings
    if (booking.userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: Not your booking' });
    }

    // Only Pending bookings can be cancelled
    if (booking.status !== 'Pending') {
      return res.status(400).json({ error: 'Hanya booking berstatus Pending yang dapat dibatalkan' });
    }

    await db.query('DELETE FROM bookings WHERE id = $1', [bookingId]);

    res.json({ message: 'Booking cancelled successfully' });
  } catch (error) {
    console.error('Error cancelling booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// =======================
// HERO BANNERS API
// =======================

// Get all banners (Public)
router.get('/banners', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.query('SELECT * FROM hero_banners ORDER BY "order" ASC, id ASC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching banners:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a new banner (Protected, Owner only)
router.post('/banners', requireAuth, async (req: any, res: any) => {
  if (req.user.role?.toLowerCase() !== 'owner') {
    return res.status(403).json({ error: 'Forbidden: Only owners can manage banners' });
  }

  try {
    const { title, subtitle, image, order } = req.body;
    const db = getDb();
    
    await db.query(`
      INSERT INTO hero_banners (title, subtitle, image, "order")
      VALUES ($1, $2, $3, $4)
    `, [title, subtitle, image, order || 0]);

    res.status(201).json({ message: 'Banner added successfully' });
  } catch (error) {
    console.error('Error adding banner:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Edit banner (Protected, Owner only)
router.put('/banners/:id', requireAuth, async (req: any, res: any) => {
  if (req.user.role?.toLowerCase() !== 'owner') {
    return res.status(403).json({ error: 'Forbidden: Only owners can manage banners' });
  }

  try {
    const bannerId = parseInt(req.params.id);
    const { title, subtitle, image, order } = req.body;
    const db = getDb();

    await db.query(`
      UPDATE hero_banners SET 
        title = $1, subtitle = $2, image = $3, "order" = $4
      WHERE id = $5
    `, [title, subtitle, image, order || 0, bannerId]);

    res.json({ message: 'Banner updated successfully' });
  } catch (error) {
    console.error('Error updating banner:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete banner (Protected, Owner only)
router.delete('/banners/:id', requireAuth, async (req: any, res: any) => {
  if (req.user.role?.toLowerCase() !== 'owner') {
    return res.status(403).json({ error: 'Forbidden: Only owners can manage banners' });
  }

  try {
    const bannerId = parseInt(req.params.id);
    const db = getDb();

    await db.query('DELETE FROM hero_banners WHERE id = $1', [bannerId]);

    res.json({ message: 'Banner deleted successfully' });
  } catch (error) {
    console.error('Error deleting banner:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// =======================
// FINANCIAL TRANSACTIONS API
// =======================

// Get all transactions for Owner (Protected)
router.get('/transactions', requireAuth, async (req: any, res: any) => {
  if (req.user.role?.toLowerCase() !== 'owner') {
    return res.status(403).json({ error: 'Forbidden: Only owners can access transactions' });
  }

  try {
    const db = getDb();
    const result = await db.query(
      'SELECT * FROM financial_transactions WHERE "ownerId" = $1 ORDER BY date DESC, id DESC',
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching transactions:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Add a transaction (Protected, Owner only)
router.post('/transactions', requireAuth, async (req: any, res: any) => {
  if (req.user.role?.toLowerCase() !== 'owner') {
    return res.status(403).json({ error: 'Forbidden: Only owners can manage transactions' });
  }

  try {
    const { type, amount, category, description, date, kostId } = req.body;
    const db = getDb();

    if (!type || !amount || !category || !date) {
      return res.status(400).json({ error: 'Missing required transaction fields' });
    }

    const result = await db.query(`
      INSERT INTO financial_transactions ("ownerId", "kostId", type, amount, category, description, date, "createdAt")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
      RETURNING *
    `, [req.user.id, kostId || null, type, amount, category, description || '', date, Date.now()]);

    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error adding transaction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Edit a transaction (Protected, Owner only)
router.put('/transactions/:id', requireAuth, async (req: any, res: any) => {
  if (req.user.role?.toLowerCase() !== 'owner') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const txId = parseInt(req.params.id);
    const { type, amount, category, description, date, kostId } = req.body;
    const db = getDb();

    // Verify ownership
    const check = await db.query('SELECT "ownerId" FROM financial_transactions WHERE id = $1', [txId]);
    if (check.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    if (check.rows[0].ownerId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: Not your transaction' });
    }

    const result = await db.query(`
      UPDATE financial_transactions SET
        type = $1, amount = $2, category = $3, description = $4, date = $5, "kostId" = $6
      WHERE id = $7
      RETURNING *
    `, [type, amount, category, description || '', date, kostId || null, txId]);

    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error updating transaction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Delete a transaction (Protected, Owner only)
router.delete('/transactions/:id', requireAuth, async (req: any, res: any) => {
  if (req.user.role?.toLowerCase() !== 'owner') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const txId = parseInt(req.params.id);
    const db = getDb();

    // Verify ownership
    const check = await db.query('SELECT "ownerId" FROM financial_transactions WHERE id = $1', [txId]);
    if (check.rows.length === 0) {
      return res.status(404).json({ error: 'Transaction not found' });
    }
    if (check.rows[0].ownerId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: Not your transaction' });
    }

    await db.query('DELETE FROM financial_transactions WHERE id = $1', [txId]);
    res.json({ message: 'Transaction deleted successfully' });
  } catch (error) {
    console.error('Error deleting transaction:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/bookings/:id', requireAuth, async (req, res) => {
  try {
    const { id } = req.params;
    const db = getDb();
    const result = await db.query('SELECT * FROM bookings WHERE id = $1', [id]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error fetching booking details:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// =======================
// PROMOS API (CRUD)
// =======================
router.get('/promos', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.query('SELECT * FROM promos ORDER BY id DESC');
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching promos:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/promos', requireAuth, async (req: any, res: any) => {
  if (req.user.role?.toLowerCase() !== 'owner') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  try {
    const { code, discountPercent, title, description, expiresAt } = req.body;
    if (!code || !discountPercent || !title || !expiresAt) {
      return res.status(400).json({ error: 'Missing required fields for promo creation' });
    }
    const db = getDb();
    const result = await db.query(
      `INSERT INTO promos (code, "discountPercent", title, description, "expiresAt")
       VALUES ($1, $2, $3, $4, $5) RETURNING *`,
      [code.toUpperCase(), discountPercent, title, description || '', expiresAt]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error creating promo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/promos/:id', requireAuth, async (req: any, res: any) => {
  if (req.user.role?.toLowerCase() !== 'owner') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  try {
    const promoId = parseInt(req.params.id);
    const { code, discountPercent, title, description, expiresAt } = req.body;
    const db = getDb();
    const result = await db.query(
      `UPDATE promos SET code = $1, "discountPercent" = $2, title = $3, description = $4, "expiresAt" = $5
       WHERE id = $6 RETURNING *`,
      [code.toUpperCase(), discountPercent, title, description || '', expiresAt, promoId]
    );
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Promo not found' });
    }
    res.json(result.rows[0]);
  } catch (error) {
    console.error('Error editing promo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.delete('/promos/:id', requireAuth, async (req: any, res: any) => {
  if (req.user.role?.toLowerCase() !== 'owner') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  try {
    const promoId = parseInt(req.params.id);
    const db = getDb();
    const result = await db.query('DELETE FROM promos WHERE id = $1 RETURNING *', [promoId]);
    if (result.rows.length === 0) {
      return res.status(404).json({ error: 'Promo not found' });
    }
    res.json({ message: 'Promo deleted successfully' });
  } catch (error) {
    console.error('Error deleting promo:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// =======================
// REVIEWS API
// =======================
router.get('/kosts/:id/reviews', async (req, res) => {
  try {
    const kostId = req.params.id;
    const db = getDb();
    const result = await db.query(
      `SELECT r.*, u.name as "userName", u.image as "userImage"
       FROM reviews r
       JOIN users u ON r."userId" = u.id
       WHERE r."kostId" = $1 ORDER BY r.id DESC`,
      [kostId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching reviews:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/reviews', async (req, res) => {
  try {
    const db = getDb();
    const result = await db.query(
      `SELECT r.*, u.name as "userName", u.image as "userImage", k.name as "kostName"
       FROM reviews r
       JOIN users u ON r."userId" = u.id
       JOIN kosts k ON r."kostId" = k.id
       ORDER BY r.id DESC`
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching all reviews:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.post('/reviews', requireAuth, async (req: any, res: any) => {
  try {
    const { kostId, rating, mood, comment, tipAmount } = req.body;
    const userId = req.user.id;
    if (!kostId || !rating) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const db = getDb();
    
    // Insert review
    const result = await db.query(
      `INSERT INTO reviews ("kostId", "userId", rating, mood, comment, "tipAmount", "createdAt")
       VALUES ($1, $2, $3, $4, $5, $6, $7) RETURNING *`,
      [kostId, userId, rating, mood || '', comment || '', tipAmount || 0, Date.now()]
    );

    // Update Kost Rating & ReviewsCount in kosts table
    const ratingsRes = await db.query('SELECT rating FROM reviews WHERE "kostId" = $1', [kostId]);
    const totalReviews = ratingsRes.rows.length;
    const avgRating = ratingsRes.rows.reduce((sum, r) => sum + r.rating, 0) / totalReviews;

    await db.query(
      'UPDATE kosts SET rating = $1, "reviewsCount" = $2 WHERE id = $3',
      [parseFloat(avgRating.toFixed(1)), totalReviews, kostId]
    );

    // Fetch review with rich user data
    const richRes = await db.query(
      `SELECT r.*, u.name as "userName", u.image as "userImage"
       FROM reviews r
       JOIN users u ON r."userId" = u.id
       WHERE r.id = $1`,
      [result.rows[0].id]
    );

    res.status(201).json(richRes.rows[0]);
  } catch (error) {
    console.error('Error creating review:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// =======================
// TENANT REQUESTS API
// =======================
router.post('/tenant-requests', requireAuth, async (req: any, res: any) => {
  try {
    const { kostId, type, details } = req.body;
    const userId = req.user.id;
    if (!kostId || !type || !details) {
      return res.status(400).json({ error: 'Missing required fields' });
    }
    const db = getDb();
    const result = await db.query(
      `INSERT INTO tenant_requests ("userId", "kostId", type, details, status, "createdAt")
       VALUES ($1, $2, $3, $4, 'Pending', $5) RETURNING *`,
      [userId, kostId, type, JSON.stringify(details), Date.now()]
    );
    res.status(201).json(result.rows[0]);
  } catch (error) {
    console.error('Error sending tenant request:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/tenant-requests/user', requireAuth, async (req: any, res: any) => {
  try {
    const userId = req.user.id;
    const db = getDb();
    const result = await db.query(
      `SELECT tr.*, k.name as "kostName"
       FROM tenant_requests tr
       JOIN kosts k ON tr."kostId" = k.id
       WHERE tr."userId" = $1 ORDER BY tr.id DESC`,
      [userId]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching user tenant requests:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.get('/tenant-requests/owner', requireAuth, async (req: any, res: any) => {
  if (req.user.role?.toLowerCase() !== 'owner') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  try {
    const db = getDb();
    const result = await db.query(
      `SELECT tr.*, u.name as "userName", u.phone as "userPhone", k.name as "kostName"
       FROM tenant_requests tr
       JOIN users u ON tr."userId" = u.id
       JOIN kosts k ON tr."kostId" = k.id
       WHERE k."ownerId" = $1 OR k."ownerId" IS NULL
       ORDER BY tr.id DESC`,
      [req.user.id]
    );
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching owner tenant requests:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

router.put('/tenant-requests/:id/status', requireAuth, async (req: any, res: any) => {
  if (req.user.role?.toLowerCase() !== 'owner') {
    return res.status(403).json({ error: 'Forbidden' });
  }
  try {
    const requestId = parseInt(req.params.id);
    const { status } = req.body; // 'Approved' | 'Rejected'
    const db = getDb();

    const requestRes = await db.query('SELECT * FROM tenant_requests WHERE id = $1', [requestId]);
    if (requestRes.rows.length === 0) {
      return res.status(404).json({ error: 'Request not found' });
    }
    const request = requestRes.rows[0];

    await db.query('UPDATE tenant_requests SET status = $1 WHERE id = $2', [status, requestId]);

    // Additional side logic if approved
    if (status === 'Approved') {
      if (request.type === 'Checkout') {
        // Find user's active booking at that kost and change status to 'Selesai'
        await db.query(
          `UPDATE bookings SET status = 'Selesai' 
           WHERE "userId" = $1 AND "kostId" = $2 AND status = 'Penyewa'`,
          [request.userId, request.kostId]
        );
        // Increment available rooms
        await db.query('UPDATE kosts SET "availableRooms" = LEAST("availableRooms" + 1, "totalRooms") WHERE id = $1', [request.kostId]);
      } else if (request.type === 'Extension') {
        // Update user's active booking duration
        const durationMonths = request.details.months || 1;
        await db.query(
          `UPDATE bookings SET duration = duration + $1
           WHERE "userId" = $2 AND "kostId" = $3 AND status = 'Penyewa'`,
          [durationMonths, request.userId, request.kostId]
        );
      }
    }

    res.json({ message: `Request successfully ${status}` });
  } catch (error) {
    console.error('Error updating tenant request status:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// =======================
// KOST INFO API
// =======================
router.get('/kost-info/:kostId', async (req, res) => {
  try {
    const { kostId } = req.params;
    const db = getDb();
    const result = await db.query('SELECT * FROM kost_info WHERE "kostId" = $1', [kostId]);
    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching kost info:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
