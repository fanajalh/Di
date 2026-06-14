import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  TextInput,
  StyleSheet,
  ScrollView,
  Modal,
} from 'react-native';

export default function SearchFilter({
  onSearch,
  onFilterChange,
  searchValue,
}) {
  const [showFilters, setShowFilters] = useState(false);
  const [selectedFilters, setSelectedFilters] = useState({
    location: null,
    type: null,
    budget: null,
  });

  const locations = ['Semua', 'Jakarta Pusat', 'Jakarta Selatan', 'Bandung', 'Yogyakarta', 'Surabaya'];
  const types = ['Semua', 'Putra', 'Putri', 'Campur'];
  const budgets = [
    { label: 'Semua', value: null },
    { label: 'Di bawah 2.5jt', value: 2500000 },
    { label: '2.5 - 3.5jt', value: 3500000 },
    { label: '3.5 - 4.5jt', value: 4500000 },
    { label: 'Di atas 4.5jt', value: 5000000 },
  ];

  const handleFilterSelect = (filterType, value) => {
    const newFilters = {
      ...selectedFilters,
      [filterType]: selectedFilters[filterType] === value ? null : value,
    };
    setSelectedFilters(newFilters);
    onFilterChange(newFilters);
  };

  const handleReset = () => {
    setSelectedFilters({ location: null, type: null, budget: null });
    onFilterChange({ location: null, type: null, budget: null });
    onSearch('');
  };

  return (
    <View>
      <View style={styles.searchContainer}>
        <Text style={styles.searchIcon}>🔍</Text>
        <TextInput
          style={styles.searchInput}
          placeholder="Cari nama kost atau lokasi..."
          placeholderTextColor="#666"
          value={searchValue}
          onChangeText={onSearch}
        />
      </View>

      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        style={styles.filterRow}
        contentContainerStyle={styles.filterContent}
      >
        <TouchableOpacity
          style={styles.filterButton}
          onPress={() => setShowFilters(!showFilters)}
        >
          <Text style={styles.filterButtonIcon}>⚙️</Text>
          <Text style={styles.filterButtonText}>Filter</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterButtonText}>📍 Lokasi</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterButtonText}>👥 Tipe</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterButtonText}>💰 Budget</Text>
        </TouchableOpacity>

        <TouchableOpacity style={styles.filterButton}>
          <Text style={styles.filterButtonText}>⭐ Fasilitas</Text>
        </TouchableOpacity>

        {(selectedFilters.location || selectedFilters.type || selectedFilters.budget) && (
          <TouchableOpacity
            style={[styles.filterButton, styles.resetButton]}
            onPress={handleReset}
          >
            <Text style={styles.resetText}>Reset</Text>
          </TouchableOpacity>
        )}
      </ScrollView>

      <Modal
        visible={showFilters}
        transparent={true}
        animationType="slide"
        onRequestClose={() => setShowFilters(false)}
      >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <View style={styles.modalHeader}>
              <Text style={styles.modalTitle}>Filter Kost</Text>
              <TouchableOpacity onPress={() => setShowFilters(false)}>
                <Text style={styles.closeButton}>✕</Text>
              </TouchableOpacity>
            </View>

            <ScrollView style={styles.filterOptions}>
              {/* Lokasi */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>📍 Lokasi</Text>
                <View style={styles.optionsContainer}>
                  {locations.map((location) => (
                    <TouchableOpacity
                      key={location}
                      style={[
                        styles.optionButton,
                        selectedFilters.location === (location === 'Semua' ? null : location) &&
                          styles.optionButtonActive,
                      ]}
                      onPress={() =>
                        handleFilterSelect('location', location === 'Semua' ? null : location)
                      }
                    >
                      <Text
                        style={[
                          styles.optionText,
                          selectedFilters.location === (location === 'Semua' ? null : location) &&
                            styles.optionTextActive,
                        ]}
                      >
                        {location}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Tipe */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>👥 Tipe Kost</Text>
                <View style={styles.optionsContainer}>
                  {types.map((type) => (
                    <TouchableOpacity
                      key={type}
                      style={[
                        styles.optionButton,
                        selectedFilters.type === (type === 'Semua' ? null : type) &&
                          styles.optionButtonActive,
                      ]}
                      onPress={() =>
                        handleFilterSelect('type', type === 'Semua' ? null : type)
                      }
                    >
                      <Text
                        style={[
                          styles.optionText,
                          selectedFilters.type === (type === 'Semua' ? null : type) &&
                            styles.optionTextActive,
                        ]}
                      >
                        {type}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>

              {/* Budget */}
              <View style={styles.filterSection}>
                <Text style={styles.filterSectionTitle}>💰 Budget</Text>
                <View style={styles.optionsContainer}>
                  {budgets.map((budget) => (
                    <TouchableOpacity
                      key={budget.label}
                      style={[
                        styles.optionButton,
                        selectedFilters.budget === budget.value &&
                          styles.optionButtonActive,
                      ]}
                      onPress={() =>
                        handleFilterSelect('budget', budget.value)
                      }
                    >
                      <Text
                        style={[
                          styles.optionText,
                          selectedFilters.budget === budget.value &&
                            styles.optionTextActive,
                        ]}
                      >
                        {budget.label}
                      </Text>
                    </TouchableOpacity>
                  ))}
                </View>
              </View>
            </ScrollView>

            <TouchableOpacity
              style={styles.applyButton}
              onPress={() => setShowFilters(false)}
            >
              <Text style={styles.applyButtonText}>Terapkan Filter</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </View>
  );
}

const styles = StyleSheet.create({
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#1a1a1a',
    borderRadius: 12,
    paddingHorizontal: 14,
    marginHorizontal: 16,
    marginVertical: 12,
    borderWidth: 1,
    borderColor: '#333',
  },
  searchIcon: {
    fontSize: 16,
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    color: '#fff',
    fontSize: 14,
    paddingVertical: 12,
  },
  filterRow: {
    marginHorizontal: 16,
    marginBottom: 16,
  },
  filterContent: {
    gap: 8,
    paddingRight: 16,
  },
  filterButton: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
    flexDirection: 'row',
    alignItems: 'center',
    gap: 6,
    minHeight: 36,
  },
  filterButtonIcon: {
    fontSize: 14,
  },
  filterButtonText: {
    color: '#fff',
    fontSize: 12,
    fontWeight: '500',
  },
  resetButton: {
    backgroundColor: 'rgba(239, 68, 68, 0.1)',
    borderColor: '#ef4444',
  },
  resetText: {
    color: '#ef4444',
    fontSize: 12,
    fontWeight: '600',
  },
  modalContainer: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: '#0a0a0a',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
    paddingTop: 16,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#222',
  },
  modalTitle: {
    color: '#fff',
    fontSize: 18,
    fontWeight: '700',
  },
  closeButton: {
    fontSize: 24,
    color: '#999',
  },
  filterOptions: {
    paddingHorizontal: 20,
    paddingVertical: 16,
  },
  filterSection: {
    marginBottom: 24,
  },
  filterSectionTitle: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 12,
  },
  optionsContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: 8,
  },
  optionButton: {
    backgroundColor: '#1a1a1a',
    paddingHorizontal: 14,
    paddingVertical: 8,
    borderRadius: 8,
    borderWidth: 1,
    borderColor: '#333',
  },
  optionButtonActive: {
    backgroundColor: '#3b82f6',
    borderColor: '#3b82f6',
  },
  optionText: {
    color: '#ccc',
    fontSize: 12,
    fontWeight: '500',
  },
  optionTextActive: {
    color: '#fff',
    fontWeight: '600',
  },
  applyButton: {
    backgroundColor: '#3b82f6',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingVertical: 14,
    borderRadius: 8,
    alignItems: 'center',
  },
  applyButtonText: {
    color: '#fff',
    fontSize: 14,
    fontWeight: '700',
  },
});
