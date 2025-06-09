import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import Colors from '@/constants/colors';

export default function RequirementsScreen() {
  const [apiResponse, setApiResponse] = useState<string>('');
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string>('');
  const [envDebug, setEnvDebug] = useState<string>('');

  // Debug environment variables
  useEffect(() => {
    const apiKey = process.env.EXPO_PUBLIC_NOMAD_API_KEY;
    const apiHost = process.env.EXPO_PUBLIC_NOMAD_API_HOST;
    
    const debugInfo = `Environment Variables Debug:
API Key: ${apiKey ? `${apiKey.substring(0, 8)}...` : 'NOT SET'}
API Host: ${apiHost || 'NOT SET'}
All EXPO_PUBLIC vars: ${JSON.stringify(
  Object.keys(process.env).filter(key => key.startsWith('EXPO_PUBLIC_')),
  null,
  2
)}`;
    
    setEnvDebug(debugInfo);
    console.log('Environment Debug:', debugInfo);
  }, []);

  const fetchVisaRequirements = async () => {
    setIsLoading(true);
    setError('');
    setApiResponse('');

    try {
      const apiKey = process.env.EXPO_PUBLIC_NOMAD_API_KEY;
      const apiHost = process.env.EXPO_PUBLIC_NOMAD_API_HOST;

      console.log('API Key exists:', !!apiKey);
      console.log('API Host exists:', !!apiHost);

      if (!apiKey || !apiHost) {
        throw new Error(`Missing API configuration:
API Key: ${apiKey ? 'SET' : 'MISSING'}
API Host: ${apiHost ? 'SET' : 'MISSING'}

Please ensure these environment variables are set:
- EXPO_PUBLIC_NOMAD_API_KEY
- EXPO_PUBLIC_NOMAD_API_HOST

Then restart your development server with: npm start`);
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
      console.log('Response headers:', response.headers);

      if (!response.ok) {
        const errorText = await response.text();
        console.log('Error response:', errorText);
        throw new Error(`API request failed: ${response.status} ${response.statusText}
${errorText}`);
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
            {isLoading ? 'Loading...' : 'Test API Call'}
          </Text>
        </TouchableOpacity>

        {/* Environment Debug Info */}
        <View style={styles.debugContainer}>
          <Text style={styles.debugTitle}>Environment Debug:</Text>
          <ScrollView style={styles.debugScroll} horizontal={true}>
            <Text style={styles.debugText}>{envDebug}</Text>
          </ScrollView>
        </View>

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

        <View style={styles.instructionsContainer}>
          <Text style={styles.instructionsTitle}>Setup Instructions:</Text>
          <Text style={styles.instructionsText}>
            1. Create a .env file in your project root{'\n'}
            2. Add these variables:{'\n'}
            EXPO_PUBLIC_NOMAD_API_KEY=your_api_key{'\n'}
            EXPO_PUBLIC_NOMAD_API_HOST=nomad-travel-intelligence-api.p.rapidapi.com{'\n'}
            3. Restart your development server: npm start
          </Text>
        </View>
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
  debugContainer: {
    backgroundColor: '#f0f0f0',
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  debugTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 8,
  },
  debugScroll: {
    backgroundColor: Colors.white,
    padding: 12,
    borderRadius: 8,
    maxHeight: 200,
  },
  debugText: {
    fontSize: 12,
    color: Colors.black,
    fontFamily: 'monospace',
    lineHeight: 16,
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
  instructionsContainer: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 8,
  },
  instructionsText: {
    fontSize: 14,
    color: Colors.primary,
    lineHeight: 20,
  },
});