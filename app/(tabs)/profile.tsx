import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform, Linking } from 'react-native';
import { useRouter } from 'expo-router';
import { Bell, Globe, User, Shield, HelpCircle, LogOut, ChevronRight, CreditCard, Link, Trash2, Fingerprint } from 'lucide-react-native';
import ToggleSwitch from '@/components/ToggleSwitch';
import Button from '@/components/Button';
import Colors from '@/constants/colors';
import { useVisaStore } from '@/store/visaStore';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReportBugModal from '@/components/ReportBugModal';
import DeleteAccountModal from '@/components/DeleteAccountModal';
import CancelSubscriptionModal from '@/components/CancelSubscriptionModal';

const languages = [
  'English',
  'Spanish',
  'German',
  'French',
  'Mandarin (Simplified Chinese)',
  'Portuguese',
  'Russian'
];

export default function SettingsScreen() {
  const router = useRouter();
  const { 
    userProfile, 
    toggleNotifications,
    userId,
    loadUserData,
    updateProfile 
  } = useVisaStore();

  const [language, setLanguage] = useState('English');
  const [showReportBugModal, setShowReportBugModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [showCancelSubscriptionModal, setShowCancelSubscriptionModal] = useState(false);
  const [biometricEnabled, setBiometricEnabled] = useState(false);

  useEffect(() => {
    if (userId) {
      loadUserData();
    }
  }, [userId, loadUserData]);

  const copyReferralLink = () => {
    const referralLink = 'https://visaflow.app/ref/alex-johnson';
    // In a real app, you would copy to clipboard
    Alert.alert('Referral Link Copied', referralLink);
  };

  const handleToggleNotifications = async (value: boolean) => {
    if (value && Platform.OS !== 'web') {
      const { status: existingStatus } = await Notifications.getPermissionsAsync();
      
      let finalStatus = existingStatus;
      if (existingStatus !== 'granted') {
        const { status } = await Notifications.requestPermissionsAsync();
        finalStatus = status;
      }
      
      if (finalStatus !== 'granted') {
        Alert.alert(
          'Permission Required',
          'Push notifications require permission. Please enable notifications in your device settings.',
          [{ text: 'OK' }]
        );
        return;
      }
    }
    
    toggleNotifications(value);
  };

  const handleLanguageChange = () => {
    router.push('/screens/LanguageScreen');
  };

  const navigateToPassportInfo = () => {
    router.push('/screens/PassportInfoScreen');
  };

  const navigateToPrivacySecurity = () => {
    router.push('/screens/PrivacySecurityScreen');
  };

  const navigateToBillingSubscription = () => {
    router.push('/screens/BillingSubscriptionScreen');
  };

  const navigateToHelpSupport = () => {
    router.push('/screens/HelpSupportScreen');
  };

  const handleContactSupport = () => {
    Linking.openURL('mailto:support@visaflow.app?subject=Support Request&body=Hello, I need assistance with...');
  };

  const handleLogout = async () => {
    try {
      // Clear auth tokens
      await AsyncStorage.removeItem('auth_token');
      await AsyncStorage.removeItem('user_id');
      
      // Clear user data
      await AsyncStorage.removeItem('visa-storage');
      
      // Redirect to sign in screen
      router.replace('/screens/SignInScreen');
    } catch (error) {
      console.error('Error during logout:', error);
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  if (!userProfile) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Loading settings...</Text>
      </View>
    );
  }

  const SettingsItem = ({ 
    icon, 
    title, 
    onPress, 
    showToggle = false, 
    toggleValue = false, 
    onToggle 
  }: {
    icon: React.ReactNode;
    title: string;
    onPress?: () => void;
    showToggle?: boolean;
    toggleValue?: boolean;
    onToggle?: (value: boolean) => void;
  }) => (
    <TouchableOpacity 
      style={styles.settingsItem} 
      onPress={onPress}
      disabled={showToggle}
      activeOpacity={showToggle ? 1 : 0.7}
    >
      <View style={styles.settingsItemLeft}>
        <View style={styles.iconContainer}>
          {icon}
        </View>
        <Text style={styles.settingsItemText}>{title}</Text>
      </View>
      {showToggle ? (
        <ToggleSwitch
          label=""
          value={toggleValue}
          onValueChange={onToggle || (() => {})}
        />
      ) : (
        <ChevronRight size={20} color={Colors.silver} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.settingsCard}>
          <SettingsItem
            icon={<Bell size={20} color={Colors.primary} />}
            title="Push Notifications"
            showToggle={true}
            toggleValue={userProfile.notifications}
            onToggle={handleToggleNotifications}
          />
          
          <View style={styles.divider} />
          
          <SettingsItem
            icon={<Globe size={20} color={Colors.primary} />}
            title="Language"
            onPress={handleLanguageChange}
          />
          
          <View style={styles.divider} />
          
          <SettingsItem
            icon={<User size={20} color={Colors.primary} />}
            title="Passport Information"
            onPress={navigateToPassportInfo}
          />
          
          <View style={styles.divider} />
          
          <SettingsItem
            icon={<Shield size={20} color={Colors.primary} />}
            title="Privacy & Security"
            onPress={navigateToPrivacySecurity}
          />
          
          <View style={styles.divider} />
          
          <SettingsItem
            icon={<CreditCard size={20} color={Colors.primary} />}
            title="Billing & Subscription"
            onPress={navigateToBillingSubscription}
          />
          
          <View style={styles.divider} />
          
          <SettingsItem
            icon={<Link size={20} color={Colors.primary} />}
            title="Affiliate Program"
            onPress={copyReferralLink}
          />
          
          <View style={styles.divider} />
          
          <SettingsItem
            icon={<HelpCircle size={20} color={Colors.primary} />}
            title="Help & Support"
            onPress={navigateToHelpSupport}
          />
        </View>
      </ScrollView>

      <View style={styles.logoutContainer}>
        <Button
          title="Log Out"
          onPress={handleLogout}
          variant="outline"
          style={styles.logoutButton}
          icon={<LogOut size={18} color={Colors.primary} style={styles.logoutIcon} />}
        />
      </View>

      {/* Report Bug Modal */}
      <ReportBugModal
        visible={showReportBugModal}
        onClose={() => setShowReportBugModal(false)}
        onContactSupport={handleContactSupport}
      />

      {/* Delete Account Modal */}
      <DeleteAccountModal
        visible={showDeleteAccountModal}
        onClose={() => setShowDeleteAccountModal(false)}
      />

      {/* Cancel Subscription Modal */}
      <CancelSubscriptionModal
        visible={showCancelSubscriptionModal}
        onClose={() => setShowCancelSubscriptionModal(false)}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: Colors.white,
  },
  content: {
    flex: 1,
    paddingTop: 24,
  },
  settingsCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    marginHorizontal: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 20,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 16,
    paddingHorizontal: 20,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 36,
    height: 36,
    borderRadius: 18,
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 16,
  },
  settingsItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.black,
    flex: 1,
  },
  valueContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  valueText: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginRight: 8,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginLeft: 72,
  },
  logoutContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  logoutButton: {
    backgroundColor: Colors.white,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 20,
    height: 56,
  },
  logoutIcon: {
    marginRight: 8,
  },
});