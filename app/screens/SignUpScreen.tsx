import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Stack } from 'expo-router';
import Colors from '@/constants/colors';

export default function SignUpScreen() {
  return (
    <View style={styles.container}>
      <Stack.Screen options={{ title: 'Sign Up', headerBackTitle: 'Back' }} />
      <Text style={styles.text}>Sign Up Screen</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: Colors.background || '#F2F2F7',
  },
  text: {
    fontSize: 18,
    color: Colors.text || '#000',
  },
});
