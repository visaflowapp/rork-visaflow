import React, { useState } from 'react';
import { View, Text, StyleSheet } from 'react-native';
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
      <View style={styles.content}>
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
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  content: {
    flex: 1,
    paddingTop: 24,
  },
  formCard: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    marginHorizontal: 16,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 20,
  },
  button: {
    marginTop: 32,
    height: 56,
    backgroundColor: Colors.silver,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 6 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  buttonEnabled: {
    backgroundColor: Colors.primary,
  },
});