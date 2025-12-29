import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Clock, FileText, Building, CreditCard, Calendar } from 'lucide-react-native';
import { Swipeable } from 'react-native-gesture-handler';
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
    const iconColor = Colors.primary;
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

  return (
    <Swipeable renderRightActions={renderRightActions}>
      <View style={[styles.card, isRead && styles.readCard]}>
        {!isRead && <View style={styles.unreadIndicator} />}
        <View style={styles.iconContainer}>{renderIcon()}</View>
        <View style={styles.contentContainer}>
          <Text style={styles.title}>{title}</Text>
          <Text style={styles.description}>{description}</Text>
          <Text style={styles.timestamp}>{formatTime(timestamp)}</Text>
        </View>
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  card: {
    flexDirection: 'row',
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginVertical: 6,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    position: 'relative',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  readCard: {
    opacity: 0.6,
  },
  unreadIndicator: {
    position: 'absolute',
    top: 16,
    right: 16,
    width: 8,
    height: 8,
    borderRadius: 4,
    backgroundColor: Colors.primary,
  },
  iconContainer: {
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: Colors.primaryLight,
  },
  contentContainer: {
    flex: 1,
  },
  title: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 4,
  },
  description: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 6,
    lineHeight: 20,
  },
  timestamp: {
    fontSize: 12,
    color: Colors.textTertiary,
    fontWeight: '500',
  },
  deleteAction: {
    backgroundColor: Colors.error,
    justifyContent: 'center',
    alignItems: 'center',
    width: 80,
    height: '100%',
    borderTopRightRadius: 12,
    borderBottomRightRadius: 12,
  },
  deleteActionText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 14,
  },
});

export default AlertCard;