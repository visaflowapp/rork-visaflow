import { createClient } from '@supabase/supabase-js';

const supabaseUrl = process.env.SUPABASE_URL;
const supabaseServiceKey = process.env.SUPABASE_SERVICE_ROLE_KEY;

if (!supabaseUrl || !supabaseServiceKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseServiceKey, {
  auth: {
    autoRefreshToken: false,
    persistSession: false
  }
});

export type Database = {
  public: {
    Tables: {
      countries: {
        Row: {
          id: string;
          iso2: string;
          name: string;
          citizenship_label: string | null;
          region: string | null;
          aliases: string[] | null;
          last_synced_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          iso2: string;
          name: string;
          citizenship_label?: string | null;
          region?: string | null;
          aliases?: string[] | null;
          last_synced_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          iso2?: string;
          name?: string;
          citizenship_label?: string | null;
          region?: string | null;
          aliases?: string[] | null;
          last_synced_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      visa_rules: {
        Row: {
          id: string;
          citizenship_iso2: string;
          destination_iso2: string;
          visa_type: 'visa_free' | 'evisa' | 'visa_on_arrival' | 'embassy_required' | 'transit' | 'other';
          allowed_stay_days: number | null;
          stay_period_description: string | null;
          documents: any;
          processing_time_days: number | null;
          passport_validity_requirement_months: number | null;
          restrictions: string[];
          notes_structured: string[];
          raw_payload: any;
          source_version: string;
          payload_hash: string;
          fetched_at: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          citizenship_iso2: string;
          destination_iso2: string;
          visa_type: 'visa_free' | 'evisa' | 'visa_on_arrival' | 'embassy_required' | 'transit' | 'other';
          allowed_stay_days?: number | null;
          stay_period_description?: string | null;
          documents?: any;
          processing_time_days?: number | null;
          passport_validity_requirement_months?: number | null;
          restrictions?: string[];
          notes_structured?: string[];
          raw_payload?: any;
          source_version: string;
          payload_hash: string;
          fetched_at?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          citizenship_iso2?: string;
          destination_iso2?: string;
          visa_type?: 'visa_free' | 'evisa' | 'visa_on_arrival' | 'embassy_required' | 'transit' | 'other';
          allowed_stay_days?: number | null;
          stay_period_description?: string | null;
          documents?: any;
          processing_time_days?: number | null;
          passport_validity_requirement_months?: number | null;
          restrictions?: string[];
          notes_structured?: string[];
          raw_payload?: any;
          source_version?: string;
          payload_hash?: string;
          fetched_at?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      visa_rule_changes: {
        Row: {
          id: string;
          visa_rule_id: string;
          old_payload_hash: string;
          new_payload_hash: string;
          diff_summary: string;
          detected_at: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          visa_rule_id: string;
          old_payload_hash: string;
          new_payload_hash: string;
          diff_summary: string;
          detected_at?: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          visa_rule_id?: string;
          old_payload_hash?: string;
          new_payload_hash?: string;
          diff_summary?: string;
          detected_at?: string;
          created_at?: string;
        };
      };
      user_trips: {
        Row: {
          id: string;
          user_id: string;
          citizenship_iso2: string;
          destination_iso2: string;
          start_date: string;
          end_date: string;
          visa_rule_id: string | null;
          passport_expiry_date: string | null;
          status: 'ok' | 'action_required' | 'unknown';
          next_action_date: string | null;
          compliance_notes: string | null;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          citizenship_iso2: string;
          destination_iso2: string;
          start_date: string;
          end_date: string;
          visa_rule_id?: string | null;
          passport_expiry_date?: string | null;
          status?: 'ok' | 'action_required' | 'unknown';
          next_action_date?: string | null;
          compliance_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          citizenship_iso2?: string;
          destination_iso2?: string;
          start_date?: string;
          end_date?: string;
          visa_rule_id?: string | null;
          passport_expiry_date?: string | null;
          status?: 'ok' | 'action_required' | 'unknown';
          next_action_date?: string | null;
          compliance_notes?: string | null;
          created_at?: string;
          updated_at?: string;
        };
      };
    };
  };
};
