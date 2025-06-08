import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Stack } from 'expo-router';
import { Plus, X } from 'lucide-react-native';
import { useVisaStore } from '@/store/visaStore';
import { CircularProgress } from '@/components/CircularProgress';
import AddVisaModal from '@/components/AddVisaModal';
import { colors } from '@/constants/colors';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width - 40;

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

  const getExtensionDeadline = (visa: any) => {
    if (visa.extensions_available === 0) return null;
    const exitDate = new Date(visa.exit_date);
    exitDate.setDate(exitDate.getDate() - 30); // 30 days before expiry
    return exitDate.toLocaleDateString('en-US', { 
      month: 'short', 
      day: 'numeric' 
    });
  };

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
            {/* Circular Progress Section */}
            <View style={styles.progressSection}>
              <Text style={styles.visaStatusTitle}>Visa Status</Text>
              <View style={styles.progressContainer}>
                <CircularProgress
                  size={240}
                  strokeWidth={18}
                  progress={getProgressPercentage(currentVisa)}
                  color={getStatusColor(currentVisa.daysLeft)}
                  backgroundColor="rgba(255, 255, 255, 0.2)"
                />
                <View style={styles.progressContent}>
                  <Text style={styles.daysNumber}>{currentVisa.daysLeft}</Text>
                  <Text style={styles.daysLabel}>DAYS LEFT</Text>
                </View>
              </View>
            </View>

            {/* Single Visa Card */}
            <View style={styles.cardContainer}>
              <View style={styles.visaCard}>
                {/* Remove Button */}
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => handleRemoveVisa(currentVisa.id)}
                >
                  <X size={18} color="#666" />
                </TouchableOpacity>

                {/* Country Header */}
                <View style={styles.countryHeader}>
                  <Text style={styles.countryFlag}>{getCountryFlag(currentVisa.country)}</Text>
                  <Text style={styles.countryName}>{currentVisa.country}</Text>
                </View>

                {/* Visa Type Badge */}
                <View style={styles.visaTypeBadge}>
                  <Text style={styles.visaTypeText}>{currentVisa.visa_type}</Text>
                </View>

                {/* Progress Bar */}
                <View style={styles.progressBar}>
                  <View 
                    style={[
                      styles.progressFill, 
                      { 
                        width: `${getProgressPercentage(currentVisa)}%`,
                        backgroundColor: getStatusColor(currentVisa.daysLeft)
                      }
                    ]} 
                  />
                </View>
                <Text style={styles.progressText}>{Math.round(getProgressPercentage(currentVisa))}% used</Text>

                {/* Blue Divider */}
                <View style={styles.blueDivider} />

                {/* Visa Details with individual blue dividers */}
                <View style={styles.visaDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Entry</Text>
                    <Text style={styles.detailValue}>{formatDate(currentVisa.entry_date)}</Text>
                  </View>
                  <View style={styles.blueDivider} />
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Exit By</Text>
                    <Text style={styles.detailValue}>{formatDate(currentVisa.exit_date)}</Text>
                  </View>
                  <View style={styles.blueDivider} />
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Duration</Text>
                    <Text style={styles.detailValue}>{currentVisa.duration} days</Text>
                  </View>
                  <View style={styles.blueDivider} />
                  
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Extensions Left</Text>
                    <Text style={styles.detailValue}>{currentVisa.extensions_available}</Text>
                  </View>
                </View>

                {/* Extension Deadline */}
                {currentVisa.extensions_available > 0 && (
                  <>
                    {/* Blue Divider */}
                    <View style={styles.blueDivider} />
                    <View style={styles.extensionDeadline}>
                      <Text style={styles.extensionText}>
                        Extension deadline: {getExtensionDeadline(currentVisa)}
                      </Text>
                    </View>
                  </>
                )}
              </View>
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No Active Visas</Text>
            <Text style={styles.emptySubtitle}>Add your first visa to start tracking</Text>
            <TouchableOpacity 
              style={styles.emptyStateButton}
              onPress={() => setShowAddModal(true)}
            >
              <Plus size={20} color={colors.primary} style={styles.buttonIcon} />
              <Text style={styles.emptyStateButtonText}>New Visa</Text>
            </TouchableOpacity>
          </View>
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
  progressSection: {
    alignItems: 'center',
    paddingVertical: 16,
    paddingTop: 20,
    height: height * 0.35,
    justifyContent: 'center',
  },
  visaStatusTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 20,
    textAlign: 'center',
  },
  progressContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContent: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: 240,
    height: 240,
  },
  daysNumber: {
    fontSize: 56,
    fontWeight: 'bold',
    color: 'white',
  },
  daysLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: -4,
  },
  cardContainer: {
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: 'flex-start',
    paddingBottom: 40,
  },
  visaCard: {
    width: CARD_WIDTH,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 16,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 15,
    maxHeight: height * 0.38,
  },
  removeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#f5f5f5',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  countryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
    marginTop: 2,
  },
  countryFlag: {
    fontSize: 24,
    marginRight: 10,
  },
  countryName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000',
    flex: 1,
  },
  visaTypeBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
    alignSelf: 'flex-start',
    marginBottom: 10,
  },
  visaTypeText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 12,
  },
  progressBar: {
    height: 12,
    backgroundColor: colors.lightGray,
    borderRadius: 6,
    marginBottom: 3,
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 11,
    color: colors.textSecondary,
    marginBottom: 6,
  },
  blueDivider: {
    height: 1,
    backgroundColor: colors.primary,
    marginVertical: 4,
  },
  visaDetails: {
    gap: 0,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: '#000',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: '#000',
  },
  extensionDeadline: {
    backgroundColor: colors.lightRed,
    padding: 6,
    borderRadius: 8,
    marginTop: 4,
  },
  extensionText: {
    fontSize: 11,
    color: '#C62828',
    textAlign: 'center',
    fontWeight: '500',
  },
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
    flex: 1,
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 17,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 32,
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonIcon: {
    marginRight: 8,
  },
  emptyStateButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});