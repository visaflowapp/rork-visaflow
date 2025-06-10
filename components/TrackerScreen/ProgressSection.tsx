import React from 'react';
import { View, Text, StyleSheet, Dimensions } from 'react-native';
import { CircularProgress } from '@/components/CircularProgress';
import { getStatusColor } from '@/utils/visaHelpers';

const { height } = Dimensions.get('window');

interface ProgressSectionProps {
  daysLeft: number;
  progress: number;
}

const ProgressSection: React.FC<ProgressSectionProps> = ({ daysLeft, progress }) => {
  return (
    <View style={styles.progressSection}>
      <View style={styles.progressContainer}>
        <CircularProgress
          size={280}
          strokeWidth={20}
          progress={progress}
          color="#34C759"
          backgroundColor="rgba(255, 255, 255, 0.2)"
        />
        <View style={styles.progressContent}>
          <Text style={styles.daysNumber}>{daysLeft}</Text>
          <Text style={styles.daysLabel}>DAYS LEFT</Text>
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  progressSection: {
    alignItems: 'center',
    paddingVertical: 20,
    paddingTop: 30,
    height: height * 0.4,
    justifyContent: 'center',
  },
  progressContainer: {
    position: 'relative',
    justifyContent: 'center',
    alignItems: 'center',
  },
  progressContent: {
    position: 'absolute',
    justifyContent: 'center',
    alignItems: 'center',
    width: 280,
    height: 280,
  },
  daysNumber: {
    fontSize: 64,
    fontWeight: 'bold',
    color: 'white',
    lineHeight: 70,
  },
  daysLabel: {
    fontSize: 18,
    fontWeight: 'bold',
    color: 'white',
    marginTop: 4,
    letterSpacing: 2,
  },
});

export default ProgressSection;