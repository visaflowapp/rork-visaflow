import React, { useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import ProfileField from '@/components/ProfileField';
import ToggleSwitch from '@/components/ToggleSwitch';
import Button from '@/components/Button';
import Colors from '@/constants/colors';
import { useVisaStore } from '@/store/visaStore';

export default function ProfileScreen() {
  const { 
    userProfile, 
    updateProfile, 
    toggleNotifications, 
    toggleTravelMode,
    userId,
    loadUserData 
  } = useVisaStore();

  useEffect(() => {
    if (userId) {
      loadUserData();
    }
  }, [userId, loadUserData]);

  if (!userProfile) {
    return (
      <View style={[styles.container, styles.loadingContainer]}>
        <Text style={styles.loadingText}>Loading profile...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primary, '#0055B3']}
        style={styles.header}
      >
        <View style={styles.profileImageContainer}>
          <Image
            source={{ uri: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=500&q=60' }}
            style={styles.profileImage}
          />
        </View>
        <Text style={styles.profileName}>{userProfile.name}</Text>
        <Text style={styles.profileEmail}>{userProfile.email}</Text>
      </LinearGradient>

      <ScrollView style={styles.content}>
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Personal Information</Text>
          <View style={styles.card}>
            <ProfileField
              label="Name"
              value={userProfile.name}
              onSave={(value) => updateProfile({ name: value })}
            />
            <ProfileField
              label="Nationality"
              value={userProfile.nationality}
              onSave={(value) => updateProfile({ nationality: value })}
            />
            <ProfileField
              label="Email"
              value={userProfile.email}
              onSave={(value) => updateProfile({ email: value })}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Preferences</Text>
          <View style={styles.card}>
            <ToggleSwitch
              label="Push Notifications"
              description="Receive alerts about visa deadlines and policy changes"
              value={userProfile.notifications}
              onValueChange={toggleNotifications}
            />
            <ToggleSwitch
              label="Travel Mode"
              description="Optimize app for low data usage while traveling"
              value={userProfile.travel_mode}
              onValueChange={toggleTravelMode}
            />
          </View>
        </View>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}>App Information</Text>
          <View style={styles.card}>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Version</Text>
              <Text style={styles.infoValue}>1.0.0</Text>
            </View>
            <View style={styles.infoRow}>
              <Text style={styles.infoLabel}>Last Updated</Text>
              <Text style={styles.infoValue}>June 7, 2025</Text>
            </View>
          </View>
        </View>

        <View style={styles.buttonContainer}>
          <Button
            title="Log Out"
            onPress={() => {}}
            variant="outline"
            style={styles.logoutButton}
          />
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGray,
  },
  loadingContainer: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  loadingText: {
    fontSize: 18,
    color: Colors.silver,
    fontFamily: 'Montserrat',
  },
  header: {
    padding: 24,
    paddingTop: 40,
    paddingBottom: 40,
    alignItems: 'center',
  },
  profileImageContainer: {
    width: 100,
    height: 100,
    borderRadius: 50,
    overflow: 'hidden',
    borderWidth: 3,
    borderColor: Colors.white,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 8,
    elevation: 6,
  },
  profileImage: {
    width: '100%',
    height: '100%',
  },
  profileName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 4,
    fontFamily: 'Montserrat',
  },
  profileEmail: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Montserrat',
  },
  content: {
    flex: 1,
    marginTop: -20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
    marginHorizontal: 16,
    marginBottom: 12,
    fontFamily: 'Montserrat',
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  infoLabel: {
    fontSize: 16,
    color: Colors.silver,
    fontFamily: 'Montserrat',
  },
  infoValue: {
    fontSize: 16,
    color: Colors.black,
    fontWeight: '500',
    fontFamily: 'Montserrat',
  },
  buttonContainer: {
    padding: 16,
    marginBottom: 24,
  },
  logoutButton: {
    backgroundColor: Colors.white,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 12,
    elevation: 6,
  },
});