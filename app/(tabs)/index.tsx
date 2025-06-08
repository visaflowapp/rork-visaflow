import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Stack } from 'expo-router';
import { Plus, Check, X } from 'lucide-react-native';
import { useVisaStore } from '@/store/visaStore';
import { CircularProgress } from '@/components/CircularProgress';
import { AddVisaModal } from '@/components/AddVisaModal';
import { colors } from '@/constants/colors';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width - 40;

export default function TrackerScreen() {
  const { 
    activeVisas, 
    isLoading, 
    userId, 
    setUserId, 
    loadUserData,
    isBackendAvailable 
  } = useVisaStore();
  const [showAddModal, setShowAddModal] = useState(false);

  useEffect(() => {
    if (!userId) {
      setUserId('demo-user');
    } else {
      loadUserData();
    }
  }, [userId, setUserId, loadUserData]);

  const getStatusColor = (daysLeft: number) => {
    if (daysLeft <= 7) return colors.error;
    if (daysLeft <= 30) return colors.warning;
    return colors.success;
  };

  const getProgressPercentage = (visa: any) => {
    const totalDays = visa.duration;
    const daysUsed = totalDays - visa.daysLeft;
    return Math.max(0, Math.min(100, (daysUsed / totalDays) * 100));
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

  const getCountryFlag = (country: string) => {
    const flags: { [key: string]: string } = {
      'Portugal': '🇵🇹',
      'Thailand': '🇹🇭',
      'Spain': '🇪🇸',
      'Germany': '🇩🇪',
      'France': '🇫🇷',
      'Italy': '🇮🇹',
      'Netherlands': '🇳🇱',
      'United Kingdom': '🇬🇧',
      'Japan': '🇯🇵',
      'South Korea': '🇰🇷',
      'Singapore': '🇸🇬',
      'Malaysia': '🇲🇾',
      'Indonesia': '🇮🇩',
      'Vietnam': '🇻🇳',
      'Philippines': '🇵🇭',
      'Mexico': '🇲🇽',
      'Brazil': '🇧🇷',
      'Argentina': '🇦🇷',
      'Chile': '🇨🇱',
      'Colombia': '🇨🇴',
      'Costa Rica': '🇨🇷',
      'Panama': '🇵🇦',
      'United States': '🇺🇸',
      'Canada': '🇨🇦',
      'Australia': '🇦🇺',
      'New Zealand': '🇳🇿',
    };
    return flags[country] || '🌍';
  };

  const currentVisa = activeVisas.length > 0 ? activeVisas[0] : null;

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
          title: 'VisaFlow',
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: 'white',
          headerTitleStyle: { fontWeight: 'bold', fontSize: 20 },
        }} 
      />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollContent}
        showsVerticalScrollIndicator={false}
      >
        {currentVisa ? (
          <>
            {/* Circular Progress Section */}
            <View style={styles.progressSection}>
              <CircularProgress
                size={200}
                strokeWidth={12}
                progress={getProgressPercentage(currentVisa)}
                color={getStatusColor(currentVisa.daysLeft)}
                backgroundColor={colors.lightGray}
              />
              <View style={styles.progressContent}>
                <Text style={styles.daysNumber}>{currentVisa.daysLeft}</Text>
                <Text style={styles.daysLabel}>days left</Text>
              </View>
              
              {/* Status Badge */}
              <View style={[styles.statusBadge, { backgroundColor: getStatusColor(currentVisa.daysLeft) }]}>
                <Check size={16} color="white" />
              </View>
            </View>

            {/* Visa Cards Section */}
            <ScrollView 
              horizontal 
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.cardsContainer}
              style={styles.cardsScrollView}
            >
              {activeVisas.map((visa, index) => (
                <View key={visa.id} style={[styles.visaCard, index === 0 && styles.activeCard]}>
                  {/* Country Header */}
                  <View style={styles.countryHeader}>
                    <Text style={styles.countryFlag}>{getCountryFlag(visa.country)}</Text>
                    <Text style={styles.countryName}>{visa.country}</Text>
                    <View style={styles.daysRemainingBadge}>
                      <Text style={styles.daysRemainingText}>{visa.daysLeft}d</Text>
                    </View>
                  </View>

                  {/* Visa Type Badge */}
                  <View style={styles.visaTypeBadge}>
                    <Text style={styles.visaTypeText}>{visa.visa_type}</Text>
                  </View>

                  {/* Progress Bar */}
                  <View style={styles.progressBar}>
                    <View 
                      style={[
                        styles.progressFill, 
                        { 
                          width: `${getProgressPercentage(visa)}%`,
                          backgroundColor: getStatusColor(visa.daysLeft)
                        }
                      ]} 
                    />
                  </View>
                  <Text style={styles.progressText}>{Math.round(getProgressPercentage(visa))}% used</Text>

                  {/* Visa Details */}
                  <View style={styles.visaDetails}>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Entry</Text>
                      <Text style={styles.detailValue}>{formatDate(visa.entry_date)}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Exit</Text>
                      <Text style={styles.detailValue}>{formatDate(visa.exit_date)}</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Duration</Text>
                      <Text style={styles.detailValue}>{visa.duration} days</Text>
                    </View>
                    <View style={styles.detailRow}>
                      <Text style={styles.detailLabel}>Extensions</Text>
                      <Text style={styles.detailValue}>{visa.extensions_available}</Text>
                    </View>
                  </View>

                  {/* Extension Deadline */}
                  {visa.extensions_available > 0 && (
                    <View style={styles.extensionDeadline}>
                      <Text style={styles.extensionText}>Extension deadline: Aug 11</Text>
                    </View>
                  )}
                </View>
              ))}
            </ScrollView>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No Active Visas</Text>
            <Text style={styles.emptySubtitle}>Add your first visa to start tracking</Text>
          </View>
        )}

        {/* Add Visa Button */}
        <TouchableOpacity 
          style={styles.addButton}
          onPress={() => setShowAddModal(true)}
        >
          <Plus size={24} color="white" />
          <Text style={styles.addButtonText}>Add Visa Record</Text>
        </TouchableOpacity>

        {/* Backend Status Indicator (for development) */}
        {!isBackendAvailable && __DEV__ && (
          <View style={styles.devIndicator}>
            <Text style={styles.devText}>Demo Mode - Backend Unavailable</Text>
          </View>
        )}
      </ScrollView>

      <AddVisaModal 
        visible={showAddModal}
        onClose={() => setShowAddModal(false)}
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
    fontSize: 16,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  progressSection: {
    alignItems: 'center',
    paddingVertical: 40,
    position: 'relative',
  },
  progressContent: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    top: 40,
    left: 0,
    right: 0,
    bottom: 0,
  },
  daysNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
  },
  daysLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: -5,
  },
  statusBadge: {
    position: 'absolute',
    top: 60,
    right: width / 2 - 80,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.primary,
  },
  cardsScrollView: {
    marginTop: 20,
  },
  cardsContainer: {
    paddingHorizontal: 20,
    gap: 16,
  },
  visaCard: {
    width: CARD_WIDTH,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 4,
  },
  activeCard: {
    borderWidth: 2,
    borderColor: colors.success,
  },
  countryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  countryFlag: {
    fontSize: 32,
    marginRight: 12,
  },
  countryName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: colors.text,
    flex: 1,
  },
  daysRemainingBadge: {
    backgroundColor: colors.success,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
  },
  daysRemainingText: {
    color: 'white',
    fontWeight: 'bold',
    fontSize: 14,
  },
  visaTypeBadge: {
    backgroundColor: colors.secondary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  visaTypeText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  progressBar: {
    height: 8,
    backgroundColor: colors.lightGray,
    borderRadius: 4,
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
  },
  progressText: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 20,
  },
  visaDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    fontSize: 16,
    color: colors.textSecondary,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
  },
  extensionDeadline: {
    backgroundColor: '#FFF3CD',
    padding: 12,
    borderRadius: 8,
    marginTop: 16,
  },
  extensionText: {
    fontSize: 14,
    color: '#856404',
    textAlign: 'center',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
  },
  emptyTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
  },
  addButton: {
    backgroundColor: colors.secondary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 16,
    marginHorizontal: 20,
    marginTop: 20,
    borderRadius: 16,
    gap: 8,
  },
  addButtonText: {
    color: 'white',
    fontSize: 18,
    fontWeight: '600',
  },
  devIndicator: {
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    padding: 8,
    margin: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  devText: {
    color: 'rgba(255, 255, 255, 0.8)',
    fontSize: 12,
  },
});