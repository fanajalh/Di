import nodemailer from 'nodemailer';

// Helper to create SMTP transporter
const getTransporter = () => {
  const host = process.env.SMTP_HOST;
  const port = parseInt(process.env.SMTP_PORT || '587');
  const user = process.env.SMTP_USER;
  const pass = process.env.SMTP_PASS;

  if (!user || !pass) {
    return null;
  }

  return nodemailer.createTransport({
    host,
    port,
    secure: port === 465, // true for 465, false for other ports
    auth: {
      user,
      pass,
    },
  });
};

export const sendOTPEmail = async (email: string, otp: string) => {
  const transporter = getTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@kostin.com';

  const html = `
    <div style="background-color: #0A0A0A; color: #ffffff; font-family: sans-serif; padding: 40px 20px; text-align: center;">
      <div style="max-width: 500px; margin: 0 auto; background-color: #141414; border: 1px solid #2A2A2A; border-radius: 16px; padding: 32px; text-align: left; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
        <div style="font-size: 24px; font-weight: 900; letter-spacing: 0.1em; margin-bottom: 24px;">Di</div>
        <h2 style="font-size: 20px; font-weight: 300; line-height: 1.4; margin-bottom: 16px; color: #ffffff;">
          Verifikasi <span style="font-weight: 700; color: #C0C0C0;">Kode OTP Anda.</span>
        </h2>
        <p style="font-size: 13px; color: #B0B0B0; line-height: 1.6; margin-bottom: 24px;">
          Gunakan kode OTP berikut untuk melanjutkan proses reset kata sandi Anda. Kode ini berlaku selama 10 menit. Jangan bagikan kode ini kepada siapa pun.
        </p>
        <div style="background-color: #1C1C1C; border: 1px dashed #3A3A3A; border-radius: 12px; padding: 16px; text-align: center; font-size: 32px; font-weight: 900; font-family: monospace; letter-spacing: 6px; color: #ffffff; margin: 24px 0;">
          ${otp}
        </div>
        <p style="font-size: 11px; color: #606060; margin-top: 32px; border-top: 1px solid #1C1C1C; padding-top: 16px; font-family: monospace;">
          Pesan otomatis oleh Di Premium Living.
        </p>
      </div>
    </div>
  `;

  if (!transporter) {
    console.log('\n=======================================');
    console.log(`✉️ MOCK EMAIL SENT TO: ${email}`);
    console.log(`🔐 YOUR OTP CODE IS: ${otp}`);
    console.log('=======================================\n');
    return;
  }

  await transporter.sendMail({
    from,
    to: email,
    subject: `[Di Premium Living] Kode OTP Reset Password: ${otp}`,
    html,
  });
};

export const sendBookingConfirmation = async (email: string, booking: any) => {
  const transporter = getTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@kostin.com';

  const html = `
    <div style="background-color: #0A0A0A; color: #ffffff; font-family: sans-serif; padding: 40px 20px;">
      <div style="max-width: 550px; margin: 0 auto; background-color: #141414; border: 1px solid #2A2A2A; border-radius: 16px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
        <div style="font-size: 24px; font-weight: 900; letter-spacing: 0.1em; margin-bottom: 24px; text-align: left;">Di</div>
        
        <h2 style="font-size: 20px; font-weight: 300; line-height: 1.4; margin-bottom: 16px; color: #ffffff; text-align: left;">
          Pendaftaran <span style="font-weight: 700; color: #C0C0C0;">Jadwal Survey Berhasil.</span>
        </h2>
        
        <p style="font-size: 13px; color: #B0B0B0; line-height: 1.6; margin-bottom: 24px; text-align: left;">
          Halo ${booking.userName}, Reservasi jadwal survey Anda telah diajukan dan sedang menunggu konfirmasi/persetujuan dari pemilik kost. Berikut rincian reservasi Anda:
        </p>
        
        <div style="background-color: #1C1C1C; border: 1px solid #2A2A2A; border-radius: 12px; padding: 20px; margin: 24px 0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #B0B0B0; font-family: monospace;">
            <tr>
              <td style="padding: 6px 0; color: #808080;">ID Booking</td>
              <td style="padding: 6px 0; text-align: right; color: #ffffff; font-weight: bold;">#${booking.id.toUpperCase()}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #808080;">Kost Pilihan</td>
              <td style="padding: 6px 0; text-align: right; color: #ffffff; font-weight: bold;">${booking.kostName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #808080;">Tanggal Survey</td>
              <td style="padding: 6px 0; text-align: right; color: #ffffff; font-weight: bold;">${booking.startDate}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #808080;">Jam Survey</td>
              <td style="padding: 6px 0; text-align: right; color: #ffffff; font-weight: bold;">${booking.surveyTime} WIB</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #808080;">Nama Penyewa</td>
              <td style="padding: 6px 0; text-align: right; color: #ffffff;">${booking.userName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #808080;">No WhatsApp</td>
              <td style="padding: 6px 0; text-align: right; color: #ffffff;">${booking.userPhone}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #808080;">Metode Pembayaran</td>
              <td style="padding: 6px 0; text-align: right; color: #ffffff;">${booking.paymentMethod}</td>
            </tr>
            <tr style="border-top: 1px dashed #2A2A2A;">
              <td style="padding: 12px 0 0 0; color: #808080; font-weight: bold;">Biaya Pendaftaran</td>
              <td style="padding: 12px 0 0 0; text-align: right; color: #10B981; font-weight: bold; font-size: 14px;">GRATIS</td>
            </tr>
          </table>
        </div>
        
        <p style="font-size: 13px; color: #B0B0B0; line-height: 1.6; margin-bottom: 24px; text-align: left;">
          Pemilik kost akan menghubungi Anda via WhatsApp atau Email untuk koordinasi lebih lanjut saat hari survey tiba.
        </p>

        <p style="font-size: 11px; color: #606060; margin-top: 32px; border-top: 1px solid #1C1C1C; padding-top: 16px; font-family: monospace; text-align: left;">
          Pesan otomatis oleh Di Premium Living.
        </p>
      </div>
    </div>
  `;

  if (!transporter) {
    console.log('\n=======================================');
    console.log(`✉️ MOCK EMAIL SENT TO: ${email}`);
    console.log(`📅 BOOKING CONFIRMATION SENT FOR: ${booking.kostName} (#${booking.id})`);
    console.log('=======================================\n');
    return;
  }

  await transporter.sendMail({
    from,
    to: email,
    subject: `[Di Premium Living] Pendaftaran Survey Kost Berhasil: #${booking.id.toUpperCase()}`,
    html,
  });
};

export const sendBookingStatusUpdate = async (email: string, booking: any, status: 'Disetujui' | 'Ditolak') => {
  const transporter = getTransporter();
  const from = process.env.SMTP_FROM || process.env.SMTP_USER || 'no-reply@kostin.com';

  const statusColor = status === 'Disetujui' ? '#10B981' : '#EF4444';
  const statusText = status === 'Disetujui' ? 'DISETUJUI (AKTIF)' : 'DITOLAK / DIBATALKAN';

  const html = `
    <div style="background-color: #0A0A0A; color: #ffffff; font-family: sans-serif; padding: 40px 20px;">
      <div style="max-width: 550px; margin: 0 auto; background-color: #141414; border: 1px solid #2A2A2A; border-radius: 16px; padding: 32px; box-shadow: 0 4px 20px rgba(0,0,0,0.5);">
        <div style="font-size: 24px; font-weight: 900; letter-spacing: 0.1em; margin-bottom: 24px; text-align: left;">Di</div>
        
        <h2 style="font-size: 20px; font-weight: 300; line-height: 1.4; margin-bottom: 16px; color: #ffffff; text-align: left;">
          Status Reservasi <span style="font-weight: 700; color: #C0C0C0;">Telah Diperbarui.</span>
        </h2>
        
        <p style="font-size: 13px; color: #B0B0B0; line-height: 1.6; margin-bottom: 24px; text-align: left;">
          Halo ${booking.userName}, Status pengajuan jadwal survey kost Anda untuk properti <strong>${booking.kostName}</strong> telah diperbarui oleh pemilik kost.
        </p>
        
        <div style="background-color: #1C1C1C; border: 1px solid #2A2A2A; border-radius: 12px; padding: 20px; margin: 24px 0;">
          <table style="width: 100%; border-collapse: collapse; font-size: 13px; color: #B0B0B0; font-family: monospace;">
            <tr>
              <td style="padding: 6px 0; color: #808080;">ID Booking</td>
              <td style="padding: 6px 0; text-align: right; color: #ffffff; font-weight: bold;">#${booking.id.toUpperCase()}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #808080;">Kost Pilihan</td>
              <td style="padding: 6px 0; text-align: right; color: #ffffff; font-weight: bold;">${booking.kostName}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #808080;">Tanggal Survey</td>
              <td style="padding: 6px 0; text-align: right; color: #ffffff;">${booking.startDate}</td>
            </tr>
            <tr>
              <td style="padding: 6px 0; color: #808080;">Jam Survey</td>
              <td style="padding: 6px 0; text-align: right; color: #ffffff;">${booking.surveyTime} WIB</td>
            </tr>
            <tr style="border-top: 1px dashed #2A2A2A;">
              <td style="padding: 12px 0 0 0; color: #808080; font-weight: bold;">Status Pengajuan</td>
              <td style="padding: 12px 0 0 0; text-align: right; color: ${statusColor}; font-weight: bold; font-size: 14px;">${statusText}</td>
            </tr>
          </table>
        </div>
        
        ${status === 'Disetujui' ? `
          <p style="font-size: 13px; color: #B0B0B0; line-height: 1.6; margin-bottom: 24px; text-align: left;">
            Silakan datang ke lokasi kost pada hari dan jam yang telah disepakati. Harap koordinasi dengan pemilik kost via WhatsApp jika terjadi perubahan rencana.
          </p>
        ` : `
          <p style="font-size: 13px; color: #B0B0B0; line-height: 1.6; margin-bottom: 24px; text-align: left;">
            Mohon maaf, pemilik kost menolak atau membatalkan jadwal survey ini. Silakan cari properti kost alternatif lain di katalog kami atau pilih jadwal slot survey yang berbeda.
          </p>
        `}

        <p style="font-size: 11px; color: #606060; margin-top: 32px; border-top: 1px solid #1C1C1C; padding-top: 16px; font-family: monospace; text-align: left;">
          Pesan otomatis oleh Di Premium Living.
        </p>
      </div>
    </div>
  `;

  if (!transporter) {
    console.log('\n=======================================');
    console.log(`✉️ MOCK EMAIL SENT TO: ${email}`);
    console.log(`📅 BOOKING STATUS UPDATED TO: ${status} FOR: ${booking.kostName} (#${booking.id})`);
    console.log('=======================================\n');
    return;
  }

  await transporter.sendMail({
    from,
    to: email,
    subject: `[Di Premium Living] Pembaruan Status Survey: #${booking.id.toUpperCase()} - ${statusText}`,
    html,
  });
};
