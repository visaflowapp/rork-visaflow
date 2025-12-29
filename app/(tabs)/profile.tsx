import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Bell, Globe, User, Shield, HelpCircle, LogOut, ChevronRight, CreditCard, Link } from 'lucide-react-native';
import ToggleSwitch from '@/components/ToggleSwitch';
import Button from '@/components/Button';
import Colors from '@/constants/colors';
import { useVisaStore } from '@/store/visaStore';
import * as Notifications from 'expo-notifications';
import AsyncStorage from '@react-native-async-storage/async-storage';
import ReportBugModal from '@/components/ReportBugModal';
import DeleteAccountModal from '@/components/DeleteAccountModal';
import CancelSubscriptionModal from '@/components/CancelSubscriptionModal';



export default function SettingsScreen() {
  const router = useRouter();
  const { 
    userProfile, 
    toggleNotifications,
    userId,
    loadUserData
  } = useVisaStore();


  const [showReportBugModal, setShowReportBugModal] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);
  const [showCancelSubscriptionModal, setShowCancelSubscriptionModal] = useState(false);


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
        <ChevronRight size={20} color="#C7C7CC" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Settings',
          headerStyle: {
            backgroundColor: Colors.white,
          },
          headerTintColor: Colors.text,
          headerTitleStyle: {
            fontWeight: '600',
          },
          headerShadowVisible: false,
        }}
      />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.settingsCard}>
          <SettingsItem
            icon={<Bell size={20} color="#007AFF" />}
            title="Push Notifications"
            showToggle={true}
            toggleValue={userProfile.notifications}
            onToggle={handleToggleNotifications}
          />
          
          <View style={styles.divider} />
          
          <SettingsItem
            icon={<Globe size={20} color="#007AFF" />}
            title="Language"
            onPress={handleLanguageChange}
          />
          
          <View style={styles.divider} />
          
          <SettingsItem
            icon={<User size={20} color="#007AFF" />}
            title="Passport Information"
            onPress={navigateToPassportInfo}
          />
          
          <View style={styles.divider} />
          
          <SettingsItem
            icon={<Shield size={20} color="#007AFF" />}
            title="Privacy & Security"
            onPress={navigateToPrivacySecurity}
          />
          
          <View style={styles.divider} />
          
          <SettingsItem
            icon={<CreditCard size={20} color="#007AFF" />}
            title="Billing & Subscription"
            onPress={navigateToBillingSubscription}
          />
          
          <View style={styles.divider} />
          
          <SettingsItem
            icon={<Link size={20} color="#007AFF" />}
            title="Affiliate Program"
            onPress={copyReferralLink}
          />
          
          <View style={styles.divider} />
          
          <SettingsItem
            icon={<HelpCircle size={20} color="#007AFF" />}
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
          icon={() => <LogOut size={18} color="#007AFF" style={styles.logoutIcon} />}
        />
      </View>

      {/* Report Bug Modal */}
      <ReportBugModal
        visible={showReportBugModal}
        onClose={() => setShowReportBugModal(false)}
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
    backgroundColor: Colors.background,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 16,
    color: Colors.text,
  },
  content: {
    flex: 1,
    paddingTop: 16,
  },
  settingsCard: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    marginHorizontal: 16,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 14,
    paddingHorizontal: 16,
  },
  settingsItemLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  iconContainer: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: Colors.primaryLight,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingsItemText: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.text,
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
    backgroundColor: Colors.borderLight,
    marginLeft: 60,
  },
  logoutContainer: {
    padding: 16,
    paddingBottom: 32,
  },
  logoutButton: {
    backgroundColor: Colors.white,
    shadowColor: Colors.cardShadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 2,
    height: 54,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  logoutIcon: {
    marginRight: 8,
  },
});