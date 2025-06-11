import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { CircularProgress } from '@/components/CircularProgress';

interface ProgressSectionProps {
  daysLeft: number;
  progress: number;
}

const ProgressSection: React.FC<ProgressSectionProps> = ({ daysLeft, progress }) => {
  return (
    <View style={styles.container}>
      <View style={styles.progressContainer}>
        <CircularProgress
          size={200}
          strokeWidth={12}
          progress={progress}
          color="#34C759"
          backgroundColor="rgba(255, 255, 255, 0.3)"
        />
        <View style={styles.centerContent}>
          <Text style={styles.daysNumber}>{daysLeft}</Text>
          <Text style={styles.daysLabel}>DAYS LEFT</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  progressContainer: {
    position: 'relative',
    alignItems: 'center',
    justifyContent: 'center',
  },
  centerContent: {
    position: 'absolute',
    alignItems: 'center',
    justifyContent: 'center',
  },
  daysNumber: {
    fontSize: 48,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
  },
  daysLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
    textAlign: 'center',
    letterSpacing: 1,
  },
});

export default ProgressSection;