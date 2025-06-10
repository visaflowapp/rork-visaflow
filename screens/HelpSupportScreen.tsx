import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TextInput, TouchableOpacity, Alert, Linking } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Bug, Mail, Send, ArrowLeft } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Button from '@/components/Button';

export default function HelpSupportScreen() {
  const router = useRouter();
  const [bugDescription, setBugDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitBug = () => {
    if (!bugDescription.trim()) {
      Alert.alert('Error', 'Please describe the issue you encountered');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Bug Report Submitted',
        'Thank you for your feedback! Our team will investigate the issue.',
        [{ text: 'OK', onPress: () => setBugDescription('') }]
      );
    }, 1500);
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:mia@visaflowapp.com?subject=VisaFlow App Support Request&body=Hello, I need assistance with...');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Help & Support',
          headerStyle: { backgroundColor: '#007AFF' },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
        }} 
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Bug size={20} color="#007AFF" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Report a Bug</Text>
            </View>
            <Text style={styles.sectionDescription}>
              Encountered an issue? Let us know so we can fix it.
            </Text>
            <TextInput
              style={styles.textArea}
              value={bugDescription}
              onChangeText={setBugDescription}
              placeholder="Describe the issue you encountered..."
              multiline
              numberOfLines={4}
              textAlignVertical="top"
            />
            <Button
              title="Submit Report"
              onPress={handleSubmitBug}
              loading={isSubmitting}
              style={styles.submitButton}
              icon={() => <Send size={18} color="#FFFFFF" style={styles.buttonIcon} />}
            />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Mail size={20} color="#007AFF" style={styles.sectionIcon} />
              <Text style={styles.sectionTitle}>Contact Support</Text>
            </View>
            <Text style={styles.sectionDescription}>
              Need help with something else? Our support team is ready to assist you.
            </Text>
            <Button
              title="Email Support"
              onPress={handleContactSupport}
              variant="outline"
              style={styles.contactButton}
              icon={() => <Mail size={18} color="#007AFF" style={styles.buttonIcon} />}
            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#007AFF',
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: '#FFFFFF',
    borderRadius: 20,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 20,
  },
  section: {
    marginBottom: 16,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  sectionDescription: {
    fontSize: 14,
    color: '#8E8E93',
    marginBottom: 16,
    lineHeight: 20,
  },
  textArea: {
    height: 120,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  submitButton: {
    marginBottom: 8,
  },
  contactButton: {
    marginTop: 8,
  },
  buttonIcon: {
    marginRight: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginVertical: 16,
  },
});