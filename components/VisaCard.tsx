import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { X } from 'lucide-react-native';
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

  // Get country flag emoji
  const getCountryFlag = (countryName: string) => {
    const flagMap: {[key: string]: string} = {
      "United States": "🇺🇸",
      "United Kingdom": "🇬🇧",
      "Canada": "🇨🇦",
      "Australia": "🇦🇺",
      "Germany": "🇩🇪",
      "France": "🇫🇷",
      "Japan": "🇯🇵",
      "Brazil": "🇧🇷",
      "India": "🇮🇳",
      "South Africa": "🇿🇦",
      "Mexico": "🇲🇽",
      "Portugal": "🇵🇹",
      "Spain": "🇪🇸",
      "Thailand": "🇹🇭",
      "Vietnam": "🇻🇳",
      "Indonesia": "🇮🇩",
      "Singapore": "🇸🇬"
    };
    
    return flagMap[countryName] || "🌍";
  };

  // Calculate extension deadline
  const getExtensionDeadline = () => {
    if (extensionsAvailable === 0) return null;
    const extensionDeadline = new Date(exitDate);
    extensionDeadline.setDate(extensionDeadline.getDate() - 30); // 30 days before expiry
    return extensionDeadline;
  };

  const extensionDeadline = getExtensionDeadline();

  return (
    <View style={styles.card}>
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
          <Text style={styles.detailLabel}>Exit</Text>
          <Text style={styles.detailValue}>{formatDate(exitDate)}</Text>
        </View>
        
        <View style={styles.detailRow}>
          <Text style={styles.detailLabel}>Duration</Text>
          <Text style={styles.detailValue}>{duration} days</Text>
        </View>
        
        {extensionsAvailable > 0 && (
          <>
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Extensions</Text>
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
  );
};

const styles = StyleSheet.create({
  card: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 8,
    width: 280,
    shadowColor: '#000000',
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
    position: 'relative',
  },
  removeButton: {
    position: 'absolute',
    top: 12,
    right: 12,
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1,
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
    fontSize: 22,
    fontWeight: 'bold',
    color: '#000000',
    flex: 1,
  },
  statusContainer: {
    alignItems: 'center',
  },
  statusEmoji: {
    fontSize: 20,
    marginBottom: 4,
  },
  daysLeft: {
    fontSize: 18,
    fontWeight: '700',
    color: '#000000',
  },
  visaTypeBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 16,
    paddingVertical: 10,
    borderRadius: 25,
    alignSelf: 'flex-start',
    marginBottom: 20,
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
    height: 10,
    backgroundColor: '#F2F2F7',
    borderRadius: 5,
    overflow: 'hidden',
    marginBottom: 8,
  },
  progressFill: {
    height: '100%',
    borderRadius: 5,
  },
  progressText: {
    fontSize: 14,
    color: '#C7C7CC',
    textAlign: 'right',
    fontWeight: '500',
  },
  detailsContainer: {
    marginTop: 8,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 10,
  },
  detailLabel: {
    fontSize: 16,
    color: '#C7C7CC',
    fontWeight: '500',
  },
  detailValue: {
    fontSize: 16,
    fontWeight: '700',
    color: '#000000',
  },
  extensionDeadline: {
    marginTop: 12,
    padding: 12,
    backgroundColor: 'rgba(255, 204, 0, 0.1)',
    borderRadius: 12,
  },
  extensionText: {
    fontSize: 13,
    color: '#000000',
    textAlign: 'center',
    fontWeight: '500',
  },
});

export default VisaCard;