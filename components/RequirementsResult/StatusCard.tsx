import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';

interface StatusCardProps {
  visaRequired: boolean;
  maxStay?: string;
}

const StatusCard: React.FC<StatusCardProps> = ({ visaRequired, maxStay }) => {
  return (
    <View style={styles.statusCard}>
      <Text style={styles.statusTitle}>
        {visaRequired ? 'Visa Required' : 'No Visa Required'}
      </Text>
      {maxStay && (
        <Text style={styles.statusSubtitle}>
          Maximum stay: {maxStay}
        </Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  statusCard: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
});

export default StatusCard;