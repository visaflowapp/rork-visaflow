import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, Platform } from 'react-native';
import { Clock, FileText, Building, CreditCard, Calendar } from 'lucide-react-native';
import Colors from '@/constants/colors';
import { Swipeable } from 'react-native-gesture-handler';
import { GlassView } from 'expo-glass-effect';

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
    switch (icon) {
      case 'clock':
        return <Clock size={28} color="white" />;
      case 'file-text':
        return <FileText size={28} color="white" />;
      case 'building':
        return <Building size={28} color="white" />;
      case 'credit-card':
        return <CreditCard size={28} color="white" />;
      case 'calendar':
        return <Calendar size={28} color="white" />;
      default:
        return <Clock size={28} color="white" />;
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
    backgroundColor: 'rgba(255, 255, 255, 0.2)',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 20,
    position: 'relative',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
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
    backgroundColor: '#34C759',
    borderWidth: 2,
    borderColor: 'white',
  },
  iconContainer: {
    marginRight: 16,
    justifyContent: 'center',
    alignItems: 'center',
    width: 48,
    height: 48,
    borderRadius: 24,
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 17,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 6,
    textShadowColor: 'rgba(0, 0, 0, 0.2)',
    textShadowOffset: { width: 0, height: 1 },
    textShadowRadius: 2,
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