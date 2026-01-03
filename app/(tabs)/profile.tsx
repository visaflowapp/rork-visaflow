import React, { useEffect, useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Platform } from 'react-native';
import { useRouter, Stack } from 'expo-router';
import { Bell, User, Shield, HelpCircle, LogOut, ChevronRight, CreditCard } from 'lucide-react-native';
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
        <ChevronRight size={20} color="#0000EE" />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen
        options={{
          title: 'Settings',
          headerStyle: {
            backgroundColor: '#0000EE',
          },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 17,
          },
          headerTitleAlign: 'center',
          headerShadowVisible: false,
        }}
      />
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.settingsCard}>
          <SettingsItem
            icon={<Bell size={20} color="#0000EE" />}
            title="Push Notifications"
            showToggle={true}
            toggleValue={userProfile.notifications}
            onToggle={handleToggleNotifications}
          />
          
          <View style={styles.divider} />
          
          <SettingsItem
            icon={<User size={20} color="#0000EE" />}
            title="Passport Information"
            onPress={navigateToPassportInfo}
          />
          
          <View style={styles.divider} />
          
          <SettingsItem
            icon={<Shield size={20} color="#0000EE" />}
            title="Privacy & Security"
            onPress={navigateToPrivacySecurity}
          />
          
          <View style={styles.divider} />
          
          <SettingsItem
            icon={<CreditCard size={20} color="#0000EE" />}
            title="Billing & Subscription"
            onPress={navigateToBillingSubscription}
          />
          
          <View style={styles.divider} />
          
          <SettingsItem
            icon={<HelpCircle size={20} color="#0000EE" />}
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
          icon={() => <LogOut size={18} color="#0000EE" />}
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
    backgroundColor: '#0000EE',
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
  },
  settingsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    marginHorizontal: 16,
    marginTop: 12,
    padding: 12,
    shadowColor: '#0000EE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  settingsItem: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 10,
    paddingHorizontal: 0,
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
    backgroundColor: 'rgba(0, 0, 238, 0.1)',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  settingsItemText: {
    fontSize: 15,
    fontWeight: '500',
    color: '#000000',
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
    backgroundColor: 'rgba(0, 0, 238, 0.1)',
    marginLeft: 0,
    marginVertical: 0,
  },
  logoutContainer: {
    padding: 16,
    paddingBottom: 20,
  },
  logoutButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    shadowColor: '#0000EE',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 2,
    height: 50,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  logoutIcon: {
    marginRight: 8,
  },
});