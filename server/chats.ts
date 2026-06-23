import express from 'express';
import { getDb } from './db.js';
import { requireAuth } from './api.js';

const router = express.Router();

// Get chat history for a booking
router.get('/:bookingId', requireAuth, async (req: any, res: any) => {
  try {
    const { bookingId } = req.params;
    const db = getDb();

    // Verify if the booking exists and user is part of it (either tenant or owner)
    const bookingCheck = await db.query('SELECT "userId", "kostId" FROM bookings WHERE id = $1', [bookingId]);
    if (bookingCheck.rows.length === 0) {
      return res.status(404).json({ error: 'Booking not found' });
    }

    const booking = bookingCheck.rows[0];
    
    // Check owner of the kost
    const kostCheck = await db.query('SELECT "ownerId" FROM kosts WHERE id = $1', [booking.kostId]);
    const ownerId = kostCheck.rows.length > 0 ? kostCheck.rows[0].ownerId : null;

    if (req.user.role?.toLowerCase() !== 'owner' && booking.userId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: You cannot access this chat' });
    }

    if (req.user.role?.toLowerCase() === 'owner' && ownerId !== null && ownerId !== req.user.id) {
      return res.status(403).json({ error: 'Forbidden: You do not own this property' });
    }

    const result = await db.query(
      `SELECT m.*, u.name as "senderName", u.image as "senderImage" 
       FROM messages m
       JOIN users u ON m."senderId" = u.id
       WHERE m."bookingId" = $1
       ORDER BY m."createdAt" ASC`,
      [bookingId]
    );

    res.json(result.rows);
  } catch (error) {
    console.error('Error fetching chats:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Post a new message
router.post('/', requireAuth, async (req: any, res: any) => {
  try {
    const { bookingId, receiverId, message } = req.body;
    const senderId = req.user.id;
    const db = getDb();

    if (!bookingId || !receiverId || !message?.trim()) {
      return res.status(400).json({ error: 'Missing bookingId, receiverId, or message text' });
    }

    // Insert message
    const result = await db.query(
      `INSERT INTO messages ("senderId", "receiverId", "bookingId", message, "createdAt")
       VALUES ($1, $2, $3, $4, $5)
       RETURNING *`,
      [senderId, receiverId, bookingId, message.trim(), Date.now()]
    );

    // Fetch user details to return rich response
    const richResult = await db.query(
      `SELECT m.*, u.name as "senderName", u.image as "senderImage" 
       FROM messages m
       JOIN users u ON m."senderId" = u.id
       WHERE m.id = $1`,
      [result.rows[0].id]
    );

    res.status(201).json(richResult.rows[0]);
  } catch (error) {
    console.error('Error sending message:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
