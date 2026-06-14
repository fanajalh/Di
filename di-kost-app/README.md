# Di - Sewa Kost Premium Mobile App

Aplikasi React Native untuk mencari dan memesan kost premium dengan mudah dan cepat.

## 📱 Fitur Utama

- **Catalog Kost** - Jelajahi koleksi kamar kost premium dengan filter lengkap
- **Pencarian & Filter** - Cari kost berdasarkan lokasi, tipe, budget, dan fasilitas
- **Detail Kost** - Lihat informasi lengkap tentang setiap properti
- **Chat Langsung** - Hubungi pemilik kost secara real-time
- **Booking Instan** - Proses booking cepat dan transparan
- **Autentikasi** - Login dan registrasi akun pengguna

## 🎨 Design

Aplikasi menggunakan desain dark mode yang elegan dan modern dengan:
- Dark theme (#000 background)
- Blue accent color (#3b82f6)
- Clean typography dan spacing
- Smooth animations dan transitions

## 🛠️ Tech Stack

- **React Native** - Framework untuk mobile development
- **Expo** - Platform untuk build & deploy React Native
- **React Navigation** - Navigation library
- **TypeScript** - Type safety (opsional)

## 🚀 Getting Started

### Prerequisites
- Node.js & npm (or yarn/pnpm)
- Expo CLI: `npm install -g expo-cli`
- Physical device atau emulator

### Installation

1. Navigate ke project directory:
```bash
cd di-kost-app
```

2. Install dependencies:
```bash
npm install --legacy-peer-deps
```

### Running the App

#### Menggunakan Expo Go (Recommended untuk development)

1. Start the development server:
```bash
npm start
```

2. Di terminal, tekan:
   - `a` untuk Android
   - `i` untuk iOS
   - `w` untuk Web

3. Atau scan QR code dengan Expo Go app di smartphone Anda

#### Build APK untuk Android

```bash
# Build APK
expo build:android -t apk

# Atau menggunakan EAS Build (recommended)
eas build --platform android --local
```

#### Build IPA untuk iOS

```bash
# Hanya bisa di macOS
expo build:ios

# Atau menggunakan EAS Build
eas build --platform ios --local
```

## 📁 Project Structure

```
di-kost-app/
├── screens/           # Screen components
│   ├── HomeScreen.js
│   ├── DetailScreen.js
│   ├── LoginScreen.js
│   └── SignUpScreen.js
├── components/        # Reusable components
│   ├── Header.js
│   ├── KostCard.js
│   └── SearchFilter.js
├── navigation/        # Navigation setup
│   └── AppNavigator.js
├── data/              # Mock data
│   └── kosts.js
├── App.js            # Entry point
└── app.json          # App configuration
```

## 🎯 Core Screens

### Home Screen
- Hero section dengan stats
- Search & filter functionality
- Features showcase
- Amenities carousel
- List kost dengan pagination

### Detail Screen
- Gambar properti
- Informasi lengkap kost
- Fasilitas kamar & gedung
- Harga dan okupansi
- Chat & booking buttons

### Login Screen
- Email & password login
- Social media login (stub)
- Sign up link

### Sign Up Screen
- Registrasi akun baru
- Form validation
- Terms & conditions acceptance
- Benefits showcase

## 🔄 Data Flow

Aplikasi menggunakan mock data dari `data/kosts.js`. Untuk menghubungkan dengan API backend:

1. Update data fetching di HomeScreen.js
2. Implementasikan API calls dengan axios/fetch
3. Tambahkan loading & error states
4. Setup authentication dengan token storage

## 🎨 Customization

### Mengubah Colors
Edit warna di setiap stylesheet komponen atau buat constants:

```javascript
export const COLORS = {
  primary: '#3b82f6',
  background: '#000',
  surface: '#1a1a1a',
  text: '#fff',
  textSecondary: '#999',
};
```

### Mengubah Data
Edit `data/kosts.js` untuk menambah/mengubah properti kost atau filter options.

## 📦 Available Scripts

- `npm start` - Start development server
- `npm run android` - Start Android development
- `npm run ios` - Start iOS development
- `npm run web` - Start web development

## 🔐 Security Notes

- Jangan commit sensitive data (API keys, secrets)
- Gunakan environment variables untuk konfigurasi
- Implement proper authentication & token refresh
- Validate input di client & server side
- Use HTTPS untuk API calls

## 📝 Important Notes

### Untuk Deployment

1. **Update app.json** dengan informasi app yang benar
2. **Setup EAS** untuk building:
   ```bash
   eas init
   eas build --platform all
   ```
3. **Test thoroughly** di physical devices sebelum release
4. **Prepare stores** - Google Play Store & Apple App Store

### Menambah Features

1. State management (Redux/Zustand) untuk kompleks state
2. Push notifications dengan Firebase/EAS Notifications
3. Payment integration (Stripe/Midtrans untuk Indonesia)
4. Real-time chat dengan Firebase/Socket.io
5. Image uploads dengan Firebase Storage atau S3
6. Offline capabilities dengan SQLite/Realm

## 🐛 Troubleshooting

### Metro bundler tidak start
```bash
npm install --legacy-peer-deps
npx expo start --reset-cache
```

### Port sudah digunakan
```bash
npm start -- --port 8081
```

### Dependencies conflict
```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

## 📞 Support

Untuk bantuan lebih lanjut:
- Baca dokumentasi Expo: https://docs.expo.dev
- React Navigation docs: https://reactnavigation.org
- React Native docs: https://reactnative.dev

## 📄 License

MIT License - feel free to use this project!

---

Happy coding! 🚀
