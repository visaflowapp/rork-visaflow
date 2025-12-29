import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '@/components/Button';
import Colors from '@/constants/colors';

interface EmptyStateProps {
  onAddVisa: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddVisa }) => {
  const handleAddVisa = () => {
    onAddVisa();
  };

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.emoji}>📋</Text>
        <Text style={styles.title}>No Visas Added</Text>
        <Text style={styles.subtitle}>
          Add your first visa to start tracking your countdown
        </Text>
        <Button
          testID="add-first-visa-btn"
          title="Add Your First Visa"
          onPress={handleAddVisa}
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 32,
  },
  content: {
    alignItems: 'center',
  },
  emoji: {
    fontSize: 64,
    marginBottom: 24,
  },
  title: {
    fontSize: 22,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 15,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 32,
    lineHeight: 22,
  },
  button: {
    paddingHorizontal: 32,
    paddingVertical: 16,
  },
});

export default EmptyState;