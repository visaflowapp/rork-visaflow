import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { getCountryFlag } from '@/utils/countryFlags';
import StatusCard from './StatusCard';
import VisaTypeCard from './VisaTypeCard';
import Colors from '@/constants/colors';

interface RequirementsResultProps {
  nationality: string;
  destination: string;
  purpose: string;
  data: any;
}

const RequirementsResult: React.FC<RequirementsResultProps> = ({
  nationality,
  destination,
  purpose,
  data,
}) => {
  const parseVisaRequirements = () => {
    if (!data) return null;

    return {
      visaRequired: data.visa_required || data.visaRequired || false,
      visaTypes: data.visa_types || data.visaTypes || [],
      entryRules: data.entry_rules || data.entryRules || [],
      maxStay: data.max_stay || data.maxStay || null,
      processingTime: data.processing_time || data.processingTime || null,
      fee: data.fee || null,
      requirements: data.requirements || [],
      notes: data.notes || data.additional_info || null,
    };
  };

  const requirements = parseVisaRequirements();

  if (!requirements) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.errorText}>Unable to parse requirements data</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.tripDetails}>
          <Text style={styles.tripDetailText}>
            {getCountryFlag(nationality)} {nationality} → {getCountryFlag(destination)} {destination}
          </Text>
          <View style={styles.purposeBadge}>
            <Text style={styles.purposeText}>{purpose}</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        <StatusCard 
          visaRequired={requirements.visaRequired}
          maxStay={requirements.maxStay}
        />

        {requirements.visaTypes && requirements.visaTypes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available Visa Types</Text>
            {requirements.visaTypes.map((visa: any, index: number) => (
              <VisaTypeCard key={index} visa={visa} index={index} />
            ))}
          </View>
        )}

        {requirements.requirements && requirements.requirements.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>General Requirements</Text>
            {requirements.requirements.map((req: string, index: number) => (
              <View key={index} style={styles.requirementItem}>
                <View style={styles.bullet} />
                <Text style={styles.requirementText}>{req}</Text>
              </View>
            ))}
          </View>
        )}

        {requirements.entryRules && requirements.entryRules.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Entry Rules</Text>
            {requirements.entryRules.map((rule: string, index: number) => (
              <View key={index} style={styles.requirementItem}>
                <View style={styles.bullet} />
                <Text style={styles.requirementText}>{rule}</Text>
              </View>
            ))}
          </View>
        )}

        {requirements.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Information</Text>
            <Text style={styles.notesText}>{requirements.notes}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 20,
    maxHeight: 600,
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tripDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tripDetailText: {
    fontSize: 16,
    color: Colors.black,
    fontWeight: '500',
  },
  purposeBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  purposeText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 12,
  },
  content: {
    padding: 16,
    maxHeight: 500,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 12,
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
  notesText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: 16,
    color: Colors.red,
    textAlign: 'center',
  },
});

export default RequirementsResult;