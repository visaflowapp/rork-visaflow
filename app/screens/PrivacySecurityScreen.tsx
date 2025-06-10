import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity, Alert, Linking } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Trash2, Fingerprint, Shield, ExternalLink, ArrowLeft } from 'lucide-react-native';
import Colors from '@/constants/colors';
import ToggleSwitch from '@/components/ToggleSwitch';
import Button from '@/components/Button';
import DeleteAccountModal from '@/components/DeleteAccountModal';

export default function PrivacySecurityScreen() {
  const router = useRouter();
  const [biometricEnabled, setBiometricEnabled] = useState(false);
  const [showDeleteAccountModal, setShowDeleteAccountModal] = useState(false);

  // Load biometric setting on component mount
  React.useEffect(() => {
    const loadBiometricSetting = async () => {
      try {
        const storedSetting = await AsyncStorage.getItem('biometric_enabled');
        if (storedSetting === 'true') {
          setBiometricEnabled(true);
        }
      } catch (error) {
        console.error('Error loading biometric setting:', error);
      }
    };
    
    loadBiometricSetting();
  }, []);

  const handleToggleBiometric = async (value: boolean) => {
    // In a real app, you would implement biometric authentication here
    setBiometricEnabled(value);
    
    try {
      await AsyncStorage.setItem('biometric_enabled', value ? 'true' : 'false');
      
      if (value) {
        Alert.alert(
          'Biometric Authentication',
          'Face ID/Touch ID will be used for authentication when you open the app.',
          [{ text: 'OK' }]
        );
      }
    } catch (error) {
      console.error('Error saving biometric setting:', error);
    }
  };

  const openPrivacyPolicy = () => {
    Linking.openURL('https://visaflow.app/privacy-policy');
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Privacy & Security',
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
          <Text style={styles.sectionTitle}>Security</Text>
          
          <View style={styles.settingItem}>
            <View style={styles.settingTextContainer}>
              <View style={styles.iconContainer}>
                <Fingerprint size={20} color={Colors.primary} />
              </View>
              <View style={styles.settingTextContent}>
                <Text style={styles.settingTitle}>Face ID / Touch ID</Text>
                <Text style={styles.settingDescription}>
                  Use biometric authentication to secure your account
                </Text>
              </View>
            </View>
            <ToggleSwitch
              label=""
              value={biometricEnabled}
              onValueChange={handleToggleBiometric}
            />
          </View>
          
          <View style={styles.divider} />
          
          <Text style={styles.sectionTitle}>Privacy</Text>
          
          <TouchableOpacity style={styles.linkItem} onPress={openPrivacyPolicy}>
            <View style={styles.linkTextContainer}>
              <View style={styles.iconContainer}>
                <Shield size={20} color={Colors.primary} />
              </View>
              <Text style={styles.linkText}>Privacy Policy</Text>
            </View>
            <ExternalLink size={18} color={Colors.silver} />
          </TouchableOpacity>
          
          <View style={styles.divider} />
          
          <Text style={styles.sectionTitle}>Account</Text>
          
          <View style={styles.dangerSection}>
            <Text style={styles.dangerTitle}>Danger Zone</Text>
            <Text style={styles.dangerDescription}>
              Deleting your account will permanently remove all your data, including visa records and settings.
              This action cannot be undone.
            </Text>
            
            <Button
              title="Delete My Account"
              onPress={() => setShowDeleteAccountModal(true)}
              variant="outline"
              style={styles.deleteButton}
              textStyle={styles.deleteButtonText}
              icon={<Trash2 size={18} color={Colors.error} style={styles.deleteIcon} />}
            />
          </View>
        </View>
      </ScrollView>
      
      <DeleteAccountModal
        visible={showDeleteAccountModal}
        onClose={() => setShowDeleteAccountModal(false)}
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
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
    marginVertical: 16,
  },
  settingItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
  },
  settingTextContainer: {
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
  settingTextContent: {
    flex: 1,
  },
  settingTitle: {
    fontSize: 16,
    fontWeight: '500',
    color: Colors.black,
    marginBottom: 4,
  },
  settingDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 8,
  },
  linkItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
  },
  linkTextContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  linkText: {
    fontSize: 16,
    color: Colors.black,
  },
  dangerSection: {
    backgroundColor: Colors.lightRed,
    borderRadius: 12,
    padding: 16,
    marginTop: 8,
  },
  dangerTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.error,
    marginBottom: 8,
  },
  dangerDescription: {
    fontSize: 14,
    color: Colors.black,
    marginBottom: 16,
    lineHeight: 20,
  },
  deleteButton: {
    backgroundColor: 'white',
    borderColor: Colors.error,
    borderWidth: 1,
  },
  deleteButtonText: {
    color: Colors.error,
  },
  deleteIcon: {
    marginRight: 8,
  },
});