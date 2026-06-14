import express from 'express';
import bcrypt from 'bcryptjs';
import jsonwebtoken from 'jsonwebtoken';
import { getDb } from './db.js';

const router = express.Router();

if (!process.env.JWT_SECRET) {
  console.warn('⚠️ WARNING: JWT_SECRET is not defined in environment variables.');
}
const JWT_SECRET = process.env.JWT_SECRET as string;

// Register Route
router.post('/register', async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    
    if (!name || !email || !password) {
      return res.status(400).json({ error: 'Name, email, and password are required' });
    }

    const db = getDb();
    
    // Check if user exists
    const existingUserRes = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    if (existingUserRes.rows.length > 0) {
      return res.status(400).json({ error: 'Email already registered' });
    }

    // Hash password
    const hashedPassword = await bcrypt.hash(password, 10);
    
    // Default avatar
    const image = 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=150&q=80';
    const joinedDate = new Date().toISOString().split('T')[0];

    const insertResult = await db.query(
      `INSERT INTO users (name, email, password, role, "joinedDate", image) VALUES ($1, $2, $3, $4, $5, $6) RETURNING id`,
      [name, email, hashedPassword, role || 'User', joinedDate, image]
    );

    const newUserId = insertResult.rows[0].id;
    const token = jsonwebtoken.sign({ id: newUserId, email, role: role || 'User' }, JWT_SECRET, { expiresIn: '24h' });

    res.status(201).json({
      message: 'Registration successful',
      token,
      user: {
        id: newUserId,
        name,
        email,
        role: role || 'User',
        image,
        joinedDate
      }
    });
  } catch (error) {
    console.error('Register error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required' });
    }

    const db = getDb();
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];
    
    if (!user) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid credentials' });
    }

    const token = jsonwebtoken.sign({ id: user.id, email: user.email, role: user.role }, JWT_SECRET, { expiresIn: '24h' });

    // Remove password before sending to client
    const { password: _, ...userWithoutPassword } = user;

    res.json({
      message: 'Login successful',
      token,
      user: userWithoutPassword
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Forgot Password (Generate OTP)
router.post('/forgot-password', async (req, res) => {
  try {
    const { email } = req.body;
    const db = getDb();
    
    const result = await db.query('SELECT * FROM users WHERE email = $1', [email]);
    const user = result.rows[0];

    if (!user) {
      // Return 200 anyway to prevent email enumeration attacks
      return res.json({ message: 'If email exists, an OTP has been sent.' });
    }

    // Generate 6-digit OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    const expiresAt = Date.now() + 10 * 60 * 1000; // 10 minutes from now

    // Clean up old OTPs for this email, then insert new one
    await db.query('DELETE FROM otps WHERE email = $1', [email]);
    await db.query('INSERT INTO otps (email, otp, "expiresAt") VALUES ($1, $2, $3)', [email, otp, expiresAt]);

    // Mock Email sending
    console.log('\n=======================================');
    console.log(`✉️ MOCK EMAIL SENT TO: ${email}`);
    console.log(`🔐 YOUR OTP CODE IS: ${otp}`);
    console.log('=======================================\n');

    res.json({ message: 'If email exists, an OTP has been sent.' });
  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
  try {
    const { email, otp } = req.body;
    const db = getDb();

    const result = await db.query('SELECT * FROM otps WHERE email = $1 AND otp = $2', [email, otp]);
    const record = result.rows[0];
    
    if (!record) {
      return res.status(400).json({ error: 'Invalid OTP code' });
    }

    if (Date.now() > record.expiresAt) {
      return res.status(400).json({ error: 'OTP has expired' });
    }

    res.json({ message: 'OTP verified successfully' });
  } catch (error) {
    console.error('Verify OTP error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

// Reset Password
router.post('/reset-password', async (req, res) => {
  try {
    const { email, otp, newPassword } = req.body;
    const db = getDb();

    const result = await db.query('SELECT * FROM otps WHERE email = $1 AND otp = $2', [email, otp]);
    const record = result.rows[0];
    
    if (!record || Date.now() > record.expiresAt) {
      return res.status(400).json({ error: 'Invalid or expired OTP' });
    }

    const hashedPassword = await bcrypt.hash(newPassword, 10);
    await db.query('UPDATE users SET password = $1 WHERE email = $2', [hashedPassword, email]);
    
    // Clean up OTP
    await db.query('DELETE FROM otps WHERE email = $1', [email]);

    res.json({ message: 'Password reset successful' });
  } catch (error) {
    console.error('Reset password error:', error);
    res.status(500).json({ error: 'Internal server error' });
  }
});

export default router;
