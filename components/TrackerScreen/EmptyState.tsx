import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Button from '@/components/Button';

interface EmptyStateProps {
  onAddVisa: () => void;
}

const EmptyState: React.FC<EmptyStateProps> = ({ onAddVisa }) => {
  const handleAddVisa = () => {
    console.log('EmptyState: Add visa button pressed - calling onAddVisa');
    try {
      onAddVisa();
      console.log('EmptyState: onAddVisa called successfully');
    } catch (error) {
      console.error('EmptyState: Error calling onAddVisa:', error);
    }
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
    fontSize: 24,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 12,
    textAlign: 'center',
  },
  subtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
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