# 👨‍💻 Development Guide

Panduan untuk development & contribusi ke Di Kost App.

## 🎯 Project Overview

Di Kost adalah aplikasi React Native untuk mencari dan memesan kost premium. Aplikasi ini di-build dengan Expo untuk memudahkan development dan deployment.

### Tech Stack
- **React Native** - UI framework
- **Expo** - Development platform
- **React Navigation** - Navigation routing
- **Axios/Fetch** - HTTP requests (untuk future API integration)

## 📂 Project Structure

```
di-kost-app/
├── app/                 # App config files (unused dengan expo start)
├── screens/            # Screen components
│   ├── HomeScreen.js   # Home / Catalog
│   ├── DetailScreen.js # Kost detail
│   ├── LoginScreen.js  # User login
│   └── SignUpScreen.js # User registration
├── components/         # Reusable UI components
│   ├── Header.js       # Top navigation header
│   ├── KostCard.js     # Kost card component
│   └── SearchFilter.js # Search & filter UI
├── navigation/         # Navigation setup
│   └── AppNavigator.js # Stack navigator config
├── data/              # Mock data
│   └── kosts.js       # Kost properties data
├── constants/         # App constants
│   └── colors.js      # Colors & typography
├── utils/             # Utility functions (future)
├── App.js             # Entry point
├── app.json           # Expo config
├── package.json       # Dependencies
├── README.md          # User guide
├── BUILD.md           # Build & deploy guide
└── DEVELOPMENT.md     # This file
```

## 🚀 Development Workflow

### Initial Setup

```bash
# Clone & navigate
cd di-kost-app

# Install dependencies
npm install --legacy-peer-deps

# Start development server
npm start
```

### Local Development

```bash
# Option 1: Run on web (fastest for testing)
npm start -- --web
# Then open http://localhost:19006

# Option 2: Run on Android
npm start
# Press 'a' or scan QR with Expo Go

# Option 3: Run on iOS (macOS only)
npm start
# Press 'i' or scan QR with Expo Go
```

### File Changes & Hot Reload

- Changes di JavaScript akan hot reload otomatis
- Changes di native code memerlukan rebuild
- Use `npm start` dengan `--reset-cache` jika ada masalah

## 🔧 Adding Features

### Adding a New Screen

1. Create screen component di `screens/`:

```javascript
// screens/MyNewScreen.js
import React from 'react';
import { View, Text, SafeAreaView } from 'react-native';

export default function MyNewScreen({ navigation }) {
  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#000' }}>
      <Text style={{ color: '#fff' }}>My New Screen</Text>
    </SafeAreaView>
  );
}
```

2. Add ke navigation di `navigation/AppNavigator.js`:

```javascript
<Stack.Screen name="MyNew" component={MyNewScreen} />
```

3. Navigate dari screen lain:

```javascript
navigation.navigate('MyNew');
```

### Adding a New Component

1. Create component di `components/`:

```javascript
// components/MyComponent.js
import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { COLORS } from '../constants/colors';

export default function MyComponent({ title }) {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{title}</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    padding: 16,
    backgroundColor: COLORS.surface,
  },
  text: {
    color: COLORS.text,
    fontSize: 14,
  },
});
```

2. Import & use di screens:

```javascript
import MyComponent from '../components/MyComponent';

// Di JSX
<MyComponent title="Hello World" />
```

### Adding API Integration

1. Create API service di `utils/`:

```javascript
// utils/api.js
import axios from 'axios';

const API_BASE_URL = 'https://api.example.com';

const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 10000,
});

export const getKosts = async (params) => {
  try {
    const response = await api.get('/kosts', { params });
    return response.data;
  } catch (error) {
    console.error('Error fetching kosts:', error);
    throw error;
  }
};

export default api;
```

2. Use di components:

```javascript
import { getKosts } from '../utils/api';

// Di screen
const [kosts, setKosts] = useState([]);
const [loading, setLoading] = useState(false);

useEffect(() => {
  const fetchKosts = async () => {
    setLoading(true);
    try {
      const data = await getKosts();
      setKosts(data);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  fetchKosts();
}, []);
```

## 🎨 Styling Guidelines

### Use Design Tokens

Always use colors dari `constants/colors.js`:

```javascript
import { COLORS, SPACING } from '../constants/colors';

const styles = StyleSheet.create({
  container: {
    backgroundColor: COLORS.surface,
    padding: SPACING.lg,
    borderRadius: 8,
  },
  text: {
    color: COLORS.text,
    fontSize: 14,
  },
});
```

### Color Palette

- **Primary**: #3b82f6 (Blue) - Actions, highlights
- **Background**: #000 (Black) - Main background
- **Surface**: #1a1a1a (Dark gray) - Cards, containers
- **Text**: #fff (White) - Primary text
- **Text Secondary**: #999 (Gray) - Secondary text
- **Border**: #333 (Dark gray) - Dividers, borders

### Spacing Scale

- `xs`: 4px - Very small gaps
- `sm`: 8px - Small margins
- `md`: 12px - Standard margins
- `lg`: 16px - Large margins
- `xl`: 20px - Extra large
- `2xl`: 24px - Page margins

### Typography

```javascript
// Use TYPOGRAPHY constants for consistency
h1: 32px, bold, line-height 40px
h2: 24px, bold, line-height 32px
h3: 20px, bold, line-height 28px
body: 14px, regular, line-height 20px
caption: 12px, semi-bold
```

## 📝 Code Style & Best Practices

### Component Structure

```javascript
import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet } from 'react-native';

// Functional component
export default function MyComponent({ prop1, prop2 }) {
  // State
  const [state, setState] = useState(null);

  // Effects
  useEffect(() => {
    // Initialize
  }, []);

  // Handlers
  const handleAction = () => {
    // Handle action
  };

  // Render
  return (
    <View style={styles.container}>
      <Text style={styles.text}>{prop1}</Text>
    </View>
  );
}

// Always at bottom
const styles = StyleSheet.create({
  container: {},
  text: {},
});
```

### Naming Conventions

- Components: PascalCase (`MyComponent.js`)
- Variables/functions: camelCase (`myVariable`, `handleClick`)
- Constants: UPPER_SNAKE_CASE (`API_URL`, `MAX_ITEMS`)
- Styles: camelCase (`container`, `headerText`)

### File Organization

- One component per file
- Related utilities in separate files
- Constants grouped by type
- Components named same as file

## 🐛 Debugging

### Using Expo DevTools

```bash
npm start
# In dev menu:
# - 'j' to open debugger
# - 'i' for iOS console
# - 'a' for Android console
```

### Using Console.log

```javascript
// In React Native
console.log('Value:', value);
console.warn('Warning:', warning);
console.error('Error:', error);
```

### React DevTools (Chrome)

```bash
# Start app
npm start

# In dev menu, select "Open Debugger"
# Then use React DevTools in Chrome
```

### Network Debugging

Use Flipper atau built-in network debugging:

```javascript
// Check network requests in Expo dev server
```

## 🧪 Testing (Future)

### Unit Tests

```bash
npm install --save-dev @testing-library/react-native jest
```

### Component Tests

```javascript
// Example test
import { render } from '@testing-library/react-native';
import MyComponent from './MyComponent';

describe('MyComponent', () => {
  it('renders correctly', () => {
    const { getByText } = render(<MyComponent />);
    expect(getByText('text')).toBeDefined();
  });
});
```

## 📦 Adding Dependencies

### New Package Installation

```bash
# Install package
npm install package-name

# With --legacy-peer-deps if needed
npm install --legacy-peer-deps package-name

# Save to package.json
npm install --save package-name
```

### Native Modules

Some packages memerlukan linking:

```bash
# Check if need linking
npx expo prebuild --clean

# Usually Expo handle automatically
```

## 🔒 Environment Variables

Create `.env` file (not committed):

```
API_URL=https://api.example.com
API_KEY=your_api_key
```

Access di code:

```javascript
const apiUrl = process.env.API_URL;
```

## 📚 Useful Resources

- [Expo Docs](https://docs.expo.dev)
- [React Native Docs](https://reactnative.dev)
- [React Navigation Docs](https://reactnavigation.org)
- [React Native API Reference](https://reactnative.dev/docs/components-and-apis)
- [Expo Go App](https://expo.dev/go)

## 🤝 Contributing

1. Create feature branch: `git checkout -b feature/my-feature`
2. Make changes following guidelines above
3. Test thoroughly
4. Commit with clear messages: `git commit -m "Add: my feature"`
5. Push & create pull request

## 🚢 Deployment Checklist

Before pushing to stores:

- [ ] All screens tested
- [ ] No console errors/warnings
- [ ] Performance optimized (no unnecessary re-renders)
- [ ] Navigation working smoothly
- [ ] API integration (if applicable) tested
- [ ] Offline mode (if applicable) handled
- [ ] All links working
- [ ] Privacy policy updated
- [ ] Version number updated
- [ ] Test on physical device

---

Happy coding! If you have questions, refer to documentation links above. 🎉
