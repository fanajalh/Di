import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  ScrollView,
  Alert,
} from 'react-native';

export default function LoginScreen({ navigation }) {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = () => {
    if (!email.trim()) {
      Alert.alert('Validasi', 'Silakan masukkan email Anda');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Validasi', 'Silakan masukkan password Anda');
      return;
    }

    setIsLoading(true);
    // Simulate login
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Login Berhasil',
        `Selamat datang, ${email}!`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }, 2000);
  };

  const handleSignUp = () => {
    navigation.navigate('SignUp');
  };

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView contentContainerStyle={styles.scrollContent}>
        {/* Header */}
        <View style={styles.header}>
          <TouchableOpacity onPress={() => navigation.goBack()}>
            <Text style={styles.backButton}>← Kembali</Text>
          </TouchableOpacity>
        </View>

        {/* Logo Section */}
        <View style={styles.logoSection}>
          <Text style={styles.logoIcon}>🏠</Text>
          <Text style={styles.logoText}>Di - Sewa Kost Premium</Text>
          <Text style={styles.subtitle}>Masuk ke akun Anda</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          {/* Email Input */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Email</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>✉️</Text>
              <TextInput
                style={styles.input}
                placeholder="nama@email.com"
                placeholderTextColor="#666"
                value={email}
                onChangeText={setEmail}
                keyboardType="email-address"
                editable={!isLoading}
              />
            </View>
          </View>

          {/* Password Input */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Password</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder="Masukkan password"
                placeholderTextColor="#666"
                value={password}
                onChangeText={setPassword}
                secureTextEntry={!showPassword}
                editable={!isLoading}
              />
              <TouchableOpacity onPress={() => setShowPassword(!showPassword)}>
                <Text style={styles.eyeIcon}>{showPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Forgot Password */}
          <TouchableOpacity>
            <Text style={styles.forgotPassword}>Lupa Password?</Text>
          </TouchableOpacity>

          {/* Login Button */}
          <TouchableOpacity
            style={[styles.loginButton, isLoading && styles.loginButtonDisabled]}
            onPress={handleLogin}
            disabled={isLoading}
          >
            <Text style={styles.loginButtonText}>
              {isLoading ? 'Sedang Masuk...' : 'Masuk'}
            </Text>
          </TouchableOpacity>

          {/* Divider */}
          <View style={styles.dividerContainer}>
            <View style={styles.dividerLine} />
            <Text style={styles.dividerText}>atau</Text>
            <View style={styles.dividerLine} />
          </View>

          {/* Social Login */}
          <View style={styles.socialContainer}>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialIcon}>f</Text>
              <Text style={styles.socialText}>Facebook</Text>
            </TouchableOpacity>
            <TouchableOpacity style={styles.socialButton}>
              <Text style={styles.socialIcon}>G</Text>
              <Text style={styles.socialText}>Google</Text>
            </TouchableOpacity>
          </View>

          {/* Sign Up Link */}
          <View style={styles.signUpContainer}>
            <Text style={styles.signUpText}>Belum punya akun? </Text>
            <TouchableOpacity onPress={handleSignUp}>
              <Text style={styles.signUpLink}>Daftar di sini</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Bottom Info */}
        <View style={styles.infoBox}>
          <Text style={styles.infoTitle}>💡 Info Penting</Text>
          <Text style={styles.infoText}>
            Akun Anda akan memberikan akses ke fitur booking instan, chat langsung dengan pemilik, dan histori pencarian kost Anda.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  scrollContent: {
    flexGrow: 1,
    paddingBottom: 20,
  },
  header: {
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  backButton: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '600',
  },
  logoSection: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  logoIcon: {
    fontSize: 48,
    marginBottom: 16,
  },
  logoText: {
    color: '#fff',
    fontSize: 22,
    fontWeight: '700',
    marginBottom: 8,
  },
  subtitle: {
    color: '#999',
    fontSize: 14,
  },
  formSection: {
    paddingHorizontal: 16,
    marginBottom: 32,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
    marginBottom: 8,
  },
  inputContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 10,
    paddingHorizontal: 14,
    height: 48,
  },
  inputIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  input: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
  },
  eyeIcon: {
    fontSize: 16,
    marginLeft: 8,
  },
  forgotPassword: {
    color: '#3b82f6',
    fontSize: 12,
    fontWeight: '600',
    marginBottom: 20,
    textAlign: 'right',
  },
  loginButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 24,
  },
  loginButtonDisabled: {
    backgroundColor: '#1e40af',
    opacity: 0.7,
  },
  loginButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  dividerContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  dividerLine: {
    flex: 1,
    height: 1,
    backgroundColor: '#333',
  },
  dividerText: {
    color: '#666',
    fontSize: 12,
    marginHorizontal: 12,
  },
  socialContainer: {
    gap: 12,
    marginBottom: 24,
  },
  socialButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
    borderWidth: 1,
    borderColor: '#333',
    paddingVertical: 12,
    borderRadius: 10,
    gap: 8,
  },
  socialIcon: {
    fontSize: 16,
    color: '#fff',
    fontWeight: '700',
  },
  socialText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  signUpContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  signUpText: {
    color: '#999',
    fontSize: 13,
  },
  signUpLink: {
    color: '#3b82f6',
    fontSize: 13,
    fontWeight: '700',
  },
  infoBox: {
    marginHorizontal: 16,
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  infoTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 8,
  },
  infoText: {
    color: '#999',
    fontSize: 12,
    lineHeight: 18,
  },
});
