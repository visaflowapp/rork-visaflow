import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet, Dimensions } from 'react-native';
import { X } from 'lucide-react-native';
import { colors } from '@/constants/colors';
import { getCountryFlag } from '@/utils/countryFlags';
import { formatDate } from '@/utils/dateHelpers';
import { getStatusColor, getProgressPercentage, getExtensionDeadline } from '@/utils/visaHelpers';

const { width, height } = Dimensions.get('window');
const CARD_WIDTH = width - 40;

interface VisaCardSectionProps {
  visa: any;
  onRemove: (id: string) => void;
}

const VisaCardSection: React.FC<VisaCardSectionProps> = ({ visa, onRemove }) => {
  return (
    <View style={styles.cardContainer}>
      <View style={styles.visaCard}>
        {/* Remove Button */}
        <TouchableOpacity 
          style={styles.removeButton}
          onPress={() => onRemove(visa.id)}
        >
          <X size={18} color="#666" />
        </TouchableOpacity>

        {/* Country Header */}
        <View style={styles.countryHeader}>
          <Text style={styles.countryFlag}>{getCountryFlag(visa.country)}</Text>
          <Text style={styles.countryName}>{visa.country}</Text>
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

        {/* Main Blue Divider */}
        <View style={styles.blueDivider} />

        {/* Visa Details with consistent blue dividers */}
        <View style={styles.visaDetails}>
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Entry</Text>
            <Text style={styles.detailValue}>{formatDate(visa.entry_date)}</Text>
          </View>
          <View style={styles.blueDivider} />
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Exit By</Text>
            <Text style={styles.detailValue}>{formatDate(visa.exit_date)}</Text>
          </View>
          <View style={styles.blueDivider} />
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Duration</Text>
            <Text style={styles.detailValue}>{visa.duration} days</Text>
          </View>
          <View style={styles.blueDivider} />
          
          <View style={styles.detailRow}>
            <Text style={styles.detailLabel}>Extensions Left</Text>
            <Text style={styles.detailValue}>{visa.extensions_available}</Text>
          </View>
        </View>

        {/* Extension Deadline */}
        {visa.extensions_available > 0 && (
          <>
            {/* Final Blue Divider */}
            <View style={styles.blueDivider} />
            <View style={styles.extensionDeadline}>
              <Text style={styles.extensionText}>
                Extension deadline: {getExtensionDeadline(visa)}
              </Text>
            </View>
          </>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  cardContainer: {
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: 'flex-start',
    paddingBottom: 8,
    paddingTop: 32,
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
    maxHeight: height * 0.42,
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
    fontWeight: 'bold',
  },
  blueDivider: {
    height: 2,
    backgroundColor: colors.primary,
    marginVertical: 6,
    borderRadius: 1,
  },
  visaDetails: {
    gap: 0,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 6,
  },
  detailLabel: {
    fontSize: 14,
    color: '#000',
    fontWeight: 'bold',
  },
  detailValue: {
    fontSize: 14,
    fontWeight: 'bold',
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
    fontWeight: 'bold',
  },
});

export default VisaCardSection;