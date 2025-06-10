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
    Linking.openURL('mailto:support@visaflow.app?subject=Support Request&body=Hello, I need assistance with...');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Help & Support',
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color="white" />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.card}>
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Bug size={20} color={Colors.primary} style={styles.sectionIcon} />
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
              icon={<Send size={18} color={Colors.white} style={styles.buttonIcon} />}
            />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.section}>
            <View style={styles.sectionHeader}>
              <Mail size={20} color={Colors.primary} style={styles.sectionIcon} />
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
              icon={<Mail size={18} color={Colors.primary} style={styles.buttonIcon} />}
            />
          </View>
          
          <View style={styles.divider} />
          
          <View style={styles.section}>
            <Text style={styles.faqTitle}>Frequently Asked Questions</Text>
            
            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>How do I add a new visa?</Text>
              <Text style={styles.faqAnswer}>
                Go to the Countdown tab and tap the "New Visa" button in the top right corner. Fill in the required information and tap "Save Visa".
              </Text>
            </View>
            
            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>How do I check visa requirements?</Text>
              <Text style={styles.faqAnswer}>
                Navigate to the Requirements tab and select your nationality, destination country, and purpose of travel to see the visa requirements.
              </Text>
            </View>
            
            <View style={styles.faqItem}>
              <Text style={styles.faqQuestion}>Can I use the app offline?</Text>
              <Text style={styles.faqAnswer}>
                Yes, your visa information is stored locally on your device. However, checking visa requirements needs an internet connection.
              </Text>
            </View>
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  backButton: {
    marginLeft: 8,
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  card: {
    backgroundColor: Colors.white,
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
    color: Colors.black,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  textArea: {
    height: 120,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    fontSize: 16,
    color: Colors.black,
    backgroundColor: Colors.white,
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
    backgroundColor: Colors.border,
    marginVertical: 16,
  },
  faqTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 16,
  },
  faqItem: {
    marginBottom: 16,
  },
  faqQuestion: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 4,
  },
  faqAnswer: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
  },
});