import React, { useEffect, useState } from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { Stack } from 'expo-router';
import { Plus, Check, X } from 'lucide-react-native';
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

  const NewVisaButton = () => (
    <TouchableOpacity 
      style={styles.headerButton}
      onPress={() => setShowAddModal(true)}
    >
      <Text style={styles.headerButtonText}>New Visa</Text>
    </TouchableOpacity>
  );

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
          headerRight: () => <NewVisaButton />,
        }} 
      />

      <View style={styles.content}>
        {currentVisa ? (
          <>
            {/* Circular Progress Section */}
            <View style={styles.progressSection}>
              <CircularProgress
                size={260}
                strokeWidth={18}
                progress={getProgressPercentage(currentVisa)}
                color={getStatusColor(currentVisa.daysLeft)}
                backgroundColor="rgba(255, 255, 255, 0.2)"
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

            {/* Single Visa Card */}
            <View style={styles.cardContainer}>
              <View style={styles.visaCard}>
                {/* Remove Button */}
                <TouchableOpacity 
                  style={styles.removeButton}
                  onPress={() => handleRemoveVisa(currentVisa.id)}
                >
                  <X size={20} color="#666" />
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

                {/* Divider */}
                <View style={styles.divider} />

                {/* Visa Details */}
                <View style={styles.visaDetails}>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Entry</Text>
                    <Text style={styles.detailValue}>{formatDate(currentVisa.entry_date)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Exit</Text>
                    <Text style={styles.detailValue}>{formatDate(currentVisa.exit_date)}</Text>
                  </View>
                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Duration</Text>
                    <Text style={styles.detailValue}>{currentVisa.duration} days</Text>
                  </View>

                  {/* Divider */}
                  <View style={styles.divider} />

                  <View style={styles.detailRow}>
                    <Text style={styles.detailLabel}>Extensions</Text>
                    <Text style={styles.detailValue}>{currentVisa.extensions_available}</Text>
                  </View>
                </View>

                {/* Extension Deadline */}
                {currentVisa.extensions_available > 0 && (
                  <View style={styles.extensionDeadline}>
                    <Text style={styles.extensionText}>
                      Extension deadline: {getExtensionDeadline(currentVisa)}
                    </Text>
                  </View>
                )}
              </View>
            </View>
          </>
        ) : (
          <View style={styles.emptyState}>
            <Text style={styles.emptyTitle}>No Active Visas</Text>
            <Text style={styles.emptySubtitle}>Add your first visa to start tracking</Text>
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
    fontSize: 16,
  },
  headerButton: {
    backgroundColor: 'white',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    marginRight: 8,
  },
  headerButtonText: {
    color: colors.primary,
    fontWeight: '600',
    fontSize: 14,
  },
  content: {
    flex: 1,
    paddingBottom: 20,
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
    fontSize: 64,
    fontWeight: 'bold',
    color: 'white',
  },
  daysLabel: {
    fontSize: 20,
    color: 'rgba(255, 255, 255, 0.8)',
    marginTop: -8,
  },
  statusBadge: {
    position: 'absolute',
    top: 60,
    right: width / 2 - 110,
    width: 32,
    height: 32,
    borderRadius: 16,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 3,
    borderColor: colors.primary,
  },
  cardContainer: {
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 20,
  },
  visaCard: {
    width: CARD_WIDTH,
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 24,
    position: 'relative',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 15,
  },
  removeButton: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 32,
    height: 32,
    borderRadius: 16,
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
    marginBottom: 20,
    marginTop: 8,
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
  visaTypeBadge: {
    backgroundColor: colors.primary,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    alignSelf: 'flex-start',
    marginBottom: 20,
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
  divider: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: 16,
  },
  visaDetails: {
    gap: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 4,
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
});