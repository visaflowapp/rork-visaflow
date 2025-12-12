import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Clock, FileText, Building, CreditCard, Calendar } from 'lucide-react-native';
import { Swipeable } from 'react-native-gesture-handler';
import { GlassView } from 'expo-glass-effect';
import Colors from '@/constants/colors';

interface AlertCardProps {
  id: string;
  type: 'deadline' | 'policy' | 'embassy';
  title: string;
  description: string;
  timestamp: string;
  isRead: boolean;
  icon: string;
  onDismiss: (id: string) => void;
}

const AlertCard: React.FC<AlertCardProps> = ({
  id,
  type,
  title,
  description,
  timestamp,
  isRead,
  icon,
  onDismiss,
}) => {
  // Format timestamp
  const formatTime = (timestamp: string) => {
    try {
      const date = new Date(timestamp);
      return date.toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
      });
    } catch (error: unknown) {
      const errorObj = error instanceof Error ? error : new Error(String(error));
      console.error('Error formatting timestamp:', errorObj.message);
      return 'Invalid date';
    }
  };

  const renderIcon = () => {
    const iconColor = Colors.neonBlue;
    switch (icon) {
      case 'clock':
        return <Clock size={28} color={iconColor} />;
      case 'file-text':
        return <FileText size={28} color={iconColor} />;
      case 'building':
        return <Building size={28} color={iconColor} />;
      case 'credit-card':
        return <CreditCard size={28} color={iconColor} />;
      case 'calendar':
        return <Calendar size={28} color={iconColor} />;
      default:
        return <Clock size={28} color={iconColor} />;
    }
  };

  // Render right actions for swipe
  const renderRightActions = () => {
    return (
      <TouchableOpacity
        style={styles.deleteAction}
        onPress={() => onDismiss(id)}
      >
        <Text style={styles.deleteActionText}>Dismiss</Text>
      </TouchableOpacity>
    );
  };

  const GlassWrapper = Platform.OS === 'ios' ? GlassView : View;
  const glassProps = Platform.OS === 'ios' ? { glassEffectStyle: 'clear' as const } : {};

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <GlassWrapper style={[styles.card, isRead && styles.readCard]} {...glassProps}>
        {!isRead && <View style={styles.unreadIndicator} />}
        <View style={styles.iconContainer}>{renderIcon()}</View>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          <Text style={styles.timestamp}>{formatTime(timestamp)}</Text>
        </View>
      </GlassWrapper>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: 'rgba(13, 27, 42, 0.8)',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: Colors.neonBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 15,
    elevation: 20,
    position: 'relative',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 212, 255, 0.3)',
  },
  readCard: {
    opacity: 0.7,
  },
  unreadIndicator: {
    position: 'absolute',
    top: 20,
    right: 20,
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.glowGreen,
    borderWidth: 2,
    borderColor: Colors.white,
    shadowColor: Colors.glowGreen,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.8,
    shadowRadius: 6,
  },
  iconContainer: {
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(0, 212, 255, 0.1)',
    borderWidth: 1.5,
    borderColor: Colors.neonBlue,
    shadowColor: Colors.neonBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.6,
    shadowRadius: 8,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: Colors.electricCyan,
    marginBottom: 6,
    letterSpacing: 0.3,
  },
  description: {
    fontSize: 14,
    color: 'white',
    marginBottom: 8,
    lineHeight: 20,
    opacity: 0.95,
  },
  timestamp: {
    fontSize: 12,
    color: 'white',
    opacity: 0.7,
    fontWeight: '600',
  },
  deleteAction: {
    backgroundColor: '#FF3B30',
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  deleteActionText: {
    color: 'white',
    fontWeight: '600',
    fontSize: 14,
  },
});

export default AlertCard;