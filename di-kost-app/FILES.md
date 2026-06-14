# 📄 Files & Folder Organization Guide

Panduan lengkap struktur folder dan penjelasan setiap file dalam Di Kost App.

## 📁 Complete Folder Structure

```
di-kost-app/
├── screens/                    # All screen components
│   ├── HomeScreen.js          # Main screen - catalog & search
│   ├── DetailScreen.js        # Detail screen - property info
│   ├── LoginScreen.js         # Login screen
│   ├── SignUpScreen.js        # Sign up screen
│   ├── index.js              # Barrel export
│   └── ...
├── components/                # Reusable UI components
│   ├── Header.js             # Top navigation header
│   ├── KostCard.js           # Property card component
│   ├── SearchFilter.js       # Search & filter UI
│   ├── index.js              # Barrel export
│   └── ...
├── navigation/                # Navigation configuration
│   ├── AppNavigator.js       # Main stack navigator
│   └── ...
├── data/                      # Data & constants
│   ├── kosts.js              # Mock data - properties
│   └── ...
├── constants/                 # App-wide constants
│   ├── colors.js             # Colors, spacing, typography
│   └── ...
├── utils/                     # Utility functions
│   ├── api.js                # (future) API calls
│   └── ...
├── assets/                    # Static assets
│   ├── icon.png              # App icon (1024x1024)
│   ├── splash.png            # Splash screen
│   ├── android-icon-*.png    # Android specific icons
│   └── ...
├── .env.example              # Environment variables template
├── .gitignore                # Git ignore file
├── app.json                  # Expo app configuration
├── App.js                    # Main entry point
├── index.js                  # Expo entry
├── package.json              # Dependencies & scripts
├── package-lock.json         # Locked dependencies
├── README.md                 # User guide
├── QUICK_START.md            # Quick start guide
├── DEVELOPMENT.md            # Development guide
├── BUILD.md                  # Build & deploy guide
├── SUMMARY.md                # Project summary
├── FILES.md                  # This file
└── node_modules/             # Dependencies (not committed)
```

## 📄 File Descriptions

### Root Files

#### `App.js` (10 lines)
**Purpose**: Main entry point aplikasi
**Content**: 
- Import AppNavigator
- Setup navigation structure
- Configure StatusBar
**Important**: Ini adalah file pertama yang di-load

#### `app.json` (35 lines)
**Purpose**: Expo app configuration
**Content**:
- App name & slug
- Platform-specific settings
- Icon & splash screen paths
- Permissions & plugins
**Edit when**: Changing app name, icon, atau platform settings

#### `index.js` (3-5 lines)
**Purpose**: Expo entry point
**Content**: Register root component
**Rarely edited**: Expo handles otomatis

#### `package.json` (20+ lines)
**Purpose**: Project metadata & dependencies
**Content**:
- Project name & version
- Dependencies list
- Scripts untuk development/build
**Edit when**: Adding new packages

#### `.env.example` (40 lines)
**Purpose**: Template untuk environment variables
**Content**: Example env var names & formats
**Usage**: Copy ke `.env` dan fill dengan values
**Important**: Never commit `.env` file!

#### `.gitignore`
**Purpose**: Tell Git which files to ignore
**Important files ignored**: node_modules/, .env, .expo/, etc.

### Documentation Files

#### `README.md` (230+ lines)
**Purpose**: Main user guide & getting started
**Contains**:
- Feature list
- Tech stack
- Installation instructions
- Project structure
- Troubleshooting
**Read first!**: If you're new to project

#### `QUICK_START.md` (190+ lines)
**Purpose**: Fast setup guide - 3 langkah
**Contains**:
- Quick 3-step setup
- How to run on different platforms
- Feature walkthrough
- Troubleshooting
**Use when**: Want to quickly run app

#### `DEVELOPMENT.md` (450+ lines)
**Purpose**: Complete development guide
**Contains**:
- Project overview
- File structure explanation
- Development workflow
- Adding features (screens, components, API)
- Code style guidelines
- Debugging techniques
- Testing setup
- Contributing guidelines
**Use when**: Building new features

#### `BUILD.md` (310+ lines)
**Purpose**: Building & deployment guide
**Contains**:
- Build APK with EAS
- Build IPA
- Pre-build checklist
- App signing
- Store deployment
- Version management
- OTA updates
- Common issues
**Use when**: Ready to build APK/IPA or deploy

#### `SUMMARY.md` (350+ lines)
**Purpose**: Project overview & summary
**Contains**:
- Feature checklist
- Project statistics
- Data structures
- Tech stack details
- Version info
- Next steps
**Use when**: Need project overview

#### `FILES.md` (This file)
**Purpose**: File & folder organization guide
**Use when**: Need to find or understand a specific file

### Screens Folder (`screens/`)

#### `screens/HomeScreen.js` (363 lines)
**Purpose**: Main catalog view with search
**Exports**: `HomeScreen` component
**Features**:
- Hero section with stats
- Search functionality
- Advanced filters
- Features showcase
- Amenities carousel
- Kost list
- Empty state handling
**Props**: `{ navigation }`
**Key Functions**:
- `filteredKosts` - useMemo for filtering
- `handleKostPress` - navigate to detail

#### `screens/DetailScreen.js` (578 lines)
**Purpose**: Property detail view
**Exports**: `DetailScreen` component
**Features**:
- Property image
- Badges & verification
- Full property info
- Facilities listing
- Amenities grid
- Chat modal
- Action buttons
**Props**: `{ route, navigation }`
**Route Params**: `{ kost }` - Property object
**Key Functions**:
- `handleBooking` - Mock booking
- `handleChat` - Open chat modal
- `sendMessage` - Send chat message

#### `screens/LoginScreen.js` (331 lines)
**Purpose**: User authentication
**Exports**: `LoginScreen` component
**Features**:
- Email input
- Password input
- Show/hide password toggle
- Form validation
- Social login buttons
- Sign up link
**Props**: `{ navigation }`
**Key Functions**:
- `handleLogin` - Submit login form
- `handleSignUp` - Navigate to signup

#### `screens/SignUpScreen.js` (401 lines)
**Purpose**: User registration
**Exports**: `SignUpScreen` component
**Features**:
- Full name, email, phone, password inputs
- Confirm password matching
- Terms & conditions checkbox
- Form validation
- Benefits showcase
**Props**: `{ navigation }`
**Key Functions**:
- `handleSignUp` - Submit signup form
- Validation logic

#### `screens/index.js` (5 lines)
**Purpose**: Barrel export untuk screens
**Content**: 
```javascript
export { default as HomeScreen } from './HomeScreen';
// ... other exports
```
**Usage**: `import { HomeScreen, DetailScreen } from '../screens'`

### Components Folder (`components/`)

#### `components/Header.js` (99 lines)
**Purpose**: Top navigation header
**Exports**: `Header` component
**Features**:
- App logo & subtitle
- Menu button
- Login button
- Safe area handling
**Props**:
- `title` - Header title
- `onMenuPress` - Menu callback
- `onLoginPress` - Login callback
- `showMenu` - Show/hide menu button
**Usage**:
```javascript
<Header 
  title="Di"
  onMenuPress={() => {}}
  onLoginPress={() => navigation.navigate('Login')}
/>
```

#### `components/KostCard.js` (187 lines)
**Purpose**: Property card component
**Exports**: `KostCard` component
**Features**:
- Property image
- Badges (type, verification)
- Name, location, rating
- Facilities tags
- Price & occupancy info
**Props**:
- `kost` - Property object
- `onPress` - Card press callback
**Usage**:
```javascript
<KostCard 
  kost={kostData}
  onPress={() => navigation.navigate('Detail', { kost })}
/>
```

#### `components/SearchFilter.js` (364 lines)
**Purpose**: Search & filter interface
**Exports**: `SearchFilter` component
**Features**:
- Search input
- Filter buttons
- Modal filter UI
- Multiple filter options
- Reset functionality
**Props**:
- `onSearch` - Search callback
- `onFilterChange` - Filter callback
- `searchValue` - Current search
**States**:
- `showFilters` - Modal visibility
- `selectedFilters` - Active filters
**Usage**:
```javascript
<SearchFilter
  searchValue={searchQuery}
  onSearch={setSearchQuery}
  onFilterChange={setFilters}
/>
```

#### `components/index.js` (4 lines)
**Purpose**: Barrel export untuk components
**Content**:
```javascript
export { default as Header } from './Header';
// ... other exports
```
**Usage**: `import { Header, KostCard } from '../components'`

### Navigation Folder (`navigation/`)

#### `navigation/AppNavigator.js` (48 lines)
**Purpose**: Navigation configuration
**Exports**: `AppNavigator` component
**Content**:
- NavigationContainer setup
- Stack Navigator configuration
- All screen registrations
- Default navigation options
**Screens**:
- `Home` → HomeScreen
- `Detail` → DetailScreen
- `Login` → LoginScreen
- `SignUp` → SignUpScreen
**Usage**: Wrap di App.js untuk provide navigation

### Data Folder (`data/`)

#### `data/kosts.js` (142 lines)
**Purpose**: Mock data management
**Exports**:
- `KOSTS_DATA` - Array of 6 properties
- `FILTERS` - Filter options
- `FEATURES` - App features
- `AMENITIES` - Building amenities
**Data Structure**:
```javascript
{
  id: number,
  name: string,
  location: string,
  address: string,
  rating: number,
  price: number,
  image: string,
  type: 'Putra|Putri|Campur',
  badges: string[],
  facilities: string[],
  occupancy: string,
  verified: boolean,
  description: string,
}
```
**Usage**:
```javascript
import { KOSTS_DATA, FILTERS } from '../data/kosts';
```

### Constants Folder (`constants/`)

#### `constants/colors.js` (85 lines)
**Purpose**: Design tokens & typography
**Exports**:
- `COLORS` - Color palette
- `SPACING` - Spacing scale
- `BORDER_RADIUS` - Border radius values
- `TYPOGRAPHY` - Font styles
**Usage**:
```javascript
import { COLORS, SPACING } from '../constants/colors';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
  },
});
```

### Assets Folder (`assets/`)

#### `assets/icon.png`
- App icon (1024x1024 PNG)
- Used: Home screen icon, notification icon
- Edit: Replace dengan app logo

#### `assets/splash.png`
- Splash screen image
- Edit: Replace dengan branded splash

#### `assets/android-icon-*.png`
- Android-specific icon assets
- Keep: For Android platform

#### `assets/favicon.png`
- Web favicon
- Keep: For web version

## 🗂️ Folder Organization Rules

### 1. Screens Folder Rules
- One screen per file
- File name sama dengan component name
- Export default component
- Group related styles di file yang sama

### 2. Components Folder Rules
- One component per file
- Reusable across screens
- No business logic
- StyleSheet di akhir file
- Props well documented

### 3. Data Folder Rules
- Mock data terpisah dari components
- Constants grouped by type
- Easy to replace dengan API data later

### 4. Constants Folder Rules
- Design tokens grouped by category
- No magic numbers di components
- Centralized untuk consistency
- Easy global changes

## 🔄 Updating Files

### When Adding New Screen

1. Create `screens/NewScreen.js`
2. Add export di `screens/index.js`
3. Add to `navigation/AppNavigator.js`
4. Import & navigate dari screen lain

### When Adding New Component

1. Create `components/NewComponent.js`
2. Add export di `components/index.js`
3. Import & use di screens

### When Adding New Data

1. Add ke `data/kosts.js` atau create new file
2. Export dari file
3. Import di screens/components yang perlu

### When Changing Colors/Spacing

1. Update di `constants/colors.js`
2. Update all components menggunakan nilai baru
3. Test consistency di semua screens

## 📝 File Naming Conventions

### Screens
```
screens/HomeScreen.js      ✓ Good
screens/home-screen.js     ✗ Bad
screens/home.js            ✗ Ambiguous
```

### Components
```
components/KostCard.js     ✓ Good
components/kost-card.js    ✗ Bad
components/Card.js         ✗ Too generic
```

### Data Files
```
data/kosts.js             ✓ Good
data/kostData.js          ✓ Also good
data/data.js              ✗ Too vague
```

### Constants
```
constants/colors.js       ✓ Good
constants/COLORS.js       ✗ File names not CAPS
constants/theme.js        ✓ Also good
```

## 🚀 Quick File Reference

### Want to...

**Change colors?**
→ Edit `constants/colors.js`

**Add new screen?**
→ Create `screens/NewScreen.js`

**Add new component?**
→ Create `components/NewComponent.js`

**Change mock data?**
→ Edit `data/kosts.js`

**Setup navigation?**
→ Edit `navigation/AppNavigator.js`

**Configure app?**
→ Edit `app.json`

**Add dependency?**
→ Edit `package.json` (or use npm install)

**Setup environment vars?**
→ Copy `.env.example` to `.env`

**Change Typography?**
→ Edit `TYPOGRAPHY` di `constants/colors.js`

**Change Spacing?**
→ Edit `SPACING` di `constants/colors.js`

---

Semoga panduan ini membantu! Untuk detail lebih lanjut tentang development, lihat **DEVELOPMENT.md**.
