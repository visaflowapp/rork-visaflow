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
  console.log('===============================');
  
  return {
    endpointSet: !!API_CONFIG.VISA_REQUIREMENTS_ENDPOINT,
    apiKeySet: !!API_CONFIG.API_KEY,
    apiKeyLength: API_CONFIG.API_KEY?.length || 0,
    ready: !!(API_CONFIG.VISA_REQUIREMENTS_ENDPOINT && API_CONFIG.API_KEY)
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
    
    // Construct the API endpoint - RapidAPI visa-requirement typically uses specific endpoints
    const endpoint = `${API_CONFIG.VISA_REQUIREMENTS_ENDPOINT.replace(/\/$/, '')}/visa-requirements`;
    
    console.log('Making API request to:', endpoint);
    console.log('Request payload:', { 
      from_country: nationality, 
      to_country: destination, 
      purpose: purpose.toLowerCase() 
    });
    
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        ...API_CONFIG.HEADERS,
        'X-RapidAPI-Key': API_CONFIG.API_KEY,
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
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('Visa requirements API error:', error);
    throw error;
  }
};

// Alternative API request function with different endpoint structure
export const checkVisaRequirementsAlternative = async (nationality: string, destination: string, purpose: string) => {
  try {
    // Try different endpoint structure that some RapidAPI services use
    const endpoint = `${API_CONFIG.VISA_REQUIREMENTS_ENDPOINT.replace(/\/$/, '')}/check`;
    
    console.log('Making alternative API request to:', endpoint);
    
    const response = await fetch(endpoint, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': API_CONFIG.API_KEY,
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
    const error = err instanceof Error ? err : new Error(String(err));
    console.error('Alternative visa requirements API error:', error);
    throw error;
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
    
    // Simple test request to verify API is accessible
    const testEndpoint = `${API_CONFIG.VISA_REQUIREMENTS_ENDPOINT.replace(/\/$/, '')}/health`;
    
    const response = await fetch(testEndpoint, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': API_CONFIG.API_KEY,
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
    const error = err instanceof Error ? err : new Error(String(err));
    return {
      success: false,
      error: error.message,
      config: debugApiConfig()
    };
  }
};