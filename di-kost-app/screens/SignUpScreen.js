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

export default function SignUpScreen({ navigation }) {
  const [fullName, setFullName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [agreedToTerms, setAgreedToTerms] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const handleSignUp = () => {
    if (!fullName.trim()) {
      Alert.alert('Validasi', 'Silakan masukkan nama lengkap');
      return;
    }
    if (!email.trim()) {
      Alert.alert('Validasi', 'Silakan masukkan email');
      return;
    }
    if (!phone.trim()) {
      Alert.alert('Validasi', 'Silakan masukkan nomor telepon');
      return;
    }
    if (!password.trim()) {
      Alert.alert('Validasi', 'Silakan masukkan password');
      return;
    }
    if (password !== confirmPassword) {
      Alert.alert('Validasi', 'Password tidak cocok');
      return;
    }
    if (!agreedToTerms) {
      Alert.alert('Validasi', 'Anda harus menerima syarat dan ketentuan');
      return;
    }

    setIsLoading(true);
    // Simulate sign up
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Pendaftaran Berhasil',
        `Selamat datang, ${fullName}!\n\nAkun Anda telah dibuat.`,
        [{ text: 'OK', onPress: () => navigation.goBack() }]
      );
    }, 2000);
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
          <Text style={styles.logoIcon}>🎉</Text>
          <Text style={styles.logoText}>Daftar Akun Baru</Text>
          <Text style={styles.subtitle}>Bergabunglah dengan komunitas Di</Text>
        </View>

        {/* Form Section */}
        <View style={styles.formSection}>
          {/* Full Name Input */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Nama Lengkap</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>👤</Text>
              <TextInput
                style={styles.input}
                placeholder="Nama lengkap Anda"
                placeholderTextColor="#666"
                value={fullName}
                onChangeText={setFullName}
                editable={!isLoading}
              />
            </View>
          </View>

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

          {/* Phone Input */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Nomor Telepon</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>📞</Text>
              <TextInput
                style={styles.input}
                placeholder="08xx xxxx xxxx"
                placeholderTextColor="#666"
                value={phone}
                onChangeText={setPhone}
                keyboardType="phone-pad"
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
                placeholder="Minimal 6 karakter"
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

          {/* Confirm Password Input */}
          <View style={styles.formGroup}>
            <Text style={styles.label}>Konfirmasi Password</Text>
            <View style={styles.inputContainer}>
              <Text style={styles.inputIcon}>🔒</Text>
              <TextInput
                style={styles.input}
                placeholder="Ulangi password"
                placeholderTextColor="#666"
                value={confirmPassword}
                onChangeText={setConfirmPassword}
                secureTextEntry={!showConfirmPassword}
                editable={!isLoading}
              />
              <TouchableOpacity onPress={() => setShowConfirmPassword(!showConfirmPassword)}>
                <Text style={styles.eyeIcon}>{showConfirmPassword ? '👁️' : '👁️‍🗨️'}</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Terms & Conditions */}
          <TouchableOpacity
            style={styles.termsContainer}
            onPress={() => setAgreedToTerms(!agreedToTerms)}
          >
            <View style={[styles.checkbox, agreedToTerms && styles.checkboxActive]}>
              {agreedToTerms && <Text style={styles.checkmark}>✓</Text>}
            </View>
            <Text style={styles.termsText}>
              Saya setuju dengan{' '}
              <Text style={styles.termsLink}>Syarat & Ketentuan</Text>
              {' '}dan{' '}
              <Text style={styles.termsLink}>Kebijakan Privasi</Text>
            </Text>
          </TouchableOpacity>

          {/* Sign Up Button */}
          <TouchableOpacity
            style={[styles.signUpButton, isLoading && styles.signUpButtonDisabled]}
            onPress={handleSignUp}
            disabled={isLoading}
          >
            <Text style={styles.signUpButtonText}>
              {isLoading ? 'Sedang Mendaftar...' : 'Daftar Sekarang'}
            </Text>
          </TouchableOpacity>

          {/* Login Link */}
          <View style={styles.loginContainer}>
            <Text style={styles.loginText}>Sudah punya akun? </Text>
            <TouchableOpacity onPress={() => navigation.navigate('Login')}>
              <Text style={styles.loginLink}>Masuk di sini</Text>
            </TouchableOpacity>
          </View>
        </View>

        {/* Benefits Section */}
        <View style={styles.benefitsBox}>
          <Text style={styles.benefitsTitle}>✨ Keuntungan Mendaftar</Text>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>⚡</Text>
            <Text style={styles.benefitText}>Booking Instan - Proses cepat dan mudah</Text>
          </View>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>💬</Text>
            <Text style={styles.benefitText}>Chat Langsung - Tanya langsung ke pemilik</Text>
          </View>
          <View style={styles.benefitItem}>
            <Text style={styles.benefitIcon}>❤️</Text>
            <Text style={styles.benefitText}>Wishlist - Simpan kost favorit Anda</Text>
          </View>
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
    paddingVertical: 32,
  },
  logoIcon: {
    fontSize: 44,
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
    marginBottom: 24,
  },
  formGroup: {
    marginBottom: 16,
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
  termsContainer: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 20,
    gap: 10,
  },
  checkbox: {
    width: 20,
    height: 20,
    borderWidth: 1,
    borderColor: '#333',
    borderRadius: 6,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    marginTop: 2,
  },
  checkboxActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  checkmark: {
    color: '#fff',
    fontWeight: '700',
  },
  termsText: {
    color: '#999',
    fontSize: 12,
    lineHeight: 18,
    flex: 1,
  },
  termsLink: {
    color: '#3b82f6',
    fontWeight: '600',
  },
  signUpButton: {
    backgroundColor: '#3b82f6',
    paddingVertical: 14,
    borderRadius: 10,
    alignItems: 'center',
    marginBottom: 16,
  },
  signUpButtonDisabled: {
    backgroundColor: '#1e40af',
    opacity: 0.7,
  },
  signUpButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  loginContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  loginText: {
    color: '#999',
    fontSize: 13,
  },
  loginLink: {
    color: '#3b82f6',
    fontSize: 13,
    fontWeight: '700',
  },
  benefitsBox: {
    marginHorizontal: 16,
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 14,
    paddingVertical: 14,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#333',
  },
  benefitsTitle: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
    marginBottom: 12,
  },
  benefitItem: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 10,
  },
  benefitIcon: {
    fontSize: 14,
    marginTop: 1,
  },
  benefitText: {
    color: '#999',
    fontSize: 12,
    flex: 1,
    lineHeight: 16,
  },
});
