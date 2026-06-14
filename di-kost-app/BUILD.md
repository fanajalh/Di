# 📦 Building & Deploying Di Kost App

Panduan lengkap untuk build APK/IPA dan deploy aplikasi React Native Expo.

## 🚀 Quick Start untuk APK

### Opsi 1: Build APK dengan EAS (Recommended)

EAS (Expo Application Services) adalah cara paling mudah untuk build APK tanpa memerlukan Android Studio.

#### Setup EAS

1. Install EAS CLI:
```bash
npm install -g eas-cli
```

2. Login ke Expo account:
```bash
eas login
```

3. Initialize EAS project:
```bash
cd di-kost-app
eas build:configure
```

#### Build APK

```bash
# Build APK untuk testing
eas build --platform android --local

# Atau build APK dan push langsung ke device
eas build --platform android
```

APK akan tersedia di dashboard EAS atau output folder.

### Opsi 2: Build APK dengan Expo CLI (Tanpa EAS)

Cara alternatif jika tidak ingin setup EAS:

```bash
# Install expo-cli jika belum
npm install -g expo-cli

# Build APK
expo build:android -t apk
```

**Catatan**: Cara ini lebih lambat dan memerlukan login ke Expo.

## 🍎 Building iOS (macOS Only)

### Build IPA dengan EAS

```bash
eas build --platform ios --local
```

### Build IPA dengan Xcode

1. Setup EAS terlebih dahulu
2. Buka Xcode project yang di-generate
3. Configure signing & provisioning
4. Build & run di simulator atau device

## 📋 Pre-Build Checklist

Sebelum build, pastikan:

- [ ] Update `app.json` dengan nama & icon app yang benar
- [ ] Update `app.json` package name untuk Android: `com.diofficial.kost`
- [ ] Update `app.json` bundle identifier untuk iOS: `com.diofficial.kost`
- [ ] Generate & add app icons (1024x1024 PNG)
- [ ] Generate & add splash screen (1242x2436 PNG)
- [ ] Test app di Expo Go untuk memastikan semua feature berjalan
- [ ] Update version di `app.json`
- [ ] Update changelog

### App Icon Setup

1. Buat icon 1024x1024 PNG
2. Tempat di `assets/icon.png`
3. Di `app.json`:
```json
{
  "expo": {
    "icon": "./assets/icon.png"
  }
}
```

### Splash Screen Setup

1. Buat splash screen image (1242x2436 PNG untuk optimal)
2. Tempat di `assets/splash.png`
3. Di `app.json`:
```json
{
  "expo": {
    "splash": {
      "image": "./assets/splash.png",
      "resizeMode": "contain",
      "backgroundColor": "#000000"
    }
  }
}
```

## 🔑 Signing & Keystore (Android)

### Automatic Signing (Recommended)

EAS akan otomatis menangani signing certificates.

### Manual Signing

Jika menggunakan build traditional:

1. Generate keystore:
```bash
keytool -genkey -v -keystore my-release-key.jks \
  -keyalg RSA -keysize 2048 -validity 10000 \
  -alias my-key-alias
```

2. Configure di `app.json`:
```json
{
  "android": {
    "keystore": "path/to/my-release-key.jks",
    "keystorePassword": "...",
    "keyAlias": "my-key-alias",
    "keyPassword": "..."
  }
}
```

## 📦 Store Deployment

### Google Play Store

#### Requirements:
- Signed APK atau App Bundle
- Store listing & screenshots
- Privacy policy URL
- Content rating questionnaire

#### Steps:
1. Buat Google Play Developer account ($25 one-time fee)
2. Create new app & fill store listing
3. Upload APK/Bundle
4. Submit untuk review
5. Tunggu approval (usually 24-48 hours)

### Apple App Store

#### Requirements:
- Signed IPA
- Apple Developer account ($99/year)
- App Store Connect setup
- TestFlight beta testing
- Store listing & screenshots

#### Steps:
1. Setup App ID & Provisioning Profile di Apple Developer
2. Build & sign IPA dengan Xcode
3. Upload ke TestFlight for beta testing
4. Setup App Store listing
5. Submit for review
6. Tunggu approval (usually 24-48 hours)

## 🧪 Testing

### Test di Physical Device

#### Android:
1. Enable Developer Mode di phone
2. Connect via USB
3. Run:
```bash
expo start
# Press 'a' untuk Android
# atau scan QR code dengan Expo Go
```

#### iOS:
1. Open Expo Go app
2. Scan QR code atau enter tunnel URL

### Test di Emulator

#### Android Emulator:
```bash
# Pastikan Android Studio & emulator terinstall
npm start
# Press 'a' untuk Android
```

#### iOS Simulator (macOS only):
```bash
npm start
# Press 'i' untuk iOS
```

## 🔄 Version Management

Update version saat release:

```json
{
  "expo": {
    "version": "1.0.1"
  }
}
```

Juga update di `package.json`:
```json
{
  "version": "1.0.1"
}
```

## 📱 OTA Updates (Over-The-Air)

Expo memungkinkan update app tanpa republish ke store:

### Update JavaScript & Assets (Tanpa rebuild native code)

1. Update code
2. Run:
```bash
eas update --message "Fix bugs and improvements"
```

3. User akan otomatis mendapat update

### Limitations:
- Hanya untuk JS/assets, tidak untuk native modules
- Jika ubah native code, harus rebuild APK/IPA

## 🚨 Common Issues

### Build gagal: "Keystore not found"
- Pastikan keystore path di `app.json` benar
- Untuk EAS, biarkan otomatis handle signing

### APK tidak install di device
- Pastikan package name di `app.json` unik
- Check minimum SDK version compatibility

### App crash di production
- Test di Expo Go terlebih dahulu
- Check console logs: `adb logcat` (Android)
- Use Sentry untuk crash reporting

## 📊 Monitoring

### Setup Error Tracking dengan Sentry

1. Install Sentry:
```bash
npm install @sentry/react-native
```

2. Setup di App.js:
```javascript
import * as Sentry from "@sentry/react-native";

Sentry.init({
  dsn: "YOUR_SENTRY_DSN",
  tracesSampleRate: 1.0,
});
```

### Analytics

Gunakan Firebase Analytics atau Mixpanel untuk tracking user behavior.

## 📝 Release Checklist

Sebelum release ke stores:

- [ ] Test di physical device (Android & iOS)
- [ ] Test offline functionality
- [ ] Check performance & battery usage
- [ ] Update version number
- [ ] Create release notes
- [ ] Screenshot store listing
- [ ] Test login flow
- [ ] Verify all links & external URLs
- [ ] Check app permissions
- [ ] Privacy policy & terms updated
- [ ] Get beta feedback dari users
- [ ] Final QA pass
- [ ] Submit ke stores

## 📚 Resources

- [EAS Build Documentation](https://docs.expo.dev/build/introduction/)
- [Google Play Store Guide](https://developer.android.com/distribute/console)
- [Apple App Store Guide](https://developer.apple.com/app-store/)
- [React Native Release Management](https://reactnative.dev/docs/publishing)

---

Happy building! 🎉
