import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import { useVisaStore } from '@/store/visaStore';
import ProgressSection from '@/components/TrackerScreen/ProgressSection';
import VisaCardSection from '@/components/TrackerScreen/VisaCardSection';
import EmptyState from '@/components/TrackerScreen/EmptyState';
import AddVisaModal from '@/components/AddVisaModal';
import { getProgressPercentage } from '@/utils/visaHelpers';
import { colors } from '@/constants/colors';

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

  useEffect(() => {
    if (!userId) {
      setUserId('demo-user');
    } else {
      loadUserData();
    }
  }, [userId, setUserId, loadUserData]);

  const currentVisa = activeVisas.length > 0 ? activeVisas[0] : null;

  const handleAddVisa = (visaData: any) => {
    addVisa(visaData);
  };

  const handleRemoveVisa = (visaId: string) => {
    removeVisa(visaId);
  };

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
        {currentVisa ? (
          <>
            <ProgressSection 
              daysLeft={currentVisa.daysLeft}
              progress={getProgressPercentage(currentVisa)}
            />
            <VisaCardSection 
              visa={currentVisa}
              onRemove={handleRemoveVisa}
            />
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
    backgroundColor: colors.primary,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: colors.primary,
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
});