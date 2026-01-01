interface TravelBuddyConfig {
  apiKey: string;
  apiHost: string;
  timeout?: number;
}

interface VisaRequirement {
  visa_required: boolean;
  max_stay_days?: number;
  visa_on_arrival?: boolean;
  evisa_available?: boolean;
  requirements?: {
    name: string;
    description: string;
    url?: string | null;
  }[];
  special_visas?: {
    name: string;
    description: string;
    url?: string;
  }[];
}

export class TravelBuddyClient {
  private config: TravelBuddyConfig;

  constructor(config: TravelBuddyConfig) {
    if (!config.apiKey) {
      throw new Error('TravelBuddyAI API key is required');
    }
    if (!config.apiHost) {
      throw new Error('TravelBuddyAI API host is required');
    }

    this.config = {
      ...config,
      timeout: config.timeout || 30000,
    };

    console.log('[TravelBuddyClient] Initialized');
  }

  async getVisaRequirements(
    from: string,
    to: string,
    tripType: string,
    purpose: string
  ): Promise<VisaRequirement> {
    console.log(`[TravelBuddyClient] Fetching visa requirements: ${from} -> ${to}`);

    const url = `${this.config.apiHost}/visa-requirement`;

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': this.config.apiKey,
          'x-rapidapi-host': this.config.apiHost.replace('https://', '').replace('http://', ''),
        },
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[TravelBuddyClient] Error response:`, {
          status: response.status,
          statusText: response.statusText,
          body: errorText,
        });

        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }

        throw new Error(
          `TravelBuddyAI API error: ${response.status} ${response.statusText}`
        );
      }

      const data = await response.json();
      console.log(`[TravelBuddyClient] Success`);
      return data as VisaRequirement;
    } catch (error) {
      if (error instanceof Error) {
        if (error.name === 'AbortError') {
          throw new Error(`Request timeout after ${this.config.timeout}ms`);
        }
        throw error;
      }
      throw new Error('Unknown error occurred');
    }
  }
}

let cachedClient: TravelBuddyClient | null = null;

export function getTravelBuddyClient(): TravelBuddyClient {
  if (!cachedClient) {
    const apiKey = process.env.EXPO_PUBLIC_NOMAD_API_KEY;
    const apiHost = process.env.EXPO_PUBLIC_NOMAD_API_HOST;

    if (!apiKey || !apiHost) {
      throw new Error(
        'Missing TravelBuddyAI API configuration. Please set EXPO_PUBLIC_NOMAD_API_KEY and EXPO_PUBLIC_NOMAD_API_HOST environment variables.'
      );
    }

    cachedClient = new TravelBuddyClient({
      apiKey,
      apiHost,
    });
  }

  return cachedClient;
}
