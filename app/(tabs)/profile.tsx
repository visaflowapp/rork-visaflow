import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { Bell, Globe, User, Shield, HelpCircle, LogOut, ChevronRight, CreditCard, Link } from 'lucide-react-native';
import ToggleSwitch from '@/components/ToggleSwitch';
import Button from '@/components/Button';
import Colors from '@/constants/colors';
import { useVisaStore } from '@/store/visaStore';

export default function SettingsScreen() {
  const { 
    userProfile, 
    toggleNotifications,
    userId,
    loadUserData 
  } = useVisaStore();

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
            onToggle={toggleNotifications}
          />
          
          <View style={styles.divider} />
          
          <SettingsItem
            icon={<Globe size={20} color={Colors.primary} />}
            title="Language"
            onPress={() => {}}
          />
          
          <View style={styles.divider} />
          
          <SettingsItem
            icon={<User size={20} color={Colors.primary} />}
            title="Passport Information"
            onPress={() => {}}
          />
          
          <View style={styles.divider} />
          
          <SettingsItem
            icon={<Shield size={20} color={Colors.primary} />}
            title="Privacy & Security"
            onPress={() => {}}
          />
          
          <View style={styles.divider} />
          
          <SettingsItem
            icon={<CreditCard size={20} color={Colors.primary} />}
            title="Billing & Subscription"
            onPress={() => {}}
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
            onPress={() => {}}
          />
        </View>
      </ScrollView>

      <View style={styles.logoutContainer}>
        <Button
          title="Log Out"
          onPress={() => {}}
          variant="outline"
          style={styles.logoutButton}
          icon={<LogOut size={18} color={Colors.primary} style={styles.logoutIcon} />}
        />
      </View>
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