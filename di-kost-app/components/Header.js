import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Platform,
  SafeAreaView,
} from 'react-native';

export default function Header({ title, onMenuPress, onLoginPress, showMenu = true }) {
  return (
    <SafeAreaView style={styles.safeArea}>
      <View style={styles.container}>
        <View style={styles.leftSection}>
          {showMenu ? (
            <TouchableOpacity onPress={onMenuPress} style={styles.menuButton}>
              <Text style={styles.menuIcon}>☰</Text>
            </TouchableOpacity>
          ) : null}
          <View>
            <Text style={styles.logo}>📍 Di</Text>
            <Text style={styles.subtitle}>PREMIUM LIVING</Text>
          </View>
        </View>

        <View style={styles.rightSection}>
          {onLoginPress && (
            <TouchableOpacity
              onPress={onLoginPress}
              style={styles.loginButton}
            >
              <Text style={styles.loginText}>Masuk Akun</Text>
            </TouchableOpacity>
          )}
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safeArea: {
    backgroundColor: '#000',
  },
  container: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#000',
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  leftSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  menuButton: {
    padding: 8,
  },
  menuIcon: {
    fontSize: 24,
    color: '#fff',
    fontWeight: '600',
  },
  logo: {
    fontSize: 18,
    fontWeight: '700',
    color: '#fff',
  },
  subtitle: {
    fontSize: 10,
    color: '#999',
    fontWeight: '500',
    marginTop: 2,
  },
  rightSection: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  loginButton: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  loginText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
