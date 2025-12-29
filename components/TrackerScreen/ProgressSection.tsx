import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CircularProgress } from '@/components/CircularProgress';
import Colors from '@/constants/colors';

interface ProgressSectionProps {
  daysLeft: number;
  progress: number;
}

const ProgressSection: React.FC<ProgressSectionProps> = ({ daysLeft, progress }) => {
  const getProgressColor = () => {
    if (daysLeft > 30) return Colors.success;
    if (daysLeft > 14) return Colors.secondary;
    if (daysLeft > 7) return Colors.warning;
    return Colors.error;
  };

  const getStatusText = () => {
    if (daysLeft > 30) return 'On Track';
    if (daysLeft > 14) return 'Attention Needed';
    if (daysLeft > 7) return 'Action Required';
    return 'Urgent';
  };

  return (
    <View style={styles.container}>
      <View style={styles.card}>
        <View style={styles.progressContainer}>
          <CircularProgress
            size={200}
            strokeWidth={12}
            progress={progress}
            color={getProgressColor()}
            backgroundColor={Colors.gray200}
          />
          <View style={styles.centerContent}>
            <Text style={[styles.daysNumber, { color: getProgressColor() }]}>{daysLeft}</Text>
            <Text style={styles.daysLabel}>Days Left</Text>
          </View>
        </View>
        <Text style={[styles.statusText, { color: getProgressColor() }]}>{getStatusText()}</Text>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 24,
    paddingHorizontal: 16,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 32,
    width: '100%',
    maxWidth: 400,
    alignItems: 'center',
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 3,
  },
  progressContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  daysNumber: {
    fontSize: 56,
    fontWeight: '700',
    textAlign: 'center',
    letterSpacing: -1,
  },
  daysLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.textSecondary,
    textAlign: 'center',
    letterSpacing: 0.5,
    marginTop: 4,
  },
  statusText: {
    fontSize: 16,
    fontWeight: '600',
    textAlign: 'center',
  },
});

export default ProgressSection;