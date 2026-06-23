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
  connectionTimeoutMillis: 10000 // Return error if connection takes more than 10 seconds
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

      CREATE TABLE IF NOT EXISTS financial_transactions (
        id SERIAL PRIMARY KEY,
        "ownerId" INTEGER REFERENCES users(id),
        "kostId" VARCHAR(50),
        type VARCHAR(50) NOT NULL,
        amount INTEGER NOT NULL,
        category VARCHAR(100) NOT NULL,
        description TEXT,
        date VARCHAR(50) NOT NULL,
        "createdAt" BIGINT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS messages (
        id SERIAL PRIMARY KEY,
        "senderId" INTEGER REFERENCES users(id) ON DELETE CASCADE,
        "receiverId" INTEGER REFERENCES users(id) ON DELETE CASCADE,
        "bookingId" VARCHAR(50) REFERENCES bookings(id) ON DELETE CASCADE,
        message TEXT NOT NULL,
        "createdAt" BIGINT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS promos (
        id SERIAL PRIMARY KEY,
        code VARCHAR(50) UNIQUE NOT NULL,
        "discountPercent" INTEGER NOT NULL,
        title VARCHAR(255) NOT NULL,
        description TEXT,
        "expiresAt" BIGINT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS reviews (
        id SERIAL PRIMARY KEY,
        "kostId" VARCHAR(50) REFERENCES kosts(id) ON DELETE CASCADE,
        "userId" INTEGER REFERENCES users(id) ON DELETE CASCADE,
        rating INTEGER NOT NULL CHECK (rating >= 1 AND rating <= 5),
        mood VARCHAR(50),
        comment TEXT,
        "tipAmount" INTEGER DEFAULT 0,
        "createdAt" BIGINT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS tenant_requests (
        id SERIAL PRIMARY KEY,
        "userId" INTEGER REFERENCES users(id) ON DELETE CASCADE,
        "kostId" VARCHAR(50) REFERENCES kosts(id) ON DELETE CASCADE,
        type VARCHAR(50) NOT NULL,
        details JSONB NOT NULL,
        status VARCHAR(50) DEFAULT 'Pending',
        "createdAt" BIGINT NOT NULL
      );

      CREATE TABLE IF NOT EXISTS kost_info (
        id SERIAL PRIMARY KEY,
        "kostId" VARCHAR(50) REFERENCES kosts(id) ON DELETE CASCADE,
        category VARCHAR(50) NOT NULL,
        data JSONB NOT NULL
      );

      -- Create indexes to make data retrieval extremely fast
      CREATE UNIQUE INDEX IF NOT EXISTS idx_users_email ON users(email);
      CREATE INDEX IF NOT EXISTS idx_otps_email_otp ON otps(email, otp);
      CREATE INDEX IF NOT EXISTS idx_kosts_owner_id ON kosts("ownerId");
      CREATE INDEX IF NOT EXISTS idx_bookings_user_date ON bookings("userId", "bookingDate" DESC);
      CREATE INDEX IF NOT EXISTS idx_bookings_kost_id ON bookings("kostId");
      CREATE INDEX IF NOT EXISTS idx_bookings_date ON bookings("bookingDate" DESC);
      CREATE INDEX IF NOT EXISTS idx_hero_banners_order ON hero_banners("order" ASC, id ASC);
      CREATE INDEX IF NOT EXISTS idx_financial_transactions_owner ON financial_transactions("ownerId");
      CREATE INDEX IF NOT EXISTS idx_financial_transactions_date ON financial_transactions(date);
      CREATE INDEX IF NOT EXISTS idx_messages_booking ON messages("bookingId");
      CREATE UNIQUE INDEX IF NOT EXISTS idx_promos_code ON promos(code);
      CREATE INDEX IF NOT EXISTS idx_reviews_kost ON reviews("kostId");
      CREATE INDEX IF NOT EXISTS idx_tenant_requests_user ON tenant_requests("userId");
      CREATE INDEX IF NOT EXISTS idx_kost_info_kost ON kost_info("kostId", category);
    `);
    
    // Auto-migrate new column if it doesn't exist
    try {
      await pool.query(`ALTER TABLE kosts ADD COLUMN IF NOT EXISTS "additionalImages" JSONB;`);
      console.log('Migrasi kolom additionalImages selesai.');
    } catch (err) {
      console.error('Migration info: ', err);
    }

    // Auto-migrate new columns for bookings if they don't exist
    try {
      await pool.query(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS "surveyTime" VARCHAR(50);`);
      await pool.query(`ALTER TABLE bookings ADD COLUMN IF NOT EXISTS "userEmail" VARCHAR(255);`);
      console.log('Migrasi kolom bookings selesai.');
    } catch (err) {
      console.error('Migration bookings info: ', err);
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

    // Seeding transactions if empty
    const txCheck = await pool.query('SELECT COUNT(*) FROM financial_transactions');
    if (parseInt(txCheck.rows[0].count) === 0) {
      const ownerRes = await pool.query("SELECT id FROM users WHERE LOWER(role) = 'owner' LIMIT 1");
      let ownerId = null;
      if (ownerRes.rows.length > 0) {
        ownerId = ownerRes.rows[0].id;
      }
      
      console.log('Seeding initial financial transactions...');
      const sampleTxs = [
        [ownerId, 'Income', 38000000, 'Sewa Kamar', 'Pemasukan sewa kamar bulanan', '2026-01-15'],
        [ownerId, 'Expense', 5000000, 'Gaji Karyawan', 'Gaji penjaga kost & kebersihan', '2026-01-28'],
        [ownerId, 'Expense', 3000000, 'Listrik & Air', 'Listrik PLN & PDAM', '2026-01-25'],
        
        [ownerId, 'Income', 42000000, 'Sewa Kamar', 'Pemasukan sewa kamar bulanan', '2026-02-15'],
        [ownerId, 'Expense', 5000000, 'Gaji Karyawan', 'Gaji penjaga kost & kebersihan', '2026-02-28'],
        [ownerId, 'Expense', 5000000, 'Maintenance', 'Perbaikan pompa air & service AC', '2026-02-20'],
        
        [ownerId, 'Income', 49000000, 'Sewa Kamar', 'Pemasukan sewa kamar bulanan', '2026-03-15'],
        [ownerId, 'Expense', 5000000, 'Gaji Karyawan', 'Gaji penjaga kost & kebersihan', '2026-03-28'],
        [ownerId, 'Expense', 4000000, 'Listrik & Air', 'Listrik PLN & PDAM', '2026-03-25'],
        [ownerId, 'Expense', 3000000, 'Lain-lain', 'Pembelian sabun & air minum', '2026-03-18'],
        
        [ownerId, 'Income', 54000000, 'Sewa Kamar', 'Pemasukan sewa kamar bulanan', '2026-04-15'],
        [ownerId, 'Expense', 5000000, 'Gaji Karyawan', 'Gaji penjaga kost & kebersihan', '2026-04-28'],
        [ownerId, 'Expense', 3500000, 'Listrik & Air', 'Listrik PLN & PDAM', '2026-04-25'],
        [ownerId, 'Expense', 2500000, 'Maintenance', 'Pengecatan pagar depan', '2026-04-10'],
        
        [ownerId, 'Income', 68000000, 'Sewa Kamar', 'Pemasukan sewa kamar bulanan', '2026-05-15'],
        [ownerId, 'Expense', 5000000, 'Gaji Karyawan', 'Gaji penjaga kost & kebersihan', '2026-05-28'],
        [ownerId, 'Expense', 4500000, 'Listrik & Air', 'Listrik PLN & PDAM', '2026-05-25'],
        [ownerId, 'Expense', 5500000, 'Maintenance', 'Taman & genteng bocor', '2026-05-12'],
        
        [ownerId, 'Income', 75000000, 'Sewa Kamar', 'Pemasukan sewa kamar bulanan', '2026-06-12'],
        [ownerId, 'Expense', 5000000, 'Gaji Karyawan', 'Gaji penjaga kost & kebersihan', '2026-06-28'],
        [ownerId, 'Expense', 5000000, 'Listrik & Air', 'Listrik PLN & PDAM', '2026-06-25'],
        [ownerId, 'Expense', 7000000, 'Maintenance', 'Kasur baru kamar 4 & 7', '2026-06-10']
      ];

      for (const tx of sampleTxs) {
        await pool.query(`
          INSERT INTO financial_transactions ("ownerId", type, amount, category, description, date, "createdAt")
          VALUES ($1, $2, $3, $4, $5, $6, $7)
        `, [...tx, Date.now()]);
      }
    }

    // Seeding Promos
    const promoCheck = await pool.query('SELECT COUNT(*) FROM promos');
    if (parseInt(promoCheck.rows[0].count) === 0) {
      console.log('Seeding initial Promos...');
      const samplePromos = [
        ['DIHEMAT35', 35, 'Diskon Spesial Akhir Pekan', 'Dapatkan potongan 35% untuk semua pemesanan survey kost terpilih', Date.now() + 30 * 24 * 60 * 60 * 1000],
        ['CASHBACK10', 10, 'Promo Cashback 10%', 'Cashback 10% langsung dikreditkan setelah survey terverifikasi', Date.now() + 30 * 24 * 60 * 60 * 1000]
      ];
      for (const promo of samplePromos) {
        await pool.query(`
          INSERT INTO promos (code, "discountPercent", title, description, "expiresAt")
          VALUES ($1, $2, $3, $4, $5)
        `, promo);
      }
    }

    // Seeding Kost Info (SSID, Laundry, Kebersihan, Panduan)
    const infoCheck = await pool.query('SELECT COUNT(*) FROM kost_info');
    if (parseInt(infoCheck.rows[0].count) === 0) {
      console.log('Seeding initial Kost Info for default properties...');
      const defaultKosts = ['kost-1', 'kost-2'];
      for (const kId of defaultKosts) {
        const checkKost = await pool.query('SELECT id FROM kosts WHERE id = $1', [kId]);
        if (checkKost.rows.length === 0) {
          console.log(`Skipping seeding kost_info for ${kId} as it is not present in kosts table.`);
          continue;
        }
        const infoData = [
          // Wifi
          [kId, 'Wifi', JSON.stringify({ ssid: `DI_NET_${kId.toUpperCase()}`, password: 'premiumliving123', status: 'Online', speed: '100 Mbps' })],
          // Maintenance / Kebersihan
          [kId, 'Maintenance', JSON.stringify({
            schedule: [
              { task: 'Pembersihan Area Bersama', day: 'Rabu', time: '10:00' },
              { task: 'Pembersihan Kamar', day: 'Sabtu', time: '13:00' },
              { task: 'Pengecekan AC Rutin', date: '2026-07-05', time: '11:00' }
            ]
          })],
          // Nearby Places
          [kId, 'Nearby', JSON.stringify({
            places: [
              { name: 'Warung Nasi Sederhana', distance: '120m', type: 'Warung Makan' },
              { name: 'Di-Clean Laundry & Press', distance: '250m', type: 'Laundry' },
              { name: 'AlfaMinimart 24 Jam', distance: '180m', type: 'Minimarket' },
              { name: 'Klinik Bakti Medika', distance: '450m', type: 'Klinik Terdekat' }
            ]
          })],
          // Facility Guides
          [kId, 'Guides', JSON.stringify({
            guides: [
              { title: 'Panduan AC Kamar', steps: ['Gunakan remote AC untuk menyalakan/mematikan.', 'Suhu ideal adalah 22-24 derajat Celcius.', 'Matikan AC saat Anda meninggalkan kamar demi penghematan energi.'] },
              { title: 'Panduan Smart Lock Pintar', steps: ['Sentuh keypad untuk menyalakan layar kunci.', 'Masukkan pin 6 digit atau tempelkan kartu kartu akses.', 'Pintu otomatis terkunci setelah ditutup selama 3 detik.'] },
              { title: 'Panduan Dapur Bersama', steps: ['Kompor gas/induksi dapat digunakan bebas.', 'Harap bersihkan peralatan masak setelah selesai digunakan.', 'Labeli makanan Anda yang disimpan di kulkas bersama.'] }
            ]
          })]
        ];
        for (const info of infoData) {
          await pool.query(`
            INSERT INTO kost_info ("kostId", category, data)
            VALUES ($1, $2, $3)
          `, info);
        }
      }
    }
    
    console.log('Neon Database initialized successfully.');
  } catch (err) {
    console.error('Failed to initialize Neon Database:', err);
  }
}
