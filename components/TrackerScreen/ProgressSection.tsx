import React from 'react';
import { View, Text, StyleSheet, Platform } from 'react-native';
import { CircularProgress } from '@/components/CircularProgress';
import { GlassView } from 'expo-glass-effect';
import Colors from '@/constants/colors';

interface ProgressSectionProps {
  daysLeft: number;
  progress: number;
}

const ProgressSection: React.FC<ProgressSectionProps> = ({ daysLeft, progress }) => {
  // Get progress color based on days left
  const getProgressColor = () => {
    if (daysLeft > 30) return Colors.glowGreen;
    if (daysLeft > 14) return Colors.accentTeal;
    if (daysLeft > 7) return Colors.warningAmber;
    return Colors.criticalRed;
  };

  const GlassWrapper = Platform.OS === 'ios' ? GlassView : View;
  const glassProps = Platform.OS === 'ios' ? { glassEffectStyle: 'clear' as const } : {};

  return (
    <View style={styles.container}>
      <View style={[styles.glowContainer, { shadowColor: getProgressColor() }]}>
        <GlassWrapper style={styles.glassCard} {...glassProps}>
          <View style={styles.progressContainer}>
            <CircularProgress
              size={240}
              strokeWidth={18}
              progress={progress}
              color={getProgressColor()}
              backgroundColor="rgba(0, 212, 255, 0.1)"
            />
            <View style={styles.centerContent}>
              <Text style={[styles.daysNumber, { color: getProgressColor() }]}>{daysLeft}</Text>
              <Text style={styles.daysLabel}>DAYS LEFT</Text>
            </View>
          </View>
        </GlassWrapper>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
    paddingVertical: 40,
    paddingHorizontal: 20,
  },
  glowContainer: {
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.5,
    shadowRadius: 30,
    elevation: 20,
  },
  glassCard: {
    backgroundColor: 'rgba(13, 27, 42, 0.7)',
    borderRadius: 30,
    padding: 30,
    borderWidth: 2,
    borderColor: 'rgba(0, 212, 255, 0.3)',
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
    textAlign: 'center',
    textShadowColor: Colors.neonBlue,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 15,
  },
  daysLabel: {
    fontSize: 18,
    fontWeight: '700',
    color: Colors.electricCyan,
    textAlign: 'center',
    letterSpacing: 3,
    marginTop: 4,
    textShadowColor: Colors.neonBlue,
    textShadowOffset: { width: 0, height: 0 },
    textShadowRadius: 8,
  },
});

export default ProgressSection;