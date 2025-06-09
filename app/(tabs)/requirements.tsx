import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import Colors from '@/constants/colors';

export default function RequirementsScreen() {
  const [apiResponse, setApiResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');

  const fetchVisaRequirements = async () => {
    setIsLoading(true);
    setError('');
    setApiResponse('');

    try {
      const apiKey = process.env.EXPO_PUBLIC_NOMAD_API_KEY;
      const apiHost = process.env.EXPO_PUBLIC_NOMAD_API_HOST;

      if (!apiKey || !apiHost) {
        throw new Error('Missing API configuration. Please check environment variables.');
      }

      const from = 'US';
      const to = 'TH';
      
      const url = `https://${apiHost}/api/v1/visa/requirements/${from}/${to}`;
      console.log('Making request to:', url);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': apiKey,
          'x-rapidapi-host': apiHost,
          'Content-Type': 'application/json',
        },
      });

      console.log('Response status:', response.status);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        throw new Error(`API request failed: ${response.status} ${response.statusText}\n${errorText}`);
      }

      const data = await response.json();
      console.log('Success! API Response:', data);
      
      setApiResponse(JSON.stringify(data, null, 2));
      
    } catch (err: unknown) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      console.error('API Error:', errorObj.message);
      setError(errorObj.message);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchVisaRequirements();
  }, []);

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Visa Requirements',
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center',
          },
          headerTitleAlign: 'center',
        }} 
      />

      <ScrollView style={styles.content} contentContainerStyle={styles.contentContainer}>
        <Text style={styles.title}>Visa Requirements</Text>
        <Text style={styles.subtitle}>US → Thailand</Text>

        <TouchableOpacity 
          style={styles.refreshButton}
          onPress={fetchVisaRequirements}
          disabled={isLoading}
        >
          <Text style={styles.refreshButtonText}>
            {isLoading ? 'Loading...' : 'Refresh'}
          </Text>
        </TouchableOpacity>

        {error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorTitle}>Error:</Text>
            <Text style={styles.errorText}>{error}</Text>
          </View>
        ) : null}

        {apiResponse ? (
          <View style={styles.responseContainer}>
            <Text style={styles.responseTitle}>API Response:</Text>
            <ScrollView style={styles.jsonContainer} horizontal={true}>
              <Text style={styles.jsonText}>{apiResponse}</Text>
            </ScrollView>
          </View>
        ) : null}

        {isLoading && (
          <View style={styles.loadingContainer}>
            <Text style={styles.loadingText}>Fetching visa requirements...</Text>
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
  },
  content: {
    flex: 1,
  },
  contentContainer: {
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.black,
    textAlign: 'center',
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
  },
  refreshButton: {
    backgroundColor: Colors.primary,
    paddingVertical: 12,
    paddingHorizontal: 24,
    borderRadius: 12,
    alignItems: 'center',
    marginBottom: 24,
  },
  refreshButtonText: {
    color: Colors.white,
    fontSize: 16,
    fontWeight: '600',
  },
  loadingContainer: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  loadingText: {
    fontSize: 16,
    color: Colors.primary,
    textAlign: 'center',
  },
  errorContainer: {
    backgroundColor: Colors.lightRed,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.error,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 14,
    color: Colors.error,
    lineHeight: 20,
  },
  responseContainer: {
    backgroundColor: Colors.lightGray,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  responseTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 12,
  },
  jsonContainer: {
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: 8,
    maxHeight: 400,
  },
  jsonText: {
    fontSize: 12,
    color: Colors.black,
    fontFamily: 'monospace',
    lineHeight: 16,
  },
});