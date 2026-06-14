import React, { useState, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  StyleSheet,
  FlatList,
  TouchableOpacity,
} from 'react-native';
import Header from '../components/Header';
import SearchFilter from '../components/SearchFilter';
import KostCard from '../components/KostCard';
import { KOSTS_DATA, FEATURES, AMENITIES } from '../data/kosts';

export default function HomeScreen({ navigation }) {
  const [searchQuery, setSearchQuery] = useState('');
  const [filters, setFilters] = useState({
    location: null,
    type: null,
    budget: null,
  });
  const [activeAmenity, setActiveAmenity] = useState(0);

  const filteredKosts = useMemo(() => {
    return KOSTS_DATA.filter((kost) => {
      const searchLower = searchQuery.toLowerCase();
      const matchSearch =
        kost.name.toLowerCase().includes(searchLower) ||
        kost.location.toLowerCase().includes(searchLower) ||
        kost.address.toLowerCase().includes(searchLower);

      const matchLocation = !filters.location || kost.location === filters.location;
      const matchType = !filters.type || kost.type === filters.type;
      const matchBudget = !filters.budget || kost.price <= filters.budget;

      return matchSearch && matchLocation && matchType && matchBudget;
    });
  }, [searchQuery, filters]);

  const handleKostPress = (kost) => {
    navigation.navigate('Detail', { kost });
  };

  return (
    <View style={styles.container}>
      <Header
        title="Di"
        onMenuPress={() => console.log('Menu pressed')}
        onLoginPress={() => navigation.navigate('Login')}
      />

      <FlatList
        data={[{ id: 'hero' }]}
        renderItem={() => (
          <View>
            {/* Hero Section */}
            <View style={styles.heroSection}>
              <Text style={styles.heroSubtitle}>PREMIUM LIVING EXPERIENCE</Text>
              <Text style={styles.heroTitle}>
                Elegance in{'\n'}Every Square{'\n'}Meter.
              </Text>
              <Text style={styles.heroDescription}>
                Discover meticulously designed modular spaces that adapt to your lifestyle. Simplicity meets sophisticated comfort.
              </Text>

              {/* Stats */}
              <View style={styles.statsContainer}>
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>120+</Text>
                  <Text style={styles.statLabel}>PROPERTI</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>92.4%</Text>
                  <Text style={styles.statLabel}>OKUPANSI</Text>
                </View>
                <View style={styles.statBox}>
                  <Text style={styles.statNumber}>4.9★</Text>
                  <Text style={styles.statLabel}>RATING</Text>
                </View>
              </View>
            </View>

            {/* Search & Filter */}
            <SearchFilter
              searchValue={searchQuery}
              onSearch={setSearchQuery}
              onFilterChange={setFilters}
            />

            {/* Features Section */}
            <View style={styles.featuresSection}>
              <Text style={styles.sectionTitle}>Mengapa Pilih Di?</Text>
              {FEATURES.map((feature) => (
                <View key={feature.id} style={styles.featureItem}>
                  <View style={styles.featureIcon}>
                    <Text style={styles.featureIconText}>{feature.icon}</Text>
                  </View>
                  <View style={styles.featureContent}>
                    <Text style={styles.featureTitle}>{feature.title}</Text>
                    <Text style={styles.featureDescription}>
                      {feature.description}
                    </Text>
                  </View>
                </View>
              ))}
            </View>

            {/* Amenities Section */}
            <View style={styles.amenitiesSection}>
              <Text style={styles.sectionTitle}>Fasilitas Premium</Text>
              <ScrollView
                horizontal
                showsHorizontalScrollIndicator={false}
                style={styles.amenitiesScroll}
              >
                {AMENITIES.map((amenity, index) => (
                  <TouchableOpacity
                    key={index}
                    style={[
                      styles.amenityCard,
                      activeAmenity === index && styles.amenityCardActive,
                    ]}
                    onPress={() => setActiveAmenity(index)}
                  >
                    <Text
                      style={[
                        styles.amenityText,
                        activeAmenity === index && styles.amenityTextActive,
                      ]}
                    >
                      {amenity}
                    </Text>
                  </TouchableOpacity>
                ))}
              </ScrollView>
            </View>

            {/* Kosts List Section */}
            <View style={styles.listSection}>
              <View style={styles.listHeader}>
                <Text style={styles.listTitle}>Koleksi Kamar Premium</Text>
                <Text style={styles.resultCount}>{filteredKosts.length} Units</Text>
              </View>

              {filteredKosts.length === 0 ? (
                <View style={styles.emptyState}>
                  <Text style={styles.emptyStateText}>
                    Tidak ada kost yang sesuai dengan filter Anda.
                  </Text>
                  <TouchableOpacity
                    style={styles.resetButton}
                    onPress={() => {
                      setSearchQuery('');
                      setFilters({ location: null, type: null, budget: null });
                    }}
                  >
                    <Text style={styles.resetButtonText}>Reset Filter</Text>
                  </TouchableOpacity>
                </View>
              ) : (
                <View style={styles.kostsList}>
                  {filteredKosts.map((kost) => (
                    <KostCard
                      key={kost.id}
                      kost={kost}
                      onPress={() => handleKostPress(kost)}
                    />
                  ))}
                </View>
              )}
            </View>
          </View>
        )}
        keyExtractor={() => 'hero'}
        scrollEnabled={false}
        contentContainerStyle={styles.flatListContent}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000',
  },
  flatListContent: {
    flexGrow: 1,
  },
  heroSection: {
    paddingHorizontal: 16,
    paddingTop: 24,
    paddingBottom: 20,
    backgroundColor: '#000',
  },
  heroSubtitle: {
    color: '#666',
    fontSize: 12,
    fontWeight: '600',
    letterSpacing: 1,
    marginBottom: 12,
  },
  heroTitle: {
    color: '#fff',
    fontSize: 32,
    fontWeight: '700',
    marginBottom: 16,
    lineHeight: 40,
  },
  heroDescription: {
    color: '#999',
    fontSize: 14,
    lineHeight: 20,
    marginBottom: 24,
  },
  statsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 20,
  },
  statBox: {
    flex: 1,
    backgroundColor: '#1a1a1a',
    paddingVertical: 12,
    paddingHorizontal: 12,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    alignItems: 'center',
  },
  statNumber: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '700',
    marginBottom: 4,
  },
  statLabel: {
    color: '#666',
    fontSize: 10,
    fontWeight: '600',
    letterSpacing: 0.5,
  },
  featuresSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: '#000',
  },
  sectionTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    marginBottom: 20,
    gap: 12,
  },
  featureIcon: {
    width: 48,
    height: 48,
    backgroundColor: '#1a1a1a',
    borderRadius: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#333',
  },
  featureIconText: {
    fontSize: 24,
  },
  featureContent: {
    flex: 1,
  },
  featureTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 4,
  },
  featureDescription: {
    color: '#999',
    fontSize: 12,
    lineHeight: 18,
  },
  amenitiesSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: '#000',
  },
  amenitiesScroll: {
    marginHorizontal: -16,
    paddingHorizontal: 16,
  },
  amenityCard: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 8,
    marginRight: 8,
    borderWidth: 1,
    borderColor: '#333',
    minWidth: 160,
  },
  amenityCardActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  amenityText: {
    color: '#999',
    fontSize: 12,
    fontWeight: '600',
    textAlign: 'center',
  },
  amenityTextActive: {
    color: '#fff',
  },
  listSection: {
    paddingHorizontal: 16,
    paddingVertical: 24,
    backgroundColor: '#000',
  },
  listHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  listTitle: {
    color: '#fff',
    fontSize: 20,
    fontWeight: '700',
  },
  resultCount: {
    color: '#999',
    fontSize: 12,
  },
  kostsList: {
    gap: 16,
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  emptyStateText: {
    color: '#999',
    fontSize: 14,
    marginBottom: 16,
    textAlign: 'center',
  },
  resetButton: {
    backgroundColor: '#3b82f6',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 8,
  },
  resetButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '600',
  },
});
