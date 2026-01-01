import React, { useEffect, useState } from 'react';
import { View, TouchableOpacity, Text, StyleSheet, FlatList, ScrollView } from 'react-native';
import { Stack } from 'expo-router';
import { AlertCircle, Info, AlertTriangle } from 'lucide-react-native';

import Colors from '@/constants/colors';
import { useVisaStore } from '@/store/visaStore';
import ProgressSection from '@/components/TrackerScreen/ProgressSection';
import EmptyState from '@/components/TrackerScreen/EmptyState';
import AddVisaModal from '@/components/AddVisaModal';
import { getProgressPercentage } from '@/utils/visaHelpers';
import VisaCard from '@/components/VisaCard';

export default function TrackerScreen() {
  const { 
    activeVisas, 
    alerts,
    isLoading, 
    userId, 
    setUserId, 
    loadUserData,
    addVisa,
    removeVisa,
    dismissAlert,
    markAlertAsRead
  } = useVisaStore();
  const [showAddModal, setShowAddModal] = useState<boolean>(false);
  
  // Debug modal state changes
  useEffect(() => {
    console.log('TrackerScreen: showAddModal changed to:', showAddModal);
  }, [showAddModal]);
  const [selectedVisa, setSelectedVisa] = useState<string | null>(null);
  const [hasInitialized, setHasInitialized] = useState<boolean>(false);

  useEffect(() => {
    if (!userId) {
      setUserId('demo-user');
    } else {
      loadUserData();
    }
  }, [userId, setUserId, loadUserData]);

  // Show Add Visa modal for new users after initialization
  useEffect(() => {
    if (!isLoading && !hasInitialized) {
      setHasInitialized(true);
      if (activeVisas.length === 0) {
        setShowAddModal(true);
      }
    }
  }, [isLoading, activeVisas.length, hasInitialized]);

  // If there's only one visa, select it automatically
  useEffect(() => {
    if (activeVisas.length === 1) {
      setSelectedVisa(activeVisas[0].id);
    } else if (activeVisas.length === 0) {
      setSelectedVisa(null);
    }
  }, [activeVisas]);

  const handleAddVisa = (visaData: {
    country: string;
    visa_type: string;
    entry_date: string;
    exit_date: string;
    duration: number;
    extensions_available: number;
    notes?: string;
  }) => {
    console.log('TrackerScreen: Adding visa:', visaData);
    addVisa(visaData);
    setShowAddModal(false);
  };

  const handleOpenAddModal = () => {
    console.log('TrackerScreen: Opening add modal');
    console.log('TrackerScreen: Current state:', {
      activeVisasCount: activeVisas.length,
      isLoading,
      showAddModal,
      hasInitialized
    });
    setShowAddModal(true);
    console.log('TrackerScreen: Modal state set to true');
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

  if (isLoading && !hasInitialized) {
    return (
      <View style={styles.loadingContainer}>
        <Text style={styles.loadingText}>Loading...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Visa Tracker',
          headerStyle: { 
            backgroundColor: Colors.white,
          },
          headerTintColor: Colors.text,
          headerTitleStyle: {
            fontWeight: '600',
            fontSize: 18,
          },
          headerShadowVisible: false,
          headerTitleAlign: 'center',
          headerRight: () => (
            <TouchableOpacity 
              testID="new-visa-header-btn"
              style={styles.headerButton}
              onPress={handleOpenAddModal}
            >
              <Text style={styles.headerButtonText}>+ Add Visa</Text>
            </TouchableOpacity>
          ),
        }} 
      />

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeVisas.length > 0 ? (
          <>
            {currentVisa && (
              <ProgressSection 
                daysLeft={currentVisa.daysLeft}
                progress={getProgressPercentage(currentVisa)}
              />
            )}
            
            {alerts.length > 0 && (
              <View style={styles.recentAlertsSection}>
                <Text style={styles.recentAlertsTitle}>Recent Alerts</Text>
                {alerts.slice(0, 3).map((alert) => (
                  <TouchableOpacity
                    key={alert.id}
                    style={[
                      styles.compactAlertCard,
                      !alert.is_read && styles.compactAlertCardUnread
                    ]}
                    onPress={() => markAlertAsRead(alert.id)}
                  >
                    <View style={styles.compactAlertIcon}>
                      {alert.type === 'deadline' && <AlertCircle size={16} color={Colors.warning} />}
                      {alert.type === 'policy' && <Info size={16} color={Colors.primary} />}
                      {alert.type === 'embassy' && <AlertTriangle size={16} color={Colors.error} />}
                    </View>
                    <View style={styles.compactAlertContent}>
                      <Text style={styles.compactAlertTitle} numberOfLines={1}>{alert.title}</Text>
                      <Text style={styles.compactAlertDescription} numberOfLines={1}>{alert.description}</Text>
                    </View>
                    <TouchableOpacity
                      style={styles.dismissButton}
                      onPress={(e) => {
                        e.stopPropagation();
                        dismissAlert(alert.id);
                      }}
                      hitSlop={{ top: 10, bottom: 10, left: 10, right: 10 }}
                    >
                      <Text style={styles.dismissButtonText}>×</Text>
                    </TouchableOpacity>
                  </TouchableOpacity>
                ))}
              </View>
            )}
            
            {currentVisa && (
              <View style={styles.visaCardContainer}>
                <VisaCard
                  id={currentVisa.id}
                  country={currentVisa.country}
                  visaType={currentVisa.visa_type}
                  entryDate={currentVisa.entry_date}
                  duration={currentVisa.duration}
                  exitDate={currentVisa.exit_date}
                  extensionsAvailable={currentVisa.extensions_available}
                  daysLeft={currentVisa.daysLeft}
                  onRemove={handleRemoveVisa}
                />
              </View>
            )}
            
            {activeVisas.length > 1 && (
              <View style={styles.additionalVisasContainer}>
                <Text style={styles.additionalVisasTitle}>Other Visas</Text>
                <FlatList
                  data={activeVisas.filter(visa => visa.id !== selectedVisa)}
                  keyExtractor={(item) => item.id}
                  horizontal
                  showsHorizontalScrollIndicator={false}
                  contentContainerStyle={styles.visaListContainer}
                  renderItem={({ item }) => (
                    <TouchableOpacity
                      onPress={() => setSelectedVisa(item.id)}
                      style={styles.additionalVisaCard}
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
              </View>
            )}
          </>
        ) : (
          <EmptyState onAddVisa={handleOpenAddModal} />
        )}
      </ScrollView>

      <AddVisaModal 
        visible={showAddModal}
        onClose={() => {
          console.log('TrackerScreen: Closing modal');
          setShowAddModal(false);
        }}
        onSave={handleAddVisa}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background,
  },
  loadingText: {
    color: Colors.text,
    fontSize: 16,
  },
  headerButton: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    marginRight: 8,
  },
  headerButtonText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  content: {
    flex: 1,
  },
  visaCardContainer: {
    paddingHorizontal: 16,
    marginTop: 16,
    alignItems: 'center',
  },
  additionalVisasContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
    marginBottom: 24,
  },
  additionalVisasTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  visaListContainer: {
    paddingRight: 16,
  },
  additionalVisaCard: {
    marginRight: 12,
  },
  recentAlertsSection: {
    marginTop: 16,
    marginHorizontal: 16,
  },
  recentAlertsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
  },
  compactAlertCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 12,
    marginBottom: 8,
    borderWidth: 1,
    borderColor: Colors.border,
    minHeight: 48,
  },
  compactAlertCardUnread: {
    backgroundColor: Colors.primaryLight,
    borderColor: Colors.primary,
    borderWidth: 1.5,
  },
  compactAlertIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  compactAlertContent: {
    flex: 1,
  },
  compactAlertTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 2,
  },
  compactAlertDescription: {
    fontSize: 12,
    color: Colors.textSecondary,
  },
  dismissButton: {
    width: 32,
    height: 32,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dismissButtonText: {
    fontSize: 24,
    color: Colors.textTertiary,
    fontWeight: '300',
  },
});