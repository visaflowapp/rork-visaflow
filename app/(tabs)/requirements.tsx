import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import SimpleDropdown from '@/components/SimpleDropdown';
import Button from '@/components/Button';
import RequirementsResult from '@/components/RequirementsResult';
import Colors from '@/constants/colors';
import { useVisaStore } from '@/store/visaStore';
import { checkVisaRequirements, checkVisaRequirementsAlternative, debugApiConfig } from '@/config/api';

// Hardcoded options for immediate testing
const NATIONALITY_OPTIONS = [
  'United States',
  'United Kingdom', 
  'Canada',
  'Australia',
  'Germany',
  'France',
  'Japan',
  'Thailand',
  'Indonesia',
  'Singapore',
  'Malaysia',
  'Philippines',
  'Brazil',
  'Mexico',
  'India',
  'South Korea'
];

const DESTINATION_OPTIONS = [
  'United States',
  'United Kingdom',
  'Canada', 
  'Australia',
  'Germany',
  'France',
  'Japan',
  'Thailand',
  'Indonesia',
  'Singapore',
  'Malaysia',
  'Philippines',
  'Brazil',
  'Mexico',
  'India',
  'South Korea'
];

const PURPOSE_OPTIONS = [
  'Tourism',
  'Business',
  'Work',
  'Study',
  'Transit',
  'Family Visit'
];

export default function RequirementsScreen() {
  const { userProfile } = useVisaStore();
  const [nationality, setNationality] = useState('');
  const [destination, setDestination] = useState('');
  const [purpose, setPurpose] = useState('');
  const [showResults, setShowResults] = useState(false);
  const [loading, setLoading] = useState(false);
  const [requirementsData, setRequirementsData] = useState(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckRequirements = async () => {
    if (!nationality || !destination || !purpose) {
      Alert.alert('Missing Information', 'Please select your nationality, destination, and travel purpose.');
      return;
    }

    if (nationality === destination) {
      Alert.alert('Invalid Selection', 'Your nationality and destination cannot be the same.');
      return;
    }

    setLoading(true);
    setError(null);
    setShowResults(false);
    
    try {
      // First, debug the API configuration
      const config = debugApiConfig();
      console.log('API Configuration Status:', config);
      
      if (!config.ready) {
        throw new Error('API configuration incomplete. Please check your environment variables.');
      }
      
      let data;
      try {
        // Try the primary API method first
        data = await checkVisaRequirements(nationality, destination, purpose);
      } catch (primaryError: unknown) {
        console.log('Primary API method failed, trying alternative...');
        // If primary fails, try the alternative method
        const errorMessage = primaryError instanceof Error ? primaryError.message : String(primaryError);
        console.error('Primary API error:', errorMessage);
        data = await checkVisaRequirementsAlternative(nationality, destination, purpose);
      }
      
      setRequirementsData(data);
      setShowResults(true);
    } catch (err: unknown) {
      console.error('Failed to fetch visa requirements:', err);
      
      let errorMessage = 'Failed to fetch visa requirements. ';
      
      const errorObj = err instanceof Error ? err : new Error(String(err));
      
      if (errorObj.message?.includes('API configuration incomplete')) {
        errorMessage = 'API not configured. Please check your environment variables are set correctly.';
      } else if (errorObj.message?.includes('Invalid API key')) {
        errorMessage = 'Invalid API key. Please verify your RapidAPI credentials.';
      } else if (errorObj.message?.includes('Access forbidden')) {
        errorMessage = 'Access forbidden. Please check your RapidAPI subscription and endpoint access.';
      } else if (errorObj.message?.includes('Rate limit exceeded')) {
        errorMessage = 'Rate limit exceeded. Please try again later.';
      } else if (errorObj.message?.includes('Network request failed')) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else {
        errorMessage += 'Please check your internet connection and try again.';
      }
      
      setError(errorMessage);
      
      // Show error alert
      Alert.alert(
        'Unable to Load Requirements',
        errorMessage,
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

  const handleClearForm = () => {
    setNationality('');
    setDestination('');
    setPurpose('');
    setShowResults(false);
    setError(null);
    setRequirementsData(null);
  };

  const isFormValid = nationality && destination && purpose && nationality !== destination;

  return (
    <View style={styles.container}>
      <View style={styles.content}>
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Check Visa Requirements</Text>
          <Text style={styles.formSubtitle}>Select your details to get visa information</Text>
          
          <SimpleDropdown
            label="Your Nationality"
            options={NATIONALITY_OPTIONS}
            value={nationality}
            onSelect={setNationality}
            placeholder="Select your nationality"
          />

          <SimpleDropdown
            label="Destination Country"
            options={DESTINATION_OPTIONS.filter(country => country !== nationality)}
            value={destination}
            onSelect={setDestination}
            placeholder="Where are you traveling to?"
          />

          <SimpleDropdown
            label="Travel Purpose"
            options={PURPOSE_OPTIONS}
            value={purpose}
            onSelect={setPurpose}
            placeholder="Why are you traveling?"
          />

          <View style={styles.buttonContainer}>
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
            
            {(nationality || destination || purpose) && (
              <Button
                title="Clear Form"
                onPress={handleClearForm}
                variant="outline"
                style={styles.clearButton}
                size="medium"
              />
            )}
          </View>
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
  formTitle: {
    fontSize: 22,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 8,
    textAlign: 'center',
  },
  formSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 24,
    textAlign: 'center',
  },
  buttonContainer: {
    gap: 12,
  },
  button: {
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
  clearButton: {
    height: 44,
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
    color: Colors.red,
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