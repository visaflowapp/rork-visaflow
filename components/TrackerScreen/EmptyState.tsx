import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { Plus } from 'lucide-react-native';
import { colors } from '@/constants/colors';

interface EmptyStateProps {
  onAddVisa: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddVisa }) => {
  return (
    <View style={styles.emptyState}>
      <Text style={styles.emptyTitle}>No Active Visas</Text>
      <Text style={styles.emptySubtitle}>Add your first visa to start tracking</Text>
      <TouchableOpacity 
        style={styles.emptyStateButton}
        onPress={onAddVisa}
      >
        <Plus size={20} color={colors.primary} style={styles.buttonIcon} />
        <Text style={styles.emptyStateButtonText}>New Visa</Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  emptyState: {
    alignItems: 'center',
    paddingVertical: 60,
    paddingHorizontal: 40,
    flex: 1,
    justifyContent: 'center',
  },
  emptyTitle: {
    fontSize: 26,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  emptySubtitle: {
    fontSize: 17,
    color: 'rgba(255, 255, 255, 0.8)',
    textAlign: 'center',
    marginBottom: 32,
  },
  emptyStateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonIcon: {
    marginRight: 8,
  },
  emptyStateButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
});

export default EmptyState;