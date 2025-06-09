import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView, Alert } from 'react-native';
import SimpleDropdown from '@/components/SimpleDropdown';
import Button from '@/components/Button';
import Colors from '@/constants/colors';
import { checkVisaRequirements, checkVisaRequirementsAlternative } from '@/config/api';

// Hardcoded options for reliable testing
const NATIONALITY_OPTIONS = [
  'USA',
  'UK', 
  'Thailand',
  'Indonesia',
  'Canada'
];

const DESTINATION_OPTIONS = [
  'Thailand',
  'Indonesia', 
  'Vietnam',
  'Malaysia',
  'Singapore'
];

const PURPOSE_OPTIONS = [
  'Tourism',
  'Business',
  'Transit'
];

export default function RequirementsScreen() {
  const [nationality, setNationality] = useState('');
  const [destination, setDestination] = useState('');
  const [purpose, setPurpose] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
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
    setApiResponse(null);
    
    try {
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
      
      setApiResponse(data);
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

  const handleClearForm = () => {
    setNationality('');
    setDestination('');
    setPurpose('');
    setApiResponse(null);
    setError(null);
  };

  const isFormValid = nationality && destination && purpose && nationality !== destination;

  const renderApiResponse = () => {
    if (!apiResponse) return null;

    return (
      <View style={styles.responseCard}>
        <Text style={styles.responseTitle}>Visa Requirements</Text>
        
        {/* Display specific RapidAPI fields */}
        {apiResponse.passport_of && (
          <View style={styles.responseRow}>
            <Text style={styles.responseLabel}>Passport Of:</Text>
            <Text style={styles.responseValue}>{apiResponse.passport_of}</Text>
          </View>
        )}
        
        {apiResponse.passport_code && (
          <View style={styles.responseRow}>
            <Text style={styles.responseLabel}>Passport Code:</Text>
            <Text style={styles.responseValue}>{apiResponse.passport_code}</Text>
          </View>
        )}
        
        {apiResponse.destination && (
          <View style={styles.responseRow}>
            <Text style={styles.responseLabel}>Destination:</Text>
            <Text style={styles.responseValue}>{apiResponse.destination}</Text>
          </View>
        )}
        
        {apiResponse.visa && (
          <View style={styles.responseRow}>
            <Text style={styles.responseLabel}>Visa Required:</Text>
            <Text style={styles.responseValue}>{apiResponse.visa}</Text>
          </View>
        )}
        
        {apiResponse.stay_of && (
          <View style={styles.responseRow}>
            <Text style={styles.responseLabel}>Stay Duration:</Text>
            <Text style={styles.responseValue}>{apiResponse.stay_of}</Text>
          </View>
        )}
        
        {apiResponse.color && (
          <View style={styles.responseRow}>
            <Text style={styles.responseLabel}>Status Color:</Text>
            <Text style={styles.responseValue}>{apiResponse.color}</Text>
          </View>
        )}
        
        {apiResponse.pass_valid && (
          <View style={styles.responseRow}>
            <Text style={styles.responseLabel}>Passport Validity:</Text>
            <Text style={styles.responseValue}>{apiResponse.pass_valid}</Text>
          </View>
        )}
        
        {apiResponse.link && (
          <View style={styles.responseRow}>
            <Text style={styles.responseLabel}>More Info:</Text>
            <Text style={styles.responseValue}>{apiResponse.link}</Text>
          </View>
        )}
        
        {apiResponse.except_text && (
          <View style={styles.responseRow}>
            <Text style={styles.responseLabel}>Exceptions:</Text>
            <Text style={styles.responseValue}>{apiResponse.except_text}</Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
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
          </View>
        )}

        {renderApiResponse()}
      </ScrollView>
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
  },
  responseCard: {
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
  responseTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 16,
    textAlign: 'center',
  },
  responseRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  responseLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
    fontWeight: '600',
    flex: 1,
  },
  responseValue: {
    fontSize: 14,
    color: Colors.black,
    fontWeight: '500',
    flex: 2,
    textAlign: 'right',
  },
});