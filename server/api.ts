import express from 'express';
import jsonwebtoken from 'jsonwebtoken';
import { getDb } from './db.js';

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
  if (req.user.role !== 'Owner') {
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
  if (req.user.role !== 'Owner') {
    return res.status(403).json({ error: 'Forbidden: Only owners can edit properties' });
  }

  try {
    const kostId = req.params.id;
    const { name, type, roomClass, price, location, image, additionalImages, facilities, availableRooms, totalRooms, description, address } = req.body;
    const db = getDb();

    // Verify ownership (allow if ownerId is null for seed data)
    const check = await db.query('SELECT "ownerId" FROM kosts WHERE id = $1', [kostId]);
    if (check.rows.length === 0) return res.status(404).json({ error: 'Kost not found' });
    if (check.rows[0].ownerId !== null && check.rows[0].ownerId !== req.user.id) {
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
  if (req.user.role !== 'Owner') {
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

    if (req.user.role === 'User') {
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

// Create a Booking (Protected, User only)
router.post('/bookings', requireAuth, async (req: any, res: any) => {
  try {
    const { id, kostId, kostName, kostImage, userName, userPhone, startDate, duration, totalPrice, bookingDate, paymentMethod } = req.body;
    const db = getDb();
    
    await db.query(`
      INSERT INTO bookings (id, "kostId", "kostName", "kostImage", "userId", "userName", "userPhone", "startDate", duration, "totalPrice", status, "bookingDate", "paymentMethod")
      VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, 'Pending', $11, $12)
    `, [id, kostId, kostName, kostImage, req.user.id, userName, userPhone, startDate, duration, totalPrice, bookingDate, paymentMethod]);

    res.status(201).json({ message: 'Booking created successfully' });
  } catch (error) {
    console.error('Error creating booking:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Update Booking Status (Protected, Owner only)
router.put('/bookings/:id/status', requireAuth, async (req: any, res: any) => {
  if (req.user.role !== 'Owner') {
    return res.status(403).json({ error: 'Forbidden' });
  }

  try {
    const { status } = req.body; // 'Disetujui' | 'Ditolak'
    const bookingId = req.params.id;
    const db = getDb();

    await db.query('UPDATE bookings SET status = $1 WHERE id = $2', [status, bookingId]);

    // If approved, decrement available rooms
    if (status === 'Disetujui') {
      const bookingRes = await db.query('SELECT "kostId" FROM bookings WHERE id = $1', [bookingId]);
      if (bookingRes.rows.length > 0) {
        await db.query('UPDATE kosts SET "availableRooms" = GREATEST("availableRooms" - 1, 0) WHERE id = $1', [bookingRes.rows[0].kostId]);
      }
    }

    res.json({ message: `Booking ${status}` });
  } catch (error) {
    console.error('Error updating booking:', error);
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
  if (req.user.role !== 'Owner') {
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
  if (req.user.role !== 'Owner') {
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
  if (req.user.role !== 'Owner') {
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

export default router;
