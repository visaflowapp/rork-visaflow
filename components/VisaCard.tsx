import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle, Platform } from 'react-native';
import { X } from 'lucide-react-native';
import { getCountryFlag } from '@/utils/countryFlags';
import { GlassView } from 'expo-glass-effect';
import Colors from '@/constants/colors';

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
    const entry = new Date(entryDate);
    const exit = new Date(exitDate);
    const totalDays = Math.ceil((exit.getTime() - entry.getTime()) / (1000 * 60 * 60 * 24));
    const usedDays = totalDays - daysLeft;
    return Math.max(0, Math.min(100, (usedDays / totalDays) * 100));
  };

  // Get progress color based on days left
  const getProgressColor = () => {
    if (daysLeft > 30) return Colors.glowGreen;
    if (daysLeft > 14) return Colors.accentTeal;
    if (daysLeft > 7) return Colors.warningAmber;
    return Colors.criticalRed;
  };

  // Get neon glow color
  const getNeonGlowColor = () => {
    if (daysLeft > 30) return Colors.glowGreen;
    if (daysLeft > 14) return Colors.neonBlue;
    if (daysLeft > 7) return Colors.warningAmber;
    return Colors.criticalRed;
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
    <View style={[styles.cardContainer, style]}>
      <View style={[styles.neonGlow, { shadowColor: getNeonGlowColor() }]} />
      <GlassWrapper style={styles.card} {...glassProps}>
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
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    position: 'relative',
    marginHorizontal: 8,
    width: 320,
  },
  neonGlow: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    borderRadius: 24,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 20,
    elevation: 15,
  },
  card: {
    backgroundColor: 'rgba(13, 27, 42, 0.8)',
    borderRadius: 24,
    padding: 24,
    borderWidth: 2,
    borderColor: 'rgba(0, 212, 255, 0.3)',
    position: 'relative',
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
    color: Colors.white,
    flex: 1,
    textShadowColor: Colors.neonBlue,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
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
    color: Colors.electricCyan,
    textShadowColor: Colors.neonBlue,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
  visaTypeBadge: {
    backgroundColor: 'rgba(0, 212, 255, 0.15)',
    paddingHorizontal: 18,
    paddingVertical: 12,
    borderRadius: 25,
    alignSelf: 'flex-start',
    marginBottom: 20,
    borderWidth: 1,
    borderColor: Colors.neonBlue,
  },
  visaTypeText: {
    color: Colors.electricCyan,
    fontWeight: '700',
    fontSize: 14,
    letterSpacing: 0.5,
  },
  progressContainer: {
    marginBottom: 20,
  },
  progressBar: {
    height: 8,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderRadius: 4,
    overflow: 'hidden',
    marginBottom: 8,
    borderWidth: 1,
    borderColor: 'rgba(0, 212, 255, 0.3)',
  },
  progressFill: {
    height: '100%',
    borderRadius: 4,
    shadowColor: '#00D4FF',
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 8,
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
    borderBottomColor: 'rgba(0, 212, 255, 0.15)',
  },
  detailLabel: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.7)',
    fontWeight: '500',
    letterSpacing: 0.3,
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '700',
    color: Colors.electricCyan,
  },
  extensionDeadline: {
    marginTop: 12,
    padding: 14,
    backgroundColor: 'rgba(178, 75, 243, 0.15)',
    borderRadius: 14,
    borderWidth: 1,
    borderColor: Colors.neonPurple,
  },
  extensionText: {
    fontSize: 13,
    color: Colors.neonPurple,
    textAlign: 'center',
    fontWeight: '700',
    letterSpacing: 0.3,
  },
});

export default VisaCard;