import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Info } from 'lucide-react-native';
import Dropdown from '@/components/Dropdown';
import Button from '@/components/Button';
import RequirementsResult from '@/components/RequirementsResult';
import Colors from '@/constants/colors';
import { countries, tripPurposes } from '@/constants/mockData';
import { useVisaStore } from '@/store/visaStore';

export default function RequirementsScreen() {
  const { userProfile } = useVisaStore();
  const [nationality, setNationality] = useState(userProfile?.nationality || 'United States');
  const [destination, setDestination] = useState('');
  const [purpose, setPurpose] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleCheckRequirements = () => {
    if (!nationality || !destination || !purpose) {
      return;
    }

    setLoading(true);
    setTimeout(() => {
      setShowResults(true);
      setLoading(false);
    }, 1000);
  };

  const isFormValid = nationality && destination && purpose;

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primary, '#0055B3']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Visa Requirements</Text>
        <Text style={styles.headerSubtitle}>
          Check entry requirements for your next destination
        </Text>
      </LinearGradient>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formCard}>
          <Dropdown
            label="Your Nationality"
            options={countries}
            value={nationality}
            onSelect={setNationality}
            placeholder="Select your nationality"
            showFlags={true}
          />

          <Dropdown
            label="Destination Country"
            options={countries}
            value={destination}
            onSelect={setDestination}
            placeholder="Select destination"
            showFlags={true}
          />

          <Dropdown
            label="Trip Purpose"
            options={tripPurposes}
            value={purpose}
            onSelect={setPurpose}
            placeholder="Select purpose"
          />

          <Button
            title="Check Requirements"
            onPress={handleCheckRequirements}
            loading={loading}
            style={[
              styles.button,
              isFormValid && styles.buttonEnabled
            ]}
            size="large"
            disabled={!isFormValid}
          />
        </View>

        {showResults && (
          <RequirementsResult
            nationality={nationality}
            destination={destination}
            purpose={purpose}
          />
        )}

        <View style={styles.infoCard}>
          <View style={styles.infoHeader}>
            <Info size={20} color={Colors.primary} />
            <Text style={styles.infoTitle}>Need Help?</Text>
          </View>
          <Text style={styles.infoText}>
            Our visa requirement data is updated regularly, but regulations can change quickly. For the most accurate information, always check with the embassy or consulate of your destination country.
          </Text>
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
  header: {
    padding: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  content: {
    flex: 1,
    marginTop: -20,
    paddingTop: 24,
  },
  formCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 24,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.15,
    shadowRadius: 20,
    elevation: 10,
  },
  button: {
    marginTop: 32,
    height: 56,
    backgroundColor: Colors.silver,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 8,
    elevation: 4,
  },
  buttonEnabled: {
    backgroundColor: Colors.primary,
  },
  infoCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginBottom: 32,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  infoHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
    marginLeft: 8,
  },
  infoText: {
    fontSize: 15,
    color: '#404040',
    lineHeight: 22,
  },
});