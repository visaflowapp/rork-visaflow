// API Configuration for RapidAPI Visa Requirements
export const API_CONFIG = {
  // RapidAPI endpoint for visa requirements
  VISA_REQUIREMENTS_ENDPOINT: process.env.EXPO_PUBLIC_VISA_API_ENDPOINT || 'https://visa-requirement.p.rapidapi.com/',
  
  // RapidAPI key
  API_KEY: process.env.EXPO_PUBLIC_VISA_API_KEY || '',
  
  // RapidAPI host (extracted from the endpoint)
  RAPIDAPI_HOST: 'visa-requirement.p.rapidapi.com',
  
  // Headers for RapidAPI
  HEADERS: {
    'Content-Type': 'application/json',
    'X-RapidAPI-Host': 'visa-requirement.p.rapidapi.com',
  }
};

// Debug function to check if environment variables are loaded
export const debugApiConfig = () => {
  console.log('=== API Configuration Debug ===');
  console.log('Endpoint:', API_CONFIG.VISA_REQUIREMENTS_ENDPOINT);
  console.log('API Key exists:', !!API_CONFIG.API_KEY);
  console.log('API Key length:', API_CONFIG.API_KEY?.length || 0);
  console.log('API Key preview:', API_CONFIG.API_KEY ? `${API_CONFIG.API_KEY.substring(0, 8)}...` : 'Not set');
  console.log('RapidAPI Host:', API_CONFIG.RAPIDAPI_HOST);
  console.log('Environment check:');
  console.log('- EXPO_PUBLIC_VISA_API_ENDPOINT:', process.env.EXPO_PUBLIC_VISA_API_ENDPOINT);
  console.log('- EXPO_PUBLIC_VISA_API_KEY exists:', !!process.env.EXPO_PUBLIC_VISA_API_KEY);
  
  // Additional runtime check
  const runtimeEndpoint = process.env.EXPO_PUBLIC_VISA_API_ENDPOINT;
  const runtimeApiKey = process.env.EXPO_PUBLIC_VISA_API_KEY;
  
  console.log('Runtime environment variables:');
  console.log('- Runtime endpoint:', runtimeEndpoint);
  console.log('- Runtime API key exists:', !!runtimeApiKey);
  console.log('- Runtime API key length:', runtimeApiKey?.length || 0);
  console.log('===============================');
  
  return {
    endpointSet: !!(runtimeEndpoint || API_CONFIG.VISA_REQUIREMENTS_ENDPOINT),
    apiKeySet: !!(runtimeApiKey || API_CONFIG.API_KEY),
    apiKeyLength: (runtimeApiKey || API_CONFIG.API_KEY)?.length || 0,
    ready: !!(runtimeEndpoint || API_CONFIG.VISA_REQUIREMENTS_ENDPOINT) && !!(runtimeApiKey || API_CONFIG.API_KEY)
  };
};

// API request function for RapidAPI visa requirements
export const checkVisaRequirements = async (nationality: string, destination: string, purpose: string) => {
  try {
    // Debug log to verify environment variables
    const config = debugApiConfig();
    
    if (!config.ready) {
      throw new Error('API configuration incomplete. Please check environment variables.');
    }
    
    // Use runtime environment variables if available
    const endpoint = process.env.EXPO_PUBLIC_VISA_API_ENDPOINT || API_CONFIG.VISA_REQUIREMENTS_ENDPOINT;
    const apiKey = process.env.EXPO_PUBLIC_VISA_API_KEY || API_CONFIG.API_KEY;
    
    // Construct the API endpoint - RapidAPI visa-requirement typically uses specific endpoints
    const fullEndpoint = `${endpoint.replace(/\/$/, '')}/visa-requirements`;
    
    console.log('Making API request to:', fullEndpoint);
    console.log('Using API key length:', apiKey.length);
    console.log('Request payload:', { 
      from_country: nationality, 
      to_country: destination, 
      purpose: purpose.toLowerCase() 
    });
    
    const response = await fetch(fullEndpoint, {
      method: 'POST',
      headers: {
        ...API_CONFIG.HEADERS,
        'X-RapidAPI-Key': apiKey,
      },
      body: JSON.stringify({
        from_country: nationality,
        to_country: destination,
        purpose: purpose.toLowerCase(),
      }),
    });

    console.log('Response status:', response.status);
    console.log('Response headers:', Object.fromEntries(response.headers.entries()));

    if (!response.ok) {
      const errorText = await response.text();
      console.error('API Error Response:', errorText);
      
      // Provide specific error messages based on status codes
      let errorMessage = `API request failed: ${response.status} ${response.statusText}`;
      
      switch (response.status) {
        case 401:
          errorMessage = 'Invalid API key. Please check your RapidAPI credentials.';
          break;
        case 403:
          errorMessage = 'Access forbidden. Please verify your RapidAPI subscription and endpoint access.';
          break;
        case 429:
          errorMessage = 'Rate limit exceeded. Please wait and try again.';
          break;
        case 404:
          errorMessage = 'API endpoint not found. Please verify the endpoint URL.';
          break;
        default:
          errorMessage = `API error: ${response.status} - ${errorText}`;
      }
      
      throw new Error(errorMessage);
    }

    const data = await response.json();
    console.log('API Response data:', data);
    return data;
  } catch (err: unknown) {
    const errorObj = err instanceof Error ? err : new Error(String(err));
    console.error('Visa requirements API error:', errorObj);
    throw errorObj;
  }
};

// Alternative API request function with different endpoint structure
export const checkVisaRequirementsAlternative = async (nationality: string, destination: string, purpose: string) => {
  try {
    // Use runtime environment variables if available
    const endpoint = process.env.EXPO_PUBLIC_VISA_API_ENDPOINT || API_CONFIG.VISA_REQUIREMENTS_ENDPOINT;
    const apiKey = process.env.EXPO_PUBLIC_VISA_API_KEY || API_CONFIG.API_KEY;
    
    // Try different endpoint structure that some RapidAPI services use
    const fullEndpoint = `${endpoint.replace(/\/$/, '')}/check`;
    
    console.log('Making alternative API request to:', fullEndpoint);
    
    const response = await fetch(fullEndpoint, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': API_CONFIG.RAPIDAPI_HOST,
        'Content-Type': 'application/json',
      },
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Alternative API Error Response:', errorText);
      throw new Error(`Alternative API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    console.log('Alternative API Response data:', data);
    return data;
  } catch (err: unknown) {
    const errorObj = err instanceof Error ? err : new Error(String(err));
    console.error('Alternative visa requirements API error:', errorObj);
    throw errorObj;
  }
};

// Function to test API connectivity
export const testApiConnection = async () => {
  try {
    const config = debugApiConfig();
    
    if (!config.ready) {
      return {
        success: false,
        error: 'API configuration incomplete',
        config: config
      };
    }
    
    // Use runtime environment variables if available
    const endpoint = process.env.EXPO_PUBLIC_VISA_API_ENDPOINT || API_CONFIG.VISA_REQUIREMENTS_ENDPOINT;
    const apiKey = process.env.EXPO_PUBLIC_VISA_API_KEY || API_CONFIG.API_KEY;
    
    // Simple test request to verify API is accessible
    const testEndpoint = `${endpoint.replace(/\/$/, '')}/health`;
    
    const response = await fetch(testEndpoint, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': API_CONFIG.RAPIDAPI_HOST,
      },
    });
    
    return {
      success: response.ok,
      status: response.status,
      statusText: response.statusText,
      config: config
    };
  } catch (err: unknown) {
    const errorObj = err instanceof Error ? err : new Error(String(err));
    return {
      success: false,
      error: errorObj.message,
      config: debugApiConfig()
    };
  }
};