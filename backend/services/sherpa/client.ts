import crypto from 'crypto';
import type { 
  SherpaCountry, 
  SherpaCountryBasic, 
  SherpaVisaResponse 
} from './types';

interface SherpaClientConfig {
  baseUrl: string;
  apiKey: string;
  timeout?: number;
}

interface RequestOptions {
  method?: 'GET' | 'POST' | 'PUT' | 'DELETE';
  headers?: Record<string, string>;
  body?: unknown;
}

export class SherpaClient {
  private config: SherpaClientConfig;
  private requestCount: number = 0;
  private lastRequestTime: number = 0;
  private readonly minRequestInterval: number = 100;

  constructor(config: SherpaClientConfig) {
    if (!config.baseUrl) {
      throw new Error('Sherpa API base URL is required');
    }
    if (!config.apiKey) {
      throw new Error('Sherpa API key is required');
    }
    
    this.config = {
      ...config,
      timeout: config.timeout || 30000,
    };
    
    console.log('[SherpaClient] Initialized with baseUrl:', config.baseUrl);
  }

  private async rateLimitedRequest<T>(
    endpoint: string,
    options: RequestOptions = {}
  ): Promise<T> {
    const now = Date.now();
    const timeSinceLastRequest = now - this.lastRequestTime;
    
    if (timeSinceLastRequest < this.minRequestInterval) {
      await new Promise(resolve => 
        setTimeout(resolve, this.minRequestInterval - timeSinceLastRequest)
      );
    }

    this.lastRequestTime = Date.now();
    this.requestCount++;

    const url = `${this.config.baseUrl}${endpoint}`;
    const headers = {
      'Content-Type': 'application/json',
      'X-Api-Key': this.config.apiKey,
      ...options.headers,
    };

    console.log(`[SherpaClient] Request #${this.requestCount}: ${options.method || 'GET'} ${url}`);

    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), this.config.timeout);

      const response = await fetch(url, {
        method: options.method || 'GET',
        headers,
        body: options.body ? JSON.stringify(options.body) : undefined,
        signal: controller.signal,
      });

      clearTimeout(timeoutId);

      if (!response.ok) {
        const errorText = await response.text();
        console.error(`[SherpaClient] Error response:`, {
          status: response.status,
          statusText: response.statusText,
          body: errorText
        });
        
        if (response.status === 429) {
          throw new Error('Rate limit exceeded. Please try again later.');
        }
        
        throw new Error(
          `Sherpa API error: ${response.status} ${response.statusText}. ${errorText}`
        );
      }

      const data = await response.json();
      console.log(`[SherpaClient] Success: ${endpoint}`);
      return data as T;
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

  async listCountries(): Promise<SherpaCountry[]> {
    console.log('[SherpaClient] Fetching countries list...');
    const response = await this.rateLimitedRequest<{ data: SherpaCountry[] }>('/countries');
    return response.data || [];
  }

  async getCountryBasic(countryCode: string): Promise<SherpaCountryBasic> {
    console.log(`[SherpaClient] Fetching country details for: ${countryCode}`);
    const response = await this.rateLimitedRequest<{ data: SherpaCountryBasic }>(
      `/countries/${countryCode}`
    );
    return response.data;
  }

  async getVisaRequirements(
    citizenshipCode: string,
    destinationCode: string
  ): Promise<SherpaVisaResponse> {
    console.log(
      `[SherpaClient] Fetching visa requirements: ${citizenshipCode} -> ${destinationCode}`
    );
    
    const response = await this.rateLimitedRequest<{ data: SherpaVisaResponse }>(
      `/visa-requirements?citizenship=${citizenshipCode}&destination=${destinationCode}`
    );
    
    return response.data;
  }

  static generatePayloadHash(payload: unknown): string {
    const jsonString = JSON.stringify(payload);
    return crypto.createHash('sha256').update(jsonString).digest('hex');
  }

  getRequestStats() {
    return {
      totalRequests: this.requestCount,
      lastRequestTime: this.lastRequestTime,
    };
  }
}

let cachedClient: SherpaClient | null = null;

export function getSherpaClient(): SherpaClient {
  if (!cachedClient) {
    const baseUrl = process.env.SHERPA_API_BASE_URL;
    const apiKey = process.env.SHERPA_API_KEY;

    if (!baseUrl || !apiKey) {
      throw new Error(
        'Missing Sherpa API configuration. Please set SHERPA_API_BASE_URL and SHERPA_API_KEY environment variables.'
      );
    }

    cachedClient = new SherpaClient({
      baseUrl,
      apiKey,
    });
  }

  return cachedClient;
}
