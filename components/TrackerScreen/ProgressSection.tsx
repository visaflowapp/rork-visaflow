import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { CircularProgress } from '@/components/CircularProgress';
import { GlassView } from 'expo-glass-effect';

interface ProgressSectionProps {
  daysLeft: number;
  progress: number;
}

const ProgressSection: React.FC<ProgressSectionProps> = ({ daysLeft, progress }) => {
  // Get progress color based on days left
  const getProgressColor = () => {
    if (daysLeft > 30) return '#34C759';
    if (daysLeft > 14) return '#34C759';
    if (daysLeft > 7) return '#FFD700';
    return '#FF3B30';
  };

  const GlassWrapper = Platform.OS === 'ios' ? GlassView : View;
  const glassProps = Platform.OS === 'ios' ? { glassEffectStyle: 'clear' as const } : {};

  return (
    <View style={styles.container}>
      <GlassWrapper style={styles.glassCard} {...glassProps}>
        <View style={styles.progressContainer}>
          <CircularProgress
            size={240}
            strokeWidth={18}
            progress={progress}
            color={getProgressColor()}
            backgroundColor="rgba(255, 255, 255, 0.2)"
          />
          <View style={styles.centerContent}>
            <Text style={styles.daysNumber}>{daysLeft}</Text>
            <Text style={styles.daysLabel}>DAYS LEFT</Text>
          </View>
        </View>
      </GlassWrapper>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  glassCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.15)',
    borderRadius: 30,
    padding: 30,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 20 },
    shadowOpacity: 0.2,
    shadowRadius: 40,
    elevation: 20,
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
    fontSize: 72,
    fontWeight: 'bold',
    color: 'white',
    textAlign: 'center',
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 2 },
    textShadowRadius: 4,
  },
  daysLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: 'white',
    textAlign: 'center',
    letterSpacing: 2,
    marginTop: 4,
    textShadowColor: 'rgba(0, 0, 0, 0.3)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
  },
});

export default ProgressSection;