# 📦 Installation & Setup Guide

Panduan lengkap untuk install dan setup Di Kost App.

## ✅ Prerequisites

Sebelum mulai, pastikan sudah install:

### Required
- **Node.js** v16 atau lebih tinggi
- **npm** v7 atau lebih tinggi (atau yarn/pnpm)

Check versions:
```bash
node --version    # Should be v16+
npm --version     # Should be v7+
```

### Optional (untuk production build)
- **Android Studio** (untuk Android development)
- **Xcode** (untuk iOS development - macOS only)
- **Expo CLI** (untuk advanced features)

## 🚀 Installation Steps

### Step 1: Navigate ke Project

```bash
cd /vercel/share/v0-project/di-kost-app
```

### Step 2: Install Dependencies

```bash
npm install --legacy-peer-deps
```

**Catatan**: `--legacy-peer-deps` diperlukan untuk mengatasi dependency conflicts dengan Expo.

Alternatif package managers:
```bash
# Menggunakan yarn
yarn install

# Menggunakan pnpm
pnpm install

# Menggunakan bun
bun install
```

Wait untuk completion (usually 1-3 minutes).

### Step 3: Verify Installation

```bash
npm list expo react react-native
```

Output should show versions:
- expo@~56.0.11
- react@19.2.3
- react-native@0.85.3

## 🎯 First Run

### Option A: Run dengan Expo Go (Recommended for beginners)

1. **Install Expo Go App**
   - Android: Download dari Google Play Store
   - iOS: Download dari Apple App Store
   - Or visit: https://expo.dev/go

2. **Start Development Server**
   ```bash
   npm start
   ```

3. **Open Expo Go & Scan QR**
   - Buka Expo Go app
   - Tap "Scan QR Code"
   - Point ke QR code di terminal
   - App akan load otomatis!

### Option B: Run di Android Device/Emulator

```bash
# Start dev server
npm start

# Press 'a' untuk android
# atau scan QR code dengan Expo Go
```

Requirements:
- Android 6+ device atau Android emulator
- USB debugging enabled (untuk physical device)

### Option C: Run di iOS (macOS only)

```bash
# Start dev server
npm start

# Press 'i' untuk iOS
# atau scan QR code dengan Expo Go
```

Requirements:
- macOS dengan Xcode
- iOS 14+ simulator atau physical device

### Option D: Run di Web Browser

```bash
# Start dev server dengan web
npm start -- --web

# atau
npm run web
```

Browser akan otomatis membuka `http://localhost:19006`

**Note**: Web version limited (beberapa mobile features tidak support).

## 🔧 Troubleshooting Installation

### Issue: "npm: command not found"

**Solution**: Install Node.js dari https://nodejs.org/

```bash
# Verify installation
node --version
npm --version
```

### Issue: "npm ERR! code ERESOLVE"

**Solution**: Use `--legacy-peer-deps` flag:

```bash
npm install --legacy-peer-deps
```

### Issue: "Module not found"

**Solution**: Clean install:

```bash
rm -rf node_modules package-lock.json
npm install --legacy-peer-deps
```

### Issue: "Port already in use"

**Solution**: Use different port:

```bash
npm start -- --port 8081
```

### Issue: "Metro bundler failed to start"

**Solution**: Reset cache:

```bash
npm start -- --reset-cache
```

### Issue: "Cannot find expo"

**Solution**: Install Expo CLI globally:

```bash
npm install -g expo-cli
npm install --legacy-peer-deps
npm start
```

### Issue: "React/React Native mismatch"

**Solution**: Reinstall dengan compatible versions:

```bash
npm install --legacy-peer-deps
# atau force update
npm install --legacy-peer-deps --force
```

## 📱 Device Requirements

### Android
- **Minimum**: Android 6 (API 23)
- **Recommended**: Android 10+
- **Device Space**: ~100 MB
- **RAM**: 2GB+ recommended
- **Network**: WiFi connection (development)

### iOS
- **Minimum**: iOS 14
- **Recommended**: iOS 15+
- **Device Space**: ~100 MB
- **RAM**: 2GB+ recommended
- **Network**: WiFi connection (development)

## 🌐 Network Setup

### Local Network Connection

1. **Same WiFi Network**
   - Expo app dan dev computer harus di WiFi yang sama
   - Tidak perlu kabel USB

2. **Using USB Connection**
   ```bash
   adb reverse tcp:19000 tcp:19000  # Android
   ```

3. **Using Tunnel (Internet)**
   ```bash
   npm start -- --tunnel
   # Lebih lambat, untuk testing di internet
   ```

## 📁 File Structure After Installation

Setelah install, folder structure akan terlihat:

```
di-kost-app/
├── node_modules/           # Dependencies (auto-created)
├── screens/
├── components/
├── navigation/
├── data/
├── constants/
├── assets/
├── App.js
├── app.json
├── package.json
├── package-lock.json       # Auto-created
└── README.md
```

Size: ~500 MB (dengan node_modules)

## ✅ Verification Checklist

Setelah installation, verify:

- [ ] `npm --version` works
- [ ] `node --version` shows v16+
- [ ] Project folder contains `node_modules/`
- [ ] `package-lock.json` exists
- [ ] No error messages saat `npm install`
- [ ] `npm start` runs without errors
- [ ] Metro bundler starts successfully
- [ ] QR code appears di terminal

## 🎉 Next Steps

Setelah installation berhasil:

1. **Read QUICK_START.md** - 3-step quick start
2. **Run the app** - `npm start` dan scan QR code
3. **Explore features** - Test search, filter, detail view
4. **Customize** - Edit data & styling
5. **Read DEVELOPMENT.md** - Learn advanced topics

## 💡 Tips

- **Hot Reload**: Changes otomatis reload - no restart needed!
- **Save bandwith**: Use WiFi untuk development
- **Testing**: Always test di physical device sebelum production
- **Dependencies**: Avoid adding unnecessary packages
- **Security**: Never commit `.env` file dengan secrets

## 🆘 Need Help?

### Online Resources
- **Expo Docs**: https://docs.expo.dev
- **React Native**: https://reactnative.dev
- **npm Help**: https://docs.npmjs.com
- **Node.js**: https://nodejs.org/docs

### Local Help
- See **README.md** untuk overview
- See **DEVELOPMENT.md** untuk dev guide
- See **QUICK_START.md** untuk quick setup
- See **PROJECT_STATUS.txt** para troubleshooting

### Common Issues
Most issues already documented di **PROJECT_STATUS.txt** troubleshooting section.

## 🔄 Re-installation

Jika ada masalah, complete re-install:

```bash
# 1. Remove dependencies
rm -rf node_modules package-lock.json

# 2. Clear npm cache
npm cache clean --force

# 3. Reinstall
npm install --legacy-peer-deps

# 4. Start fresh
npm start -- --reset-cache
```

## 📝 Environment Setup (Optional)

Jika perlu environment variables:

1. Copy `.env.example` ke `.env`:
   ```bash
   cp .env.example .env
   ```

2. Edit `.env` dengan values Anda

3. **Important**: Never commit `.env` file!

## 🚀 Ready!

Sekarang Anda siap untuk:

✅ Develop aplikasi  
✅ Test di device  
✅ Customize features  
✅ Build APK/IPA  
✅ Deploy ke stores  

**Happy coding!** 🎉

---

Untuk next steps, baca **QUICK_START.md** atau **README.md**.
