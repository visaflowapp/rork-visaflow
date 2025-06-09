import React, { useState } from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Button from '@/components/Button';
import Colors from '@/constants/colors';

// Hard-coded options for reliable testing
const NATIONALITIES = [
  { label: 'Select your nationality', value: '' },
  { label: 'USA', value: 'USA' },
  { label: 'UK', value: 'UK' },
  { label: 'Canada', value: 'Canada' },
  { label: 'Australia', value: 'Australia' }
];

const DESTINATIONS = [
  { label: 'Select destination', value: '' },
  { label: 'Thailand', value: 'Thailand' },
  { label: 'Indonesia', value: 'Indonesia' },
  { label: 'Vietnam', value: 'Vietnam' },
  { label: 'Malaysia', value: 'Malaysia' }
];

const PURPOSES = [
  { label: 'Select travel purpose', value: '' },
  { label: 'Tourism', value: 'Tourism' },
  { label: 'Business', value: 'Business' },
  { label: 'Transit', value: 'Transit' }
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
      // For now, show mock data until API is working
      const mockData = {
        passport_of: nationality,
        destination: destination,
        visa: purpose === 'Tourism' ? 'Visa required' : 'eVisa available',
        stay_of: '30 days',
        color: 'yellow',
        pass_valid: '6 months',
        link: `https://embassy.${destination.toLowerCase()}.com/visa-info`,
        mock: true
      };
      
      // Simulate API delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setApiResponse(mockData);
      
    } catch (err: unknown) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      console.error('API error:', errorObj);
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
                {NATIONALITIES.map((item) => (
                  <Picker.Item key={item.value} label={item.label} value={item.value} />
                ))}
              </Picker>
            </View>
            {nationality ? (
              <Text style={styles.selectedValue}>Selected: {nationality}</Text>
            ) : null}
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
                {DESTINATIONS.filter(item => item.value !== nationality).map((item) => (
                  <Picker.Item key={item.value} label={item.label} value={item.value} />
                ))}
              </Picker>
            </View>
            {destination ? (
              <Text style={styles.selectedValue}>Selected: {destination}</Text>
            ) : null}
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
                {PURPOSES.map((item) => (
                  <Picker.Item key={item.value} label={item.label} value={item.value} />
                ))}
              </Picker>
            </View>
            {purpose ? (
              <Text style={styles.selectedValue}>Selected: {purpose}</Text>
            ) : null}
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
                <Text style={styles.mockText}>📝 Mock Data (for testing)</Text>
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
  selectedValue: {
    fontSize: 14,
    color: Colors.primary,
    marginTop: 4,
    fontWeight: '600',
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