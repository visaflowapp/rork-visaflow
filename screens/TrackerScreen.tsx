import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, FlatList } from 'react-native';
import { Stack } from 'expo-router';
import { useVisaStore } from '@/store/visaStore';
import ProgressSection from '@/components/TrackerScreen/ProgressSection';
import VisaCardSection from '@/components/TrackerScreen/VisaCardSection';
import EmptyState from '@/components/TrackerScreen/EmptyState';
import AddVisaModal from '@/components/AddVisaModal';
import { getProgressPercentage } from '@/utils/visaHelpers';
import { colors } from '@/constants/colors';
import VisaCard from '@/components/VisaCard';

export default function TrackerScreen() {
  const { 
    activeVisas, 
    isLoading, 
    userId, 
    setUserId, 
    loadUserData,
    addVisa,
    removeVisa 
  } = useVisaStore();
  const [showAddModal, setShowAddModal] = useState(false);
  const [selectedVisa, setSelectedVisa] = useState<string | null>(null);

  useEffect(() => {
    if (!userId) {
      setUserId('demo-user');
    } else {
      loadUserData();
    }
  }, [userId, setUserId, loadUserData]);

  // If there's only one visa, select it automatically
  useEffect(() => {
    if (activeVisas.length === 1) {
      setSelectedVisa(activeVisas[0].id);
    } else if (activeVisas.length === 0) {
      setSelectedVisa(null);
    }
  }, [activeVisas]);

  const handleAddVisa = (visaData: any) => {
    addVisa(visaData);
  };

  const handleRemoveVisa = (visaId: string) => {
    removeVisa(visaId);
    if (selectedVisa === visaId) {
      setSelectedVisa(activeVisas.length > 1 ? activeVisas[0].id : null);
    }
  };

  const currentVisa = selectedVisa 
    ? activeVisas.find(visa => visa.id === selectedVisa) 
    : activeVisas.length > 0 ? activeVisas[0] : null;

  if (isLoading) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading your visas...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: '',
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: 'white',
          headerRight: () => (
            <TouchableOpacity 
              style={styles.headerButton}
              onPress={() => setShowAddModal(true)}
            >
              <Text style={styles.headerButtonText}>New Visa</Text>
            </TouchableOpacity>
          ),
        }} 
      />

      <View style={styles.content}>
        {activeVisas.length > 0 ? (
          <>
            {currentVisa && (
              <ProgressSection 
                daysLeft={currentVisa.daysLeft}
                progress={getProgressPercentage(currentVisa)}
              />
            )}
            
            {activeVisas.length > 1 ? (
              <FlatList
                data={activeVisas}
                keyExtractor={(item) => item.id}
                horizontal
                showsHorizontalScrollIndicator={false}
                contentContainerStyle={styles.visaListContainer}
                renderItem={({ item }) => (
                  <TouchableOpacity
                    onPress={() => setSelectedVisa(item.id)}
                    style={[
                      styles.visaCardWrapper,
                      selectedVisa === item.id && styles.selectedVisaCard
                    ]}
                  >
                    <VisaCard
                      id={item.id}
                      country={item.country}
                      visaType={item.visa_type}
                      entryDate={item.entry_date}
                      duration={item.duration}
                      exitDate={item.exit_date}
                      extensionsAvailable={item.extensions_available}
                      daysLeft={item.daysLeft}
                      onRemove={handleRemoveVisa}
                    />
                  </TouchableOpacity>
                )}
              />
            ) : currentVisa ? (
              <VisaCardSection 
                visa={currentVisa}
                onRemove={handleRemoveVisa}
              />
            ) : null}
          </>
        ) : (
          <EmptyState onAddVisa={() => setShowAddModal(true)} />
        )}
      </View>

      <AddVisaModal 
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
        onSave={handleAddVisa}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#007AFF',
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#007AFF',
  },
  loadingText: {
    color: 'white',
    fontSize: 18,
  },
  headerButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 4,
  },
  headerButtonText: {
    color: colors.primary,
    fontSize: 15,
    fontWeight: '600',
  },
  content: {
    flex: 1,
    justifyContent: 'flex-start',
  },
  visaListContainer: {
    paddingHorizontal: 16,
    paddingBottom: 16,
  },
  visaCardWrapper: {
    marginHorizontal: 8,
    borderRadius: 20,
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedVisaCard: {
    borderColor: colors.white,
  },
});