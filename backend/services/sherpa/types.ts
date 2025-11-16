export interface SherpaCountry {
  id: string;
  code: string;
  name: string;
  slug: string;
}

export interface SherpaCountryBasic {
  id: string;
  code: string;
  name: string;
  description: string | null;
  currency: {
    code: string;
    name: string;
  } | null;
  languages: {
    code: string;
    name: string;
  }[];
  region: string | null;
}

export interface SherpaDocument {
  type: string;
  category: string;
  description: string | null;
  required: boolean;
  notes: string | null;
}

export interface SherpaRestriction {
  type: string;
  description: string;
  severity: 'info' | 'warning' | 'critical';
}

export interface SherpaVisaRequirement {
  category: string;
  type: string;
  description: string;
  allowed_stay: {
    type: string;
    value: number | null;
    description: string | null;
  } | null;
  processing_time: {
    min_days: number | null;
    max_days: number | null;
    description: string | null;
  } | null;
  passport_requirements: {
    validity_months: number | null;
    blank_pages: number | null;
    notes: string[] | null;
  } | null;
  documents: SherpaDocument[];
  restrictions: SherpaRestriction[];
  notes: string[];
  apply_url: string | null;
  cost: {
    amount: number | null;
    currency: string | null;
    description: string | null;
  } | null;
}

export interface SherpaVisaResponse {
  citizenship: SherpaCountry;
  destination: SherpaCountry;
  requirements: SherpaVisaRequirement[];
  summary: string | null;
  last_updated: string;
  version: string;
}
