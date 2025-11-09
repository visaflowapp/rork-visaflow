import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Linking, Alert } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { CreditCard, Calendar, ExternalLink, AlertTriangle, ArrowLeft } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Button from '@/components/Button';
import CancelSubscriptionModal from '@/components/CancelSubscriptionModal';

export default function BillingSubscriptionScreen() {
  const router = useRouter();
  const [showCancelModal, setShowCancelModal] = useState(false);
  
  // Mock subscription data
  const subscriptionData = {
    plan: 'Free Trial',
    expiryDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // 14 days from now
    features: [
      'Unlimited visa tracking',
      'Visa requirement lookup',
      'Notifications and alerts',
      'Basic support'
    ],
    premiumFeatures: [
      'Advanced visa analytics',
      'Document storage',
      'Priority support',
      'No advertisements'
    ]
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const handleManageBilling = () => {
    // In a real app, this would open the Stripe Customer Portal
    Linking.openURL('https://billing.visaflow.app/portal');
  };

  const handleUpgrade = () => {
    Alert.alert(
      'Upgrade to Premium',
      'You will be redirected to the payment page to complete your subscription.',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Continue', onPress: () => Linking.openURL('https://visaflow.app/premium') }
      ]
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Billing & Subscription',
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
          <View style={styles.planHeader}>
            <Text style={styles.planName}>{subscriptionData.plan}</Text>
            {subscriptionData.plan === 'Free Trial' && (
              <View style={styles.trialBadge}>
                <Text style={styles.trialBadgeText}>14 days left</Text>
              </View>
            )}
          </View>
          
          <View style={styles.expiryContainer}>
            <Calendar size={18} color={Colors.primary} style={styles.expiryIcon} />
            <Text style={styles.expiryText}>
              {subscriptionData.plan === 'Free Trial' 
                ? `Trial expires on ${formatDate(subscriptionData.expiryDate)}`
                : `Next billing date: ${formatDate(subscriptionData.expiryDate)}`
              }
            </Text>
          </View>
          
          <View style={styles.divider} />
          
          <Text style={styles.sectionTitle}>Current Features</Text>
          
          <View style={styles.featuresList}>
            {subscriptionData.features.map((feature, index) => (
              <View key={index} style={styles.featureItem}>
                <View style={styles.featureCheckmark}>
                  <Text>✓</Text>
                </View>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
          
          {subscriptionData.plan === 'Free Trial' && (
            <>
              <View style={styles.divider} />
              
              <Text style={styles.sectionTitle}>Premium Features</Text>
              
              <View style={styles.featuresList}>
                {subscriptionData.premiumFeatures.map((feature, index) => (
                  <View key={index} style={styles.featureItem}>
                    <View style={[styles.featureCheckmark, styles.premiumCheckmark]}>
                      <Text style={styles.premiumCheckmarkText}>✓</Text>
                    </View>
                    <Text style={styles.featureText}>{feature}</Text>
                  </View>
                ))}
              </View>
              
              <Button
                title="Upgrade to Premium"
                onPress={handleUpgrade}
                style={styles.upgradeButton}
              />
            </>
          )}
          
          <View style={styles.divider} />
          
          <View style={styles.actionButtons}>
            <Button
              title="Manage Billing"
              onPress={handleManageBilling}
              variant="outline"
              style={styles.actionButton}
              icon={() => <CreditCard size={18} color={Colors.primary} style={styles.buttonIcon} />}
            />
            
            {subscriptionData.plan !== 'Free Trial' && (
              <Button
                title="Cancel Subscription"
                onPress={() => setShowCancelModal(true)}
                variant="outline"
                style={[styles.actionButton, styles.cancelButton]}
                textStyle={styles.cancelButtonText}
                icon={() => <AlertTriangle size={18} color={Colors.error} style={styles.buttonIcon} />}
              />
            )}
          </View>
        </View>
      </ScrollView>
      
      <CancelSubscriptionModal
        visible={showCancelModal}
        onClose={() => setShowCancelModal(false)}
      />
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
  planHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  planName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.black,
    marginRight: 12,
  },
  trialBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
  },
  trialBadgeText: {
    color: Colors.white,
    fontSize: 12,
    fontWeight: '600',
  },
  expiryContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  expiryIcon: {
    marginRight: 8,
  },
  expiryText: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 16,
  },
  featuresList: {
    marginBottom: 16,
  },
  featureItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  featureCheckmark: {
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: 'rgba(52, 199, 89, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  premiumCheckmark: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  premiumCheckmarkText: {
    color: Colors.primary,
  },
  featureText: {
    fontSize: 16,
    color: Colors.black,
  },
  upgradeButton: {
    marginVertical: 16,
  },
  actionButtons: {
    flexDirection: 'column',
    gap: 12,
  },
  actionButton: {
    justifyContent: 'center',
  },
  buttonIcon: {
    marginRight: 8,
  },
  cancelButton: {
    borderColor: Colors.error,
  },
  cancelButtonText: {
    color: Colors.error,
  },
});