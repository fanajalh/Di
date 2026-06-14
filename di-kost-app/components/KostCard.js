import React from 'react';
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
} from 'react-native';

export default function KostCard({ kost, onPress }) {
  const formatPrice = (price) => {
    return `Rp ${(price / 1000000).toFixed(1)}jt`;
  };

  return (
    <TouchableOpacity style={styles.container} onPress={onPress}>
      <View style={styles.imageContainer}>
        <Image
          source={{ uri: kost.image }}
          style={styles.image}
          resizeMode="cover"
        />
        <View style={styles.badgesContainer}>
          {kost.badges.map((badge, index) => (
            <View key={index} style={styles.badge}>
              <Text style={styles.badgeText}>{badge}</Text>
            </View>
          ))}
        </View>
        {kost.verified && (
          <View style={styles.verifiedBadge}>
            <Text style={styles.verifiedText}>✓ Terverifikasi</Text>
          </View>
        )}
      </View>

      <View style={styles.content}>
        <View style={styles.headerRow}>
          <Text style={styles.name} numberOfLines={2}>
            {kost.name}
          </Text>
          <View style={styles.ratingContainer}>
            <Text style={styles.rating}>⭐ {kost.rating}</Text>
          </View>
        </View>

        <Text style={styles.location}>📍 {kost.location}</Text>

        <View style={styles.facilitiesContainer}>
          {kost.facilities.slice(0, 3).map((facility, index) => (
            <View key={index} style={styles.facilityTag}>
              <Text style={styles.facilityText}>{facility}</Text>
            </View>
          ))}
          {kost.facilities.length > 3 && (
            <View style={styles.facilityTag}>
              <Text style={styles.facilityText}>+{kost.facilities.length - 3}</Text>
            </View>
          )}
        </View>

        <View style={styles.footerRow}>
          <Text style={styles.price}>{formatPrice(kost.price)}</Text>
          <Text style={styles.occupancy}>{kost.occupancy} Terisi</Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    overflow: 'hidden',
    marginBottom: 16,
    borderWidth: 1,
    borderColor: '#333',
  },
  imageContainer: {
    position: 'relative',
    width: '100%',
    height: 200,
  },
  image: {
    width: '100%',
    height: '100%',
  },
  badgesContainer: {
    position: 'absolute',
    top: 12,
    left: 12,
    flexDirection: 'row',
    gap: 8,
  },
  badge: {
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 20,
  },
  badgeText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 12,
    right: 12,
    backgroundColor: 'rgba(0, 0, 0, 0.7)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 20,
  },
  verifiedText: {
    color: '#4ade80',
    fontSize: 12,
    fontWeight: '600',
  },
  content: {
    padding: 16,
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 8,
    gap: 8,
  },
  name: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
    flex: 1,
  },
  ratingContainer: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  rating: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  location: {
    color: '#999',
    fontSize: 13,
    marginBottom: 10,
  },
  facilitiesContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
    marginBottom: 12,
  },
  facilityTag: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 6,
  },
  facilityText: {
    color: '#ccc',
    fontSize: 11,
  },
  footerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 12,
    borderTopWidth: 1,
    borderTopColor: '#333',
  },
  price: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
  occupancy: {
    color: '#999',
    fontSize: 12,
  },
});
