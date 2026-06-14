import React, { useState } from 'react';
import {
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  SafeAreaView,
  Modal,
  TextInput,
} from 'react-native';

export default function DetailScreen({ route, navigation }) {
  const { kost } = route.params;
  const [showChat, setShowChat] = useState(false);
  const [chatMessage, setChatMessage] = useState('');

  const formatPrice = (price) => {
    return `Rp ${(price / 1000000).toFixed(1)}jt`;
  };

  const handleBooking = () => {
    alert('Fitur booking akan segera tersedia!');
  };

  const handleChat = () => {
    setShowChat(true);
  };

  const sendMessage = () => {
    if (chatMessage.trim()) {
      alert(`Pesan terkirim: ${chatMessage}\n\nTerima kasih telah menghubungi kami!`);
      setChatMessage('');
      setShowChat(false);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      {/* Header */}
      <View style={styles.header}>
        <TouchableOpacity onPress={() => navigation.goBack()}>
          <Text style={styles.backButton}>← Kembali</Text>
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Detail Kost</Text>
        <Text style={styles.headerPlaceholder}></Text>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Image */}
        <Image
          source={{ uri: kost.image }}
          style={styles.image}
          resizeMode="cover"
        />

        {/* Badges */}
        <View style={styles.badgesContainer}>
          {kost.badges.map((badge, index) => (
            <View key={index} style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          ))}
        </View>

        {/* Content */}
        <View style={styles.contentPadding}>
          {/* Title & Rating */}
          <View style={styles.titleSection}>
            <View style={{ flex: 1 }}>
              <Text style={styles.title}>{kost.name}</Text>
              <Text style={styles.location}>📍 {kost.location}</Text>
              <Text style={styles.address}>{kost.address}</Text>
            </View>
            <View style={styles.ratingBox}>
              <Text style={styles.rating}>⭐</Text>
              <Text style={styles.ratingNumber}>{kost.rating}</Text>
            </View>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Deskripsi</Text>
            <Text style={styles.description}>{kost.description}</Text>
          </View>

          {/* Price & Occupancy */}
          <View style={styles.priceSection}>
            <View>
              <Text style={styles.priceLabel}>Harga</Text>
              <Text style={styles.price}>{formatPrice(kost.price)}/bulan</Text>
            </View>
            <View>
              <Text style={styles.priceLabel}>Okupansi</Text>
              <Text style={styles.price}>{kost.occupancy}</Text>
            </View>
          </View>

          {/* Facilities */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fasilitas Kamar</Text>
            <View style={styles.facilitiesContainer}>
              {kost.facilities.map((facility, index) => (
                <View key={index} style={styles.facilityItem}>
                  <View style={styles.facilityDot}></View>
                  <Text style={styles.facilityText}>{facility}</Text>
                </View>
              ))}
            </View>
          </View>

          {/* Building Amenities */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Fasilitas Gedung</Text>
            <View style={styles.amenitiesGrid}>
              <View style={styles.amenityItem}>
                <Text style={styles.amenityIcon}>🔐</Text>
                <Text style={styles.amenityLabel}>Smart Lock</Text>
              </View>
              <View style={styles.amenityItem}>
                <Text style={styles.amenityIcon}>🚀</Text>
                <Text style={styles.amenityLabel}>High Speed WiFi</Text>
              </View>
              <View style={styles.amenityItem}>
                <Text style={styles.amenityIcon}>🛡️</Text>
                <Text style={styles.amenityLabel}>24/7 Security</Text>
              </View>
              <View style={styles.amenityItem}>
                <Text style={styles.amenityIcon}>🛏️</Text>
                <Text style={styles.amenityLabel}>Premium Room</Text>
              </View>
            </View>
          </View>

          {/* About */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Tentang Properti</Text>
            <View style={styles.infoBox}>
              <Text style={styles.infoText}>
                Properti ini telah melalui proses verifikasi ketat untuk memastikan kualitas dan kenyamanan hunian Anda.
              </Text>
              <View style={styles.verifiedBadge}>
                <Text style={styles.verifiedIcon}>✓</Text>
                <Text style={styles.verifiedText}>Terverifikasi</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Bottom Spacing */}
        <View style={{ height: 100 }} />
      </ScrollView>

      {/* Action Buttons */}
      <View style={styles.actionBar}>
        <TouchableOpacity
          style={styles.secondaryButton}
          onPress={handleChat}
        >
          <Text style={styles.buttonIcon}>💬</Text>
          <Text style={styles.buttonText}>Chat</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.primaryButton}
          onPress={handleBooking}
        >
          <Text style={styles.primaryButtonText}>Booking Instan</Text>
        </TouchableOpacity>
      </View>

      {/* Chat Modal */}
      <Modal
        visible={showChat}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowChat(false)}
      >
        <View style={styles.chatModalContainer}>
          <View style={styles.chatModalContent}>
            <View style={styles.chatHeader}>
              <Text style={styles.chatTitle}>Chat dengan Pemilik</Text>
              <TouchableOpacity onPress={() => setShowChat(false)}>
                <Text style={styles.chatClose}>✕</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.chatMessages}>
              <View style={styles.chatMessage}>
                <View style={styles.messageBubble}>
                  <Text style={styles.messageText}>
                    Halo! Ada yang bisa kami bantu?
                  </Text>
                </View>
                <Text style={styles.messageTime}>10:30</Text>
              </View>
            </View>

            <View style={styles.chatInput}>
              <TextInput
                style={styles.textInput}
                placeholder="Ketik pesan..."
                placeholderTextColor="#666"
                value={chatMessage}
                onChangeText={setChatMessage}
                multiline
                maxLength={200}
              />
              <TouchableOpacity
                style={styles.sendButton}
                onPress={sendMessage}
              >
                <Text style={styles.sendIcon}>➤</Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
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
  headerTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  headerPlaceholder: {
    width: 40,
  },
  content: {
    flex: 1,
  },
  image: {
    width: '100%',
    height: 300,
  },
  badgesContainer: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 16,
    paddingVertical: 12,
    flexWrap: 'wrap',
  },
  badge: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
    borderWidth: 1,
    borderColor: '#333',
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
  contentPadding: {
    paddingHorizontal: 16,
  },
  titleSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    gap: 12,
    marginBottom: 20,
    paddingTop: 8,
  },
  title: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 8,
    lineHeight: 28,
  },
  location: {
    color: '#999',
    fontSize: 13,
    marginBottom: 4,
  },
  address: {
    color: '#666',
    fontSize: 12,
  },
  ratingBox: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  rating: {
    fontSize: 20,
  },
  ratingNumber: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    marginTop: 2,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 12,
  },
  description: {
    color: '#999',
    fontSize: 14,
    lineHeight: 20,
  },
  priceSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    marginBottom: 24,
    borderWidth: 1,
    borderColor: '#333',
  },
  priceLabel: {
    color: '#666',
    fontSize: 12,
    fontWeight: '500',
    marginBottom: 6,
  },
  price: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  facilitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  facilityItem: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 12,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 8,
  },
  facilityDot: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: '#3b82f6',
    marginRight: 8,
  },
  facilityText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  amenitiesGrid: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 12,
  },
  amenityItem: {
    flex: 1,
    minWidth: '45%',
    backgroundColor: '#1a1a1a',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  amenityIcon: {
    fontSize: 24,
    marginBottom: 8,
  },
  amenityLabel: {
    color: '#fff',
    fontSize: 11,
    fontWeight: '600',
    textAlign: 'center',
  },
  infoBox: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  infoText: {
    color: '#999',
    fontSize: 13,
    lineHeight: 20,
    marginBottom: 12,
  },
  verifiedBadge: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(74, 222, 128, 0.1)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 6,
    borderWidth: 1,
    borderColor: '#4ade80',
  },
  verifiedIcon: {
    fontSize: 16,
    color: '#4ade80',
    marginRight: 6,
  },
  verifiedText: {
    color: '#4ade80',
    fontSize: 12,
    fontWeight: '600',
  },
  actionBar: {
    flexDirection: 'row',
    gap: 12,
    paddingHorizontal: 16,
    paddingVertical: 12,
    backgroundColor: '#000',
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  secondaryButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    backgroundColor: '#1a1a1a',
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    gap: 6,
  },
  buttonIcon: {
    fontSize: 16,
  },
  buttonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '600',
  },
  primaryButton: {
    flex: 2,
    backgroundColor: '#3b82f6',
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  primaryButtonText: {
    color: '#fff',
    fontSize: 13,
    fontWeight: '700',
  },
  chatModalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  chatModalContent: {
    backgroundColor: '#0a0a0a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingTop: 16,
  },
  chatHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  chatTitle: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
  },
  chatClose: {
    fontSize: 20,
    color: '#999',
  },
  chatMessages: {
    maxHeight: 250,
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  chatMessage: {
    marginBottom: 12,
  },
  messageBubble: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: '#333',
    marginBottom: 4,
  },
  messageText: {
    color: '#fff',
    fontSize: 13,
  },
  messageTime: {
    color: '#666',
    fontSize: 11,
    marginLeft: 8,
  },
  chatInput: {
    flexDirection: 'row',
    gap: 8,
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#222',
  },
  textInput: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    color: '#fff',
    paddingHorizontal: 14,
    paddingVertical: 10,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    fontSize: 13,
    maxHeight: 80,
  },
  sendButton: {
    backgroundColor: '#3b82f6',
    width: 40,
    height: 40,
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
  },
  sendIcon: {
    fontSize: 16,
    color: '#fff',
  },
});
