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
          size={240}
          strokeWidth={18}
          progress={progress}
          color={getStatusColor(daysLeft)}
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
    paddingVertical: 16,
    paddingTop: 20,
    height: height * 0.35,
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
    width: 240,
    height: 240,
  },
  daysNumber: {
    fontSize: 56,
    fontWeight: 'bold',
    color: 'white',
  },
  daysLabel: {
    fontSize: 20,
    fontWeight: 'bold',
    color: 'white',
    marginTop: -4,
  },
});

export default ProgressSection;