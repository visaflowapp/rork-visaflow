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

// Multiple API endpoint attempts for RapidAPI visa requirements
const API_ENDPOINTS = [
  '', // Root endpoint
  'requirements',
  'visa',
  'api/requirements',
  'api/visa',
  'v1/requirements',
  'v1/visa'
];

// API request function with multiple endpoint attempts
export const checkVisaRequirements = async (nationality: string, destination: string, purpose: string) => {
  try {
    // Debug log to verify environment variables
    const config = debugApiConfig();
    
    if (!config.ready) {
      throw new Error('API configuration incomplete. Please check environment variables.');
    }
    
    // Use runtime environment variables if available
    const baseEndpoint = process.env.EXPO_PUBLIC_VISA_API_ENDPOINT || API_CONFIG.VISA_REQUIREMENTS_ENDPOINT;
    const apiKey = process.env.EXPO_PUBLIC_VISA_API_KEY || API_CONFIG.API_KEY;
    
    console.log('Starting API requests with base endpoint:', baseEndpoint);
    console.log('Using API key length:', apiKey.length);
    
    // Try different endpoint patterns
    for (const endpoint of API_ENDPOINTS) {
      try {
        const fullEndpoint = endpoint 
          ? `${baseEndpoint.replace(/\/$/, '')}/${endpoint}`
          : baseEndpoint.replace(/\/$/, '');
        
        console.log(`Trying endpoint: ${fullEndpoint}`);
        
        // Try GET request with query parameters first
        const queryParams = new URLSearchParams({
          from: nationality.toLowerCase(),
          to: destination.toLowerCase(),
          purpose: purpose.toLowerCase()
        });
        
        const getUrl = `${fullEndpoint}?${queryParams}`;
        console.log(`GET request to: ${getUrl}`);
        
        const getResponse = await fetch(getUrl, {
          method: 'GET',
          headers: {
            'X-RapidAPI-Key': apiKey,
            'X-RapidAPI-Host': API_CONFIG.RAPIDAPI_HOST,
          },
        });

        console.log(`GET Response status: ${getResponse.status}`);
        
        if (getResponse.ok) {
          const data = await getResponse.json();
          console.log('GET Success! Response data:', data);
          return data;
        }
        
        // If GET fails, try POST
        console.log(`GET failed, trying POST to: ${fullEndpoint}`);
        
        const postResponse = await fetch(fullEndpoint, {
          method: 'POST',
          headers: {
            ...API_CONFIG.HEADERS,
            'X-RapidAPI-Key': apiKey,
          },
          body: JSON.stringify({
            from_country: nationality,
            to_country: destination,
            purpose: purpose.toLowerCase(),
            passport_country: nationality,
            destination_country: destination,
            travel_purpose: purpose
          }),
        });

        console.log(`POST Response status: ${postResponse.status}`);
        
        if (postResponse.ok) {
          const data = await postResponse.json();
          console.log('POST Success! Response data:', data);
          return data;
        }
        
        // Log the error but continue to next endpoint
        const errorText = await postResponse.text();
        console.log(`Endpoint ${fullEndpoint} failed: ${postResponse.status} - ${errorText}`);
        
      } catch (endpointError: unknown) {
        const errorObj = endpointError instanceof Error ? endpointError : new Error(String(endpointError));
        console.log(`Endpoint ${endpoint} error:`, errorObj.message);
        // Continue to next endpoint
      }
    }
    
    // If all endpoints fail, throw a comprehensive error
    throw new Error(`All API endpoints failed. Tried: ${API_ENDPOINTS.map(ep => ep || 'root').join(', ')}`);
    
  } catch (err: unknown) {
    const errorObj = err instanceof Error ? err : new Error(String(err));
    console.error('Visa requirements API error:', errorObj);
    throw errorObj;
  }
};

// Alternative API request function with different approach
export const checkVisaRequirementsAlternative = async (nationality: string, destination: string, purpose: string) => {
  try {
    // Use runtime environment variables if available
    const endpoint = process.env.EXPO_PUBLIC_VISA_API_ENDPOINT || API_CONFIG.VISA_REQUIREMENTS_ENDPOINT;
    const apiKey = process.env.EXPO_PUBLIC_VISA_API_KEY || API_CONFIG.API_KEY;
    
    // Try the most common RapidAPI pattern with country codes
    const countryCodeMap: { [key: string]: string } = {
      'USA': 'US',
      'UK': 'GB', 
      'Thailand': 'TH',
      'Indonesia': 'ID',
      'Canada': 'CA',
      'Vietnam': 'VN',
      'Malaysia': 'MY',
      'Singapore': 'SG'
    };
    
    const fromCode = countryCodeMap[nationality] || nationality;
    const toCode = countryCodeMap[destination] || destination;
    
    // Try with country codes
    const queryParams = new URLSearchParams({
      passport: fromCode,
      destination: toCode,
      purpose: purpose.toLowerCase()
    });
    
    const fullEndpoint = `${endpoint.replace(/\/$/, '')}?${queryParams}`;
    
    console.log('Making alternative API request to:', fullEndpoint);
    
    const response = await fetch(fullEndpoint, {
      method: 'GET',
      headers: {
        'X-RapidAPI-Key': apiKey,
        'X-RapidAPI-Host': API_CONFIG.RAPIDAPI_HOST,
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

// Mock data for testing when API is not available
export const getMockVisaRequirements = (nationality: string, destination: string, purpose: string) => {
  return {
    passport_of: nationality,
    passport_code: nationality === 'USA' ? 'US' : nationality.substring(0, 2).toUpperCase(),
    destination: destination,
    visa: purpose === 'Tourism' ? 'Visa required' : 'eVisa available',
    stay_of: '30 days',
    color: 'yellow',
    pass_valid: '6 months',
    link: `https://embassy.${destination.toLowerCase()}.com/visa-info`,
    except_text: 'Transit passengers may be exempt for stays under 24 hours',
    mock: true,
    note: 'This is mock data for testing purposes'
  };
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
    const testEndpoint = endpoint.replace(/\/$/, '');
    
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