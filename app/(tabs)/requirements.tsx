import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Dropdown from '@/components/Dropdown';
import Button from '@/components/Button';
import RequirementsResult from '@/components/RequirementsResult';
import Colors from '@/constants/colors';
import { countries, tripPurposes } from '@/constants/mockData';
import { useVisaStore } from '@/store/visaStore';
import { checkVisaRequirements } from '@/config/api';

export default function RequirementsScreen() {
  const { userProfile } = useVisaStore();
  const [nationality, setNationality] = useState(userProfile?.nationality || 'United States');
  const [destination, setDestination] = useState('');
  const [purpose, setPurpose] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [requirementsData, setRequirementsData] = useState(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckRequirements = async () => {
    if (!nationality || !destination || !purpose) {
      return;
    }

    setLoading(true);
    setError(null);
    
    try {
      const data = await checkVisaRequirements(nationality, destination, purpose);
      setRequirementsData(data);
      setShowResults(true);
    } catch (err) {
      console.error('Failed to fetch visa requirements:', err);
      setError('Failed to fetch visa requirements. Please check your internet connection and try again.');
      
      // Show error alert
      Alert.alert(
        'Error',
        'Unable to fetch visa requirements. Please check your internet connection and try again.',
        [{ text: 'OK' }]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleRetry = () => {
    setError(null);
    setShowResults(false);
    handleCheckRequirements();
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

        {error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>Unable to Load Requirements</Text>
            <Text style={styles.errorText}>{error}</Text>
            <Button
              title="Try Again"
              onPress={handleRetry}
              style={styles.retryButton}
              size="medium"
            />
          </View>
        )}

        {showResults && !error && requirementsData && (
          <RequirementsResult
            nationality={nationality}
            destination={destination}
            purpose={purpose}
            data={requirementsData}
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
  errorCard: {
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
    alignItems: 'center',
  },
  errorTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.error,
    marginBottom: 8,
    textAlign: 'center',
  },
  errorText: {
    fontSize: 14,
    color: Colors.textSecondary,
    textAlign: 'center',
    lineHeight: 20,
    marginBottom: 16,
  },
  retryButton: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 24,
  },
});