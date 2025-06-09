import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

export default function RequirementsScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Visa Requirements</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#000000',
    textAlign: 'center',
  },
});