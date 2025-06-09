// API Configuration
// Add your visa requirements API credentials here

export const API_CONFIG = {
  // Replace with your actual API endpoint
  VISA_REQUIREMENTS_ENDPOINT: process.env.EXPO_PUBLIC_VISA_API_ENDPOINT || 'https://your-visa-api-endpoint.com/requirements',
  
  // Replace with your actual API key
  API_KEY: process.env.EXPO_PUBLIC_VISA_API_KEY || 'your-api-key-here',
  
  // Additional headers if needed
  HEADERS: {
    'Content-Type': 'application/json',
    // Add any other required headers
  }
};

// API request function
export const checkVisaRequirements = async (nationality: string, destination: string, purpose: string) => {
  try {
    const response = await fetch(API_CONFIG.VISA_REQUIREMENTS_ENDPOINT, {
      method: 'POST',
      headers: {
        ...API_CONFIG.HEADERS,
        'Authorization': `Bearer ${API_CONFIG.API_KEY}`,
        // or 'X-API-Key': API_CONFIG.API_KEY, depending on your API
      },
      body: JSON.stringify({
        nationality,
        destination,
        purpose,
        // Add any other required parameters
      }),
    });

    if (!response.ok) {
      throw new Error(`API request failed: ${response.status} ${response.statusText}`);
    }

    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Visa requirements API error:', error);
    throw error;
  }
};