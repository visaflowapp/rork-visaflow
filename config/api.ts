// API Configuration
// The actual credentials are loaded from environment variables
// Edit the .env file to add your real API endpoint and key

export const API_CONFIG = {
  // Replace with your actual API endpoint in .env file
  VISA_REQUIREMENTS_ENDPOINT: process.env.EXPO_PUBLIC_VISA_API_ENDPOINT || 'https://your-visa-api-endpoint.com/requirements',
  
  // Replace with your actual API key in .env file
  API_KEY: process.env.EXPO_PUBLIC_VISA_API_KEY || 'your-api-key-here',
  
  // Additional headers if needed
  HEADERS: {
    'Content-Type': 'application/json',
    // Add any other required headers your API needs
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
        // Alternative header format if your API uses this instead:
        // 'X-API-Key': API_CONFIG.API_KEY,
        // 'X-RapidAPI-Key': API_CONFIG.API_KEY,
        // 'X-RapidAPI-Host': 'your-rapidapi-host.com',
      },
      body: JSON.stringify({
        nationality,
        destination,
        purpose,
        // Add any other required parameters your API needs
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