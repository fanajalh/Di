import pkg from 'pg';
import dotenv from 'dotenv';

dotenv.config();
const { Pool } = pkg;

if (!process.env.DATABASE_URL) {
  console.warn('⚠️ WARNING: DATABASE_URL is not defined in environment variables.');
}

const connectionString = process.env.DATABASE_URL || '';

const pool = new Pool({
  connectionString,
  ssl: {
    rejectUnauthorized: false // Required for Neon DB
  },
  max: 20,                  // Maximum number of connections in the pool
  idleTimeoutMillis: 30000, // Close idle connections after 30 seconds
  connectionTimeoutMillis: 2000 // Return error if connection takes more than 2 seconds
});

// Provide a getter so we can use the pool easily
export const getDb = () => pool;

export async function initDb() {
  try {
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id SERIAL PRIMARY KEY,
        name VARCHAR(255) NOT NULL,
        email VARCHAR(255) UNIQUE NOT NULL,
        password VARCHAR(255) NOT NULL,
        role VARCHAR(50) DEFAULT 'User',
        phone VARCHAR(50),
        address TEXT,
        bio TEXT,
        "joinedDate" VARCHAR(50),
        image TEXT
      );

      CREATE TABLE IF NOT EXISTS otps (
        id SERIAL PRIMARY KEY,
        email VARCHAR(255) NOT NULL,
        otp VARCHAR(10) NOT NULL,
        "expiresAt" BIGINT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS kosts (
        id VARCHAR(50) PRIMARY KEY,
        "ownerId" INTEGER REFERENCES users(id),
        name VARCHAR(255) NOT NULL,
        type VARCHAR(50) NOT NULL,
        "roomClass" VARCHAR(50) NOT NULL,
        price INTEGER NOT NULL,
        rating FLOAT NOT NULL,
        "reviewsCount" INTEGER DEFAULT 0,
        location VARCHAR(100) NOT NULL,
        image TEXT NOT NULL,
        facilities JSONB NOT NULL,
        "availableRooms" INTEGER NOT NULL,
        "totalRooms" INTEGER NOT NULL,
        description TEXT NOT NULL,
        address TEXT NOT NULL,
        author VARCHAR(100) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS bookings (
        id VARCHAR(50) PRIMARY KEY,
        "kostId" VARCHAR(50) REFERENCES kosts(id),
        "kostName" VARCHAR(255) NOT NULL,
        "kostImage" TEXT NOT NULL,
        "userId" INTEGER REFERENCES users(id),
        "userName" VARCHAR(100) NOT NULL,
        "userPhone" VARCHAR(50) NOT NULL,
        "startDate" VARCHAR(50) NOT NULL,
        duration INTEGER NOT NULL,
        "totalPrice" INTEGER NOT NULL,
        status VARCHAR(50) DEFAULT 'Pending',
        "bookingDate" VARCHAR(50) NOT NULL,
        "paymentMethod" VARCHAR(50) NOT NULL
      );

      CREATE TABLE IF NOT EXISTS hero_banners (
        id SERIAL PRIMARY KEY,
        title VARCHAR(255) NOT NULL,
        subtitle VARCHAR(255) NOT NULL,
        image TEXT NOT NULL,
        "order" INTEGER DEFAULT 0
      );

      -- Create indexes to make data retrieval extremely fast
      CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_otps_email_otp ON otps(email, otp);
      CREATE INDEX IF NOT EXISTS idx_kosts_owner_id ON kosts("ownerId");
      CREATE INDEX IF NOT EXISTS idx_bookings_user_date ON bookings("userId", "bookingDate" DESC);
      CREATE INDEX IF NOT EXISTS idx_bookings_kost_id ON bookings("kostId");
      CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings("bookingDate" DESC);
      CREATE INDEX IF NOT EXISTS idx_hero_banners_order ON hero_banners("order" ASC, id ASC);
    `);
    
    // Auto-migrate new column if it doesn't exist
    try {
      await pool.query(`ALTER TABLE kosts ADD COLUMN IF NOT EXISTS "additionalImages" JSONB;`);
      console.log('Migrasi kolom additionalImages selesai.');
    } catch (err) {
      console.error('Migration info: ', err);
    }

    // Check if seeding is needed for kosts
    const { rows } = await pool.query('SELECT COUNT(*) FROM kosts');
    if (parseInt(rows[0].count) === 0) {
      console.log('Seeding initial Kost data...');
      const seedData = [
        ['kost-1', null, 'Kost Executive President Suite Thamrin', 'Campur', 'Eksklusif', 3800000, 4.9, 32, 'Jakarta', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80', JSON.stringify(['WiFi', 'AC', 'Springbed', 'Kamar Mandi Dalam', 'Meja', 'Lemari']), 1, 15, 'Menawarkan kamar eksklusif dengan fasilitas setara hotel bintang 5 tepat di jantung distrik Thamrin, Jakarta Pusat.', 'Jl. Thamrin Boulevard No 45, Jakarta Pusat', 'Ahmad Gede'],
        ['kost-2', null, "Kost D'Dago Hills View Wood", 'Putri', 'VIP', 2600000, 4.8, 18, 'Bandung', 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80', JSON.stringify(['WiFi', 'AC', 'Springbed', 'Kamar Mandi Dalam', 'Meja', 'Lemari']), 3, 10, 'Kost khusus putri di kawasan sejuk Dago Atas, Bandung. Menyajikan pemandangan kota.', 'Jl. Dago Giri No 82, Dago, Bandung', 'Ahmad Gede']
      ];

      for (const kost of seedData) {
        await pool.query(`
          INSERT INTO kosts (id, "ownerId", name, type, "roomClass", price, rating, "reviewsCount", location, image, facilities, "availableRooms", "totalRooms", description, address, author)
          VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16)
        `, kost);
      }
    }

    // Seeding hero banners if empty
    const bannerCheck = await pool.query('SELECT COUNT(*) FROM hero_banners');
    if (parseInt(bannerCheck.rows[0].count) === 0) {
      console.log('Seeding initial Hero Banners...');
      const seedBanners = [
        ['Elegance & Comfort', 'Pilihan kamar kost premium berkelas dengan fasilitas lengkap untuk kenyamanan hidup Anda.', 'https://images.unsplash.com/photo-1522771739844-6a9f6d5f14af?auto=format&fit=crop&w=800&q=80', 0],
        ['Premium Living Spaces', 'Desain arsitektur modern minimalis yang memaksimalkan setiap ruang secara fungsional.', 'https://images.unsplash.com/photo-1505691938895-1758d7feb511?auto=format&fit=crop&w=800&q=80', 1],
        ['Strategis & Aman', 'Keamanan 24 jam dengan Smart Lock dan berlokasi di pusat bisnis perkotaan.', 'https://images.unsplash.com/photo-1513694203232-719a280e022f?auto=format&fit=crop&w=800&q=80', 2]
      ];

      for (const banner of seedBanners) {
        await pool.query(`
          INSERT INTO hero_banners (title, subtitle, image, "order")
          VALUES ($1, $2, $3, $4)
        `, banner);
      }
    }
    
    console.log('Neon Database initialized successfully.');
  } catch (err) {
    console.error('Failed to initialize Neon Database:', err);
  }
}
