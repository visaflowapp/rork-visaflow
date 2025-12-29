import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, ViewStyle } from 'react-native';
import { X } from 'lucide-react-native';
import { getCountryFlag } from '@/utils/countryFlags';
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
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
    });
  };

  const calculateProgress = () => {
    const entry = new Date(entryDate);
    const exit = new Date(exitDate);
    const totalDays = Math.ceil((exit.getTime() - entry.getTime()) / (1000 * 60 * 60 * 24));
    const usedDays = totalDays - daysLeft;
    return Math.max(0, Math.min(100, (usedDays / totalDays) * 100));
  };

  const getProgressColor = () => {
    if (daysLeft > 30) return Colors.success;
    if (daysLeft > 14) return Colors.secondary;
    if (daysLeft > 7) return Colors.warning;
    return Colors.error;
  };

  const getStatusEmoji = () => {
    if (daysLeft > 30) return '✓';
    if (daysLeft > 14) return '✓';
    if (daysLeft > 7) return '⚠';
    return '!';
  };

  const getExtensionDeadline = () => {
    if (extensionsAvailable === 0) return null;
    const extensionDeadline = new Date(exitDate);
    extensionDeadline.setDate(extensionDeadline.getDate() - 30);
    return extensionDeadline;
  };

  const extensionDeadline = getExtensionDeadline();

  return (
    <View style={[styles.cardContainer, style]}>
      <View style={styles.card}>
        {onRemove && (
          <TouchableOpacity 
            style={styles.removeButton}
            onPress={() => onRemove(id)}
          >
            <X size={18} color={Colors.textSecondary} />
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
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    marginHorizontal: 8,
    width: 320,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
  },
  removeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: Colors.gray100,
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  countryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  flag: {
    fontSize: 28,
    marginRight: 10,
  },
  country: {
    fontSize: 20,
    fontWeight: '600',
    color: Colors.text,
    flex: 1,
  },
  statusContainer: {
    alignItems: 'center',
  },
  statusEmoji: {
    fontSize: 16,
    marginBottom: 2,
  },
  daysLeft: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.text,
  },
  visaTypeBadge: {
    backgroundColor: Colors.primaryLight,
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 12,
    alignSelf: 'flex-start',
    marginBottom: 16,
  },
  visaTypeText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 13,
  },
  progressContainer: {
    marginBottom: 16,
  },
  progressBar: {
    height: 6,
    backgroundColor: Colors.gray200,
    borderRadius: 3,
    overflow: 'hidden',
    marginBottom: 6,
  },
  progressFill: {
    height: '100%',
    borderRadius: 3,
  },
  progressText: {
    fontSize: 12,
    color: Colors.textSecondary,
    textAlign: 'right',
    fontWeight: '500',
  },
  detailsContainer: {
    marginTop: 4,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
    borderBottomWidth: 1,
    borderBottomColor: Colors.borderLight,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
  },
  extensionDeadline: {
    marginTop: 10,
    padding: 12,
    backgroundColor: Colors.primaryLight,
    borderRadius: 12,
  },
  extensionText: {
    fontSize: 12,
    color: Colors.primary,
    textAlign: 'center',
    fontWeight: '600',
  },
});

export default VisaCard;
