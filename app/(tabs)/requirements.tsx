import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Button from '@/components/Button';
import Colors from '@/constants/colors';

// Hard-coded options for reliable testing
const NATIONALITIES = ['', 'USA', 'UK', 'Canada', 'Thailand', 'Indonesia'];
const DESTINATIONS = ['', 'Thailand', 'Indonesia', 'Vietnam', 'Malaysia'];
const PURPOSES = ['', 'Tourism', 'Business', 'Transit'];

export default function RequirementsScreen() {
  const [nationality, setNationality] = useState('');
  const [destination, setDestination] = useState('');
  const [purpose, setPurpose] = useState('');
  const [loading, setLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);

  const handleCheckRequirements = async () => {
    if (!nationality || !destination || !purpose) {
      setError('Please select all three fields');
      return;
    }

    if (nationality === destination) {
      setError('Nationality and destination cannot be the same');
      return;
    }

    setLoading(true);
    setError(null);
    setApiResponse(null);
    
    try {
      // Test different RapidAPI endpoints systematically
      const endpoints = [
        '',
        'requirements',
        'visa',
        'api/visa-requirements',
        `country?from_country=${nationality}&to_country=${destination}&purpose=${purpose}`
      ];
      
      const baseUrl = 'https://visa-requirement.p.rapidapi.com';
      const apiKey = process.env.EXPO_PUBLIC_VISA_API_KEY;
      
      if (!apiKey) {
        throw new Error('API key not configured');
      }
      
      console.log('Testing API endpoints...');
      
      for (const endpoint of endpoints) {
        try {
          const url = endpoint ? `${baseUrl}/${endpoint}` : baseUrl;
          console.log(`Testing endpoint: ${url}`);
          
          const response = await fetch(url, {
            method: 'GET',
            headers: {
              'X-RapidAPI-Key': apiKey,
              'X-RapidAPI-Host': 'visa-requirement.p.rapidapi.com',
            },
          });
          
          console.log(`Response status: ${response.status}`);
          
          if (response.ok) {
            const data = await response.json();
            console.log('Success! Response data:', data);
            setApiResponse(data);
            setLoading(false);
            return;
          } else {
            const errorText = await response.text();
            console.log(`Endpoint ${endpoint || 'root'} failed: ${response.status} - ${errorText}`);
          }
        } catch (endpointError) {
          console.log(`Endpoint ${endpoint || 'root'} error:`, endpointError);
        }
      }
      
      // If all endpoints fail, show mock data
      console.log('All endpoints failed, showing mock data');
      setApiResponse({
        passport_of: nationality,
        destination: destination,
        visa: 'Visa required',
        stay_of: '30 days',
        color: 'yellow',
        pass_valid: '6 months',
        link: `https://embassy.${destination.toLowerCase()}.com`,
        mock: true
      });
      
    } catch (err) {
      console.error('API error:', err);
      setError('Failed to fetch visa requirements. Please try again.');
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

  return (
    <View style={styles.container}>
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.formCard}>
          <Text style={styles.formTitle}>Check Visa Requirements</Text>
          <Text style={styles.formSubtitle}>Select your details to get visa information</Text>
          
          {/* Nationality Picker */}
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Your Nationality</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={nationality}
                onValueChange={(itemValue) => {
                  setNationality(itemValue);
                  if (itemValue === destination) {
                    setDestination('');
                  }
                }}
                style={styles.picker}
              >
                <Picker.Item label="Select your nationality" value="" />
                {NATIONALITIES.slice(1).map((country) => (
                  <Picker.Item key={country} label={country} value={country} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Destination Picker */}
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Destination Country</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={destination}
                onValueChange={(itemValue) => setDestination(itemValue)}
                style={styles.picker}
                enabled={!!nationality}
              >
                <Picker.Item label="Select destination" value="" />
                {DESTINATIONS.slice(1).filter(country => country !== nationality).map((country) => (
                  <Picker.Item key={country} label={country} value={country} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Purpose Picker */}
          <View style={styles.pickerContainer}>
            <Text style={styles.pickerLabel}>Travel Purpose</Text>
            <View style={styles.pickerWrapper}>
              <Picker
                selectedValue={purpose}
                onValueChange={(itemValue) => setPurpose(itemValue)}
                style={styles.picker}
              >
                <Picker.Item label="Select travel purpose" value="" />
                {PURPOSES.slice(1).map((purposeOption) => (
                  <Picker.Item key={purposeOption} label={purposeOption} value={purposeOption} />
                ))}
              </Picker>
            </View>
          </View>

          {/* Selected Values Display */}
          {(nationality || destination || purpose) && (
            <View style={styles.selectionCard}>
              <Text style={styles.selectionTitle}>Current Selection:</Text>
              <Text style={styles.selectionText}>Nationality: {nationality || 'Not selected'}</Text>
              <Text style={styles.selectionText}>Destination: {destination || 'Not selected'}</Text>
              <Text style={styles.selectionText}>Purpose: {purpose || 'Not selected'}</Text>
            </View>
          )}

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
            <Text style={styles.errorTitle}>Error</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        )}

        {apiResponse && (
          <View style={styles.responseCard}>
            <Text style={styles.responseTitle}>Visa Requirements</Text>
            
            {apiResponse.mock && (
              <View style={styles.mockNotice}>
                <Text style={styles.mockText}>📝 Mock Data (API endpoints failed)</Text>
              </View>
            )}
            
            <View style={styles.responseRow}>
              <Text style={styles.responseLabel}>Passport Of:</Text>
              <Text style={styles.responseValue}>{apiResponse.passport_of || 'N/A'}</Text>
            </View>
            
            <View style={styles.responseRow}>
              <Text style={styles.responseLabel}>Destination:</Text>
              <Text style={styles.responseValue}>{apiResponse.destination || 'N/A'}</Text>
            </View>
            
            <View style={styles.responseRow}>
              <Text style={styles.responseLabel}>Visa Required:</Text>
              <Text style={styles.responseValue}>{apiResponse.visa || 'N/A'}</Text>
            </View>
            
            <View style={styles.responseRow}>
              <Text style={styles.responseLabel}>Stay Duration:</Text>
              <Text style={styles.responseValue}>{apiResponse.stay_of || 'N/A'}</Text>
            </View>
            
            <View style={styles.responseRow}>
              <Text style={styles.responseLabel}>Status Color:</Text>
              <Text style={styles.responseValue}>{apiResponse.color || 'N/A'}</Text>
            </View>
            
            <View style={styles.responseRow}>
              <Text style={styles.responseLabel}>Passport Validity:</Text>
              <Text style={styles.responseValue}>{apiResponse.pass_valid || 'N/A'}</Text>
            </View>
            
            {apiResponse.link && (
              <View style={styles.responseRow}>
                <Text style={styles.responseLabel}>More Info:</Text>
                <Text style={styles.responseValue}>{apiResponse.link}</Text>
              </View>
            )}
          </View>
        )}
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
  pickerContainer: {
    marginBottom: 20,
  },
  pickerLabel: {
    fontSize: 16,
    marginBottom: 8,
    color: Colors.black,
    fontWeight: '600',
  },
  pickerWrapper: {
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    backgroundColor: Colors.white,
    overflow: 'hidden',
  },
  picker: {
    height: 56,
    color: Colors.black,
  },
  selectionCard: {
    backgroundColor: Colors.lightGray,
    borderRadius: 12,
    padding: 16,
    marginBottom: 20,
  },
  selectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 8,
  },
  selectionText: {
    fontSize: 14,
    color: Colors.black,
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
  mockNotice: {
    backgroundColor: 'rgba(255, 193, 7, 0.1)',
    padding: 12,
    borderRadius: 8,
    marginBottom: 16,
    borderLeftWidth: 4,
    borderLeftColor: '#FFC107',
  },
  mockText: {
    fontSize: 14,
    color: '#F57C00',
    fontWeight: '600',
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