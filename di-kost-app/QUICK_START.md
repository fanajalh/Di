# ⚡ Quick Start Guide

Panduan cepat untuk menjalankan Di Kost App di perangkat Anda.

## 🎯 3 Langkah Mudah

### 1️⃣ Install Dependencies

```bash
cd di-kost-app
npm install --legacy-peer-deps
```

### 2️⃣ Start Development Server

```bash
npm start
```

Anda akan melihat output seperti:

```
Expo Go is configured for local development
Starting Metro bundler
▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀▄▀ ▄▄▄▄▄▄▄▄
To open the app with Expo Go, scan the QR code above.
```

### 3️⃣ Buka di Perangkat

**Pilih salah satu:**

#### A. Scan QR Code dengan Expo Go
1. Download **Expo Go** app dari Play Store (Android) atau App Store (iOS)
2. Buka Expo Go
3. Scan QR code yang muncul di terminal
4. App akan load otomatis!

#### B. Jalankan di Web Browser
1. Di terminal, tekan `w`
2. Browser akan otomatis membuka `http://localhost:19006`
3. Lihat preview web version

#### C. Jalankan di Android
1. Pastikan Android device/emulator terhubung
2. Di terminal, tekan `a`
3. App akan build dan run di Android

#### D. Jalankan di iOS (macOS only)
1. Pastikan iOS simulator terinstall
2. Di terminal, tekan `i`
3. App akan build dan run di iOS

## 📱 Fitur Utama untuk Dicoba

1. **Home Screen**
   - Scroll untuk lihat berbagai section
   - Search & filter kost
   - Click pada kost card untuk lihat detail

2. **Detail Screen**
   - Lihat informasi lengkap kost
   - Swipe untuk melihat fasilitas
   - Click "Chat" atau "Booking" button

3. **Login/Sign Up**
   - Click "Masuk Akun" di top right
   - Try login atau sign up (dummy form)

4. **Search & Filter**
   - Coba search dengan nama kost
   - Click filter button untuk advanced filters
   - Multiple filters dapat digabung

## 🔄 Hot Reload

Aplikasi support hot reload - saat Anda mengubah code dan save, app akan reload otomatis tanpa perlu restart.

```bash
# Jika hot reload tidak bekerja, gunakan
npm start -- --reset-cache

# Atau reload manual di Expo Go dengan gesture: Shake phone
```

## 🛠️ Troubleshooting

### "Metro bundler failed to start"
```bash
npm start -- --reset-cache
```

### "Port already in use"
```bash
npm start -- --port 8081
```

### "Cannot find expo"
```bash
npm install -g expo-cli
npm install --legacy-peer-deps
npm start
```

### "Stuck at loading screen"
- Pastikan tidak ada error di terminal
- Try restart: `npm start -- --reset-cache`
- Check file syntax di code editor

### "QR Code tidak muncul"
- Resize terminal window lebih besar
- Atau copy URL langsung dari terminal ke Expo Go

## 🎨 Customize App

### Mengubah Theme/Colors
Edit file: `constants/colors.js`

```javascript
export const COLORS = {
  primary: '#3b82f6',  // Change this to your color
  // ... other colors
};
```

### Mengubah Data Kost
Edit file: `data/kosts.js`
- Tambah/edit properti kost
- Update filter options
- Ubah images (gunakan URL image online)

### Mengubah Screens
Edit file di folder `screens/`
- Modify JSX untuk change UI
- Update styles untuk change design
- Add new states/effects

## 📦 Next Steps

1. **Try Development**
   - Modify colors & typography
   - Add new features
   - Try different layouts

2. **Connect to Backend**
   - Setup API endpoint
   - Replace mock data dengan API calls
   - Add authentication

3. **Build APK**
   - See [BUILD.md](./BUILD.md) untuk detailed instructions
   - Use EAS untuk easiest build process
   - Deploy ke Google Play Store

4. **Deep Dive Development**
   - See [DEVELOPMENT.md](./DEVELOPMENT.md) untuk complete guide
   - Add state management
   - Implement advanced features

## 📚 Useful Links

- **Expo Documentation**: https://docs.expo.dev
- **React Native Docs**: https://reactnative.dev
- **React Navigation**: https://reactnavigation.org
- **Expo Go App**: Download dari Play Store / App Store

## 💡 Pro Tips

1. **Use Expo Go for faster development** - tidak perlu install Android Studio atau Xcode
2. **Test on physical device** - lebih akurat untuk UI/UX
3. **Use console.log untuk debugging** - lihat output di terminal
4. **Save file untuk hot reload** - tidak perlu restart app
5. **Check error messages di terminal** - usually descriptive

## ✅ Checklist

Pastikan Anda sudah:
- [ ] Install Node.js & npm
- [ ] Clone/download project
- [ ] Run `npm install --legacy-peer-deps`
- [ ] Run `npm start`
- [ ] Download Expo Go app
- [ ] Scan QR code atau run di web/emulator
- [ ] Explore app features
- [ ] Customize dan experiment!

---

**You're all set! Happy exploring! 🚀**

Jika ada pertanyaan, lihat README.md atau dokumentasi links di atas.
