import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';

interface VisaTypeCardProps {
  visa: any;
  index: number;
}

const VisaTypeCard: React.FC<VisaTypeCardProps> = ({ visa, index }) => {
  return (
    <View style={styles.visaTypeCard}>
      <View style={styles.visaTypeHeader}>
        <Text style={styles.visaTypeTitle}>
          {visa.type || visa.name || `Visa Type ${index + 1}`}
        </Text>
        {visa.duration && (
          <View style={styles.visaTypeBadge}>
            <Text style={styles.visaTypeBadgeText}>{visa.duration}</Text>
          </View>
        )}
      </View>
      
      {(visa.fee || visa.processing_time) && (
        <View style={styles.visaTypeDetails}>
          {visa.fee && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Fee</Text>
              <Text style={styles.detailValue}>{visa.fee}</Text>
            </View>
          )}
          {visa.processing_time && (
            <View style={styles.detailRow}>
              <Text style={styles.detailLabel}>Processing Time</Text>
              <Text style={styles.detailValue}>{visa.processing_time}</Text>
            </View>
          )}
        </View>
      )}
      
      {visa.requirements && visa.requirements.length > 0 && (
        <>
          <Text style={styles.requirementsTitle}>Requirements</Text>
          {visa.requirements.map((req: string, reqIndex: number) => (
            <View key={reqIndex} style={styles.requirementItem}>
              <View style={styles.bullet} />
              <Text style={styles.requirementText}>{req}</Text>
            </View>
          ))}
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  visaTypeCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  visaTypeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  visaTypeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
    flex: 1,
  },
  visaTypeBadge: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  visaTypeBadgeText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 12,
  },
  visaTypeDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.black,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 8,
  },
  requirementItem: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'flex-start',
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
    marginTop: 6,
    marginRight: 8,
  },
  requirementText: {
    flex: 1,
    fontSize: 13,
    color: Colors.black,
    lineHeight: 18,
  },
});

export default VisaTypeCard;