import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, Platform } from 'react-native';
import { X } from 'lucide-react-native';
import { getCountryFlag } from '@/utils/countryFlags';
import { GlassView } from 'expo-glass-effect';

interface VisaCardProps {
  id: string;
  country: string;
  visaType: string;
  entryDate: string;
  duration: number;
  exitDate: string;
  extensionsAvailable: number;
  daysLeft: number;
  onRemove?: (id: string) => void;
  style?: ViewStyle;
}

const VisaCard: React.FC<VisaCardProps> = ({
  id,
  country,
  visaType,
  entryDate,
  duration,
  exitDate,
  extensionsAvailable,
  daysLeft,
  onRemove,
  style,
}) => {
  // Format dates for display
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  // Calculate progress percentage
  const calculateProgress = () => {
    const today = new Date();
    const entry = new Date(entryDate);
    const exit = new Date(exitDate);
    const totalDays = Math.ceil((exit.getTime() - entry.getTime()) / (1000 * 60 * 60 * 24));
    const usedDays = totalDays - daysLeft;
    return Math.max(0, Math.min(100, (usedDays / totalDays) * 100));
  };

  // Get progress color based on days left
  const getProgressColor = () => {
    if (daysLeft > 30) return '#34C759';
    if (daysLeft > 14) return '#34C759';
    if (daysLeft > 7) return '#FFD700';
    return '#FF3B30';
  };

  // Get status emoji
  const getStatusEmoji = () => {
    if (daysLeft > 30) return '✅';
    if (daysLeft > 14) return '✅';
    if (daysLeft > 7) return '⚠️';
    return '❌';
  };

  // Calculate extension deadline
  const getExtensionDeadline = () => {
    if (extensionsAvailable === 0) return null;
    const extensionDeadline = new Date(exitDate);
    extensionDeadline.setDate(extensionDeadline.getDate() - 30); // 30 days before expiry
    return extensionDeadline;
  };

  const extensionDeadline = getExtensionDeadline();

  const GlassWrapper = Platform.OS === 'ios' ? GlassView : View;
  const glassProps = Platform.OS === 'ios' ? { glassEffectStyle: 'clear' as const } : {};

  return (
    <GlassWrapper style={[styles.card, style]} {...glassProps}>
      {onRemove && (
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => onRemove(id)}
        >
          <X size={16} color="#C7C7CC" />
        </TouchableOpacity>
      )}
      
      <View style={styles.header}>
        <View style={styles.countryContainer}>
          <Text style={styles.flag}>{getCountryFlag(country)}</Text>
          <Text style={styles.country}>{country}</Text>
        </View>
        <View style={styles.statusContainer}>
          <Text style={styles.statusEmoji}>{getStatusEmoji()}</Text>
          <Text style={styles.daysLeft}>{daysLeft}d</Text>
        </View>
      </View>

      <View style={styles.visaTypeBadge}>
        <Text style={styles.visaTypeText}>{visaType}</Text>
      </View>

      <View style={styles.progressContainer}>
        <View style={styles.progressBar}>
          <View 
            style={[
              styles.progressFill, 
              { 
                width: `${calculateProgress()}%`,
                backgroundColor: getProgressColor()
              }
            ]} 
          />
        </View>
        <Text style={styles.progressText}>
          {Math.round(calculateProgress())}% used
        </Text>
      </View>

      <View style={styles.detailsContainer}>
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Entry</Text>
          <Text style={styles.detailValue}>{formatDate(entryDate)}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Exit By</Text>
          <Text style={styles.detailValue}>{formatDate(exitDate)}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Duration</Text>
          <Text style={styles.detailValue}>{duration} days</Text>
        </View>
        
        {extensionsAvailable > 0 && (
          <>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Extensions Left</Text>
              <Text style={styles.detailValue}>{extensionsAvailable}</Text>
            </View>
            {extensionDeadline && (
              <View style={styles.extensionDeadline}>
                <Text style={styles.extensionText}>
                  Extension deadline: {formatDate(extensionDeadline.toISOString())}
                </Text>
              </View>
            )}
          </>
        )}
      </View>
    </GlassWrapper>
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 24,
    padding: 24,
    marginHorizontal: 8,
    width: 320,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 15,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  removeButton: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.5)',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  countryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flag: {
    fontSize: 32,
    marginRight: 12,
  },
  country: {
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    flex: 1,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  statusContainer: {
    alignItems: 'center',
  },
  statusEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  daysLeft: {
    fontSize: 20,
    fontWeight: '700',
    color: 'white',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
  visaTypeBadge: {
    backgroundColor: 'rgba(255, 255, 255, 0.3)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 25,
    alignSelf: 'flex-start',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.4)',
  },
  visaTypeText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 12,
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 6,
    overflow: 'hidden',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  progressFill: {
    height: '100%',
    borderRadius: 6,
  },
  progressText: {
    fontSize: 14,
    color: 'white',
    textAlign: 'right',
    fontWeight: '600',
    opacity: 0.9,
  },
  detailsContainer: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: 'rgba(255, 255, 255, 0.2)',
  },
  detailLabel: {
    fontSize: 16,
    color: 'white',
    fontWeight: '600',
    opacity: 0.9,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '700',
    color: 'white',
  },
  extensionDeadline: {
    marginTop: 12,
    padding: 14,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  extensionText: {
    fontSize: 13,
    color: 'white',
    textAlign: 'center',
    fontWeight: '700',
  },
});

export default VisaCard;