import React, { useState } from 'react';
import { View, Text, StyleSheet, Alert } from 'react-native';
import Dropdown from '@/components/Dropdown';
import Button from '@/components/Button';
import RequirementsResult from '@/components/RequirementsResult';
import Colors from '@/constants/colors';
import { countries, tripPurposes } from '@/constants/mockData';
import { useVisaStore } from '@/store/visaStore';
import { checkVisaRequirements, checkVisaRequirementsAlternative, debugApiConfig, testApiConnection } from '@/config/api';

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
      } catch (primaryError) {
        console.log('Primary API method failed, trying alternative...');
        // If primary fails, try the alternative method
        const error = primaryError instanceof Error ? primaryError : new Error(String(primaryError));
        data = await checkVisaRequirementsAlternative(nationality, destination, purpose);
      }
      
      setRequirementsData(data);
      setShowResults(true);
    } catch (err: unknown) {
      console.error('Failed to fetch visa requirements:', err);
      
      let errorMessage = 'Failed to fetch visa requirements. ';
      
      const error = err instanceof Error ? err : new Error(String(err));
      
      if (error.message?.includes('API configuration incomplete')) {
        errorMessage = 'API not configured. Please check your environment variables are set correctly.';
      } else if (error.message?.includes('Invalid API key')) {
        errorMessage = 'Invalid API key. Please verify your RapidAPI credentials.';
      } else if (error.message?.includes('Access forbidden')) {
        errorMessage = 'Access forbidden. Please check your RapidAPI subscription and endpoint access.';
      } else if (error.message?.includes('Rate limit exceeded')) {
        errorMessage = 'Rate limit exceeded. Please try again later.';
      } else if (error.message?.includes('Network request failed')) {
        errorMessage = 'Network error. Please check your internet connection.';
      } else {
        errorMessage += 'Please check your internet connection and try again.';
      }
      
      setError(errorMessage);
      
      // Show detailed error alert for debugging
      Alert.alert(
        'API Error',
        `${errorMessage}

Technical details: ${error.message}`,
        [
          { text: 'OK' },
          { 
            text: 'Debug Info', 
            onPress: () => {
              const config = debugApiConfig();
              Alert.alert(
                'Debug Information',
                `Environment Variables Status:
• Endpoint: ${config.endpointSet ? '✅ Set' : '❌ Missing'}
• API Key: ${config.apiKeySet ? '✅ Set' : '❌ Missing'}
• API Key Length: ${config.apiKeyLength} chars
• Ready: ${config.ready ? '✅ Yes' : '❌ No'}

Endpoint: ${process.env.EXPO_PUBLIC_VISA_API_ENDPOINT || 'Not set'}`,
                [{ text: 'OK' }]
              );
            }
          }
        ]
      );
    } finally {
      setLoading(false);
    }
  };

  const handleTestApiConfig = async () => {
    setLoading(true);
    
    try {
      const result = await testApiConnection();
      
      Alert.alert(
        'API Configuration Test',
        `Status: ${result.success ? '✅ Connected' : '❌ Failed'}
        
Environment Variables:
• Endpoint: ${result.config?.endpointSet ? '✅ Set' : '❌ Missing'}
• API Key: ${result.config?.apiKeySet ? '✅ Set' : '❌ Missing'}
• Ready: ${result.config?.ready ? '✅ Yes' : '❌ No'}

${result.error ? `Error: ${result.error}` : ''}
${result.status ? `HTTP Status: ${result.status}` : ''}`,
        [{ text: 'OK' }]
      );
    } catch (err: unknown) {
      const error = err instanceof Error ? err : new Error(String(err));
      Alert.alert('Test Failed', `Unable to test API connection: ${error.message}`);
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
            options={countries.filter(country => country !== nationality)}
            value={destination}
            onSelect={setDestination}
            placeholder="Where are you traveling to?"
            showFlags={true}
          />

          <Dropdown
            label="Travel Purpose"
            options={tripPurposes}
            value={purpose}
            onSelect={setPurpose}
            placeholder="Why are you traveling?"
          />

          <View style={styles.selectionSummary}>
            <Text style={styles.summaryTitle}>Your Selection:</Text>
            <Text style={styles.summaryText}>
              {nationality || 'No nationality selected'} → {destination || 'No destination selected'}
            </Text>
            <Text style={styles.summaryText}>
              Purpose: {purpose || 'No purpose selected'}
            </Text>
          </View>

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
          
          {/* API Configuration Test Button */}
          <Button
            title="Test API Configuration"
            onPress={handleTestApiConfig}
            variant="outline"
            style={styles.testButton}
            size="medium"
            loading={loading}
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
  selectionSummary: {
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  summaryTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 8,
  },
  summaryText: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 4,
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
  testButton: {
    marginTop: 12,
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