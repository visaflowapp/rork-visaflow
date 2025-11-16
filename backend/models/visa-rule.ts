import { supabase } from '../db/supabase';

export type VisaType = 
  | 'visa_free' 
  | 'evisa' 
  | 'visa_on_arrival' 
  | 'embassy_required' 
  | 'transit' 
  | 'other';

export interface VisaDocument {
  name: string;
  required: boolean;
  note: string | null;
}

export interface VisaRule {
  id: string;
  citizenship_iso2: string;
  destination_iso2: string;
  visa_type: VisaType;
  allowed_stay_days: number | null;
  stay_period_description: string | null;
  documents: VisaDocument[];
  processing_time_days: number | null;
  passport_validity_requirement_months: number | null;
  restrictions: string[];
  notes_structured: string[];
  raw_payload: unknown;
  source_version: string;
  payload_hash: string;
  fetched_at: string;
  created_at: string;
  updated_at: string;
}

export interface VisaRuleInsert {
  citizenship_iso2: string;
  destination_iso2: string;
  visa_type: VisaType;
  allowed_stay_days?: number | null;
  stay_period_description?: string | null;
  documents?: VisaDocument[];
  processing_time_days?: number | null;
  passport_validity_requirement_months?: number | null;
  restrictions?: string[];
  notes_structured?: string[];
  raw_payload: unknown;
  source_version: string;
  payload_hash: string;
}

export class VisaRuleModel {
  static async findByPair(
    citizenshipIso2: string,
    destinationIso2: string
  ): Promise<VisaRule | null> {
    console.log(
      `[VisaRuleModel] Fetching visa rule: ${citizenshipIso2} -> ${destinationIso2}`
    );
    
    const { data, error } = await supabase
      .from('visa_rules')
      .select('*')
      .eq('citizenship_iso2', citizenshipIso2.toUpperCase())
      .eq('destination_iso2', destinationIso2.toUpperCase())
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('[VisaRuleModel] Error fetching visa rule:', error);
      throw new Error(`Failed to fetch visa rule: ${error.message}`);
    }

    return data as VisaRule;
  }

  static async upsert(rule: VisaRuleInsert): Promise<VisaRule> {
    console.log(
      `[VisaRuleModel] Upserting visa rule: ${rule.citizenship_iso2} -> ${rule.destination_iso2}`
    );
    
    const { data, error } = await supabase
      .from('visa_rules')
      .upsert({
        ...rule,
        citizenship_iso2: rule.citizenship_iso2.toUpperCase(),
        destination_iso2: rule.destination_iso2.toUpperCase(),
        documents: rule.documents || [],
        restrictions: rule.restrictions || [],
        notes_structured: rule.notes_structured || [],
        fetched_at: new Date().toISOString(),
      }, {
        onConflict: 'citizenship_iso2,destination_iso2',
      })
      .select()
      .single();

    if (error) {
      console.error('[VisaRuleModel] Error upserting visa rule:', error);
      throw new Error(`Failed to upsert visa rule: ${error.message}`);
    }

    console.log(
      `[VisaRuleModel] Successfully upserted visa rule: ${rule.citizenship_iso2} -> ${rule.destination_iso2}`
    );
    return data as VisaRule;
  }

  static async findByCitizenship(citizenshipIso2: string): Promise<VisaRule[]> {
    console.log(`[VisaRuleModel] Fetching rules for citizenship: ${citizenshipIso2}`);
    
    const { data, error } = await supabase
      .from('visa_rules')
      .select('*')
      .eq('citizenship_iso2', citizenshipIso2.toUpperCase())
      .order('destination_iso2');

    if (error) {
      console.error('[VisaRuleModel] Error fetching visa rules:', error);
      throw new Error(`Failed to fetch visa rules: ${error.message}`);
    }

    return (data as VisaRule[]) || [];
  }

  static async findByDestination(destinationIso2: string): Promise<VisaRule[]> {
    console.log(`[VisaRuleModel] Fetching rules for destination: ${destinationIso2}`);
    
    const { data, error } = await supabase
      .from('visa_rules')
      .select('*')
      .eq('destination_iso2', destinationIso2.toUpperCase())
      .order('citizenship_iso2');

    if (error) {
      console.error('[VisaRuleModel] Error fetching visa rules:', error);
      throw new Error(`Failed to fetch visa rules: ${error.message}`);
    }

    return (data as VisaRule[]) || [];
  }

  static async findAll(limit?: number): Promise<VisaRule[]> {
    console.log('[VisaRuleModel] Fetching all visa rules...');
    
    let query = supabase
      .from('visa_rules')
      .select('*')
      .order('fetched_at', { ascending: false });

    if (limit) {
      query = query.limit(limit);
    }

    const { data, error } = await query;

    if (error) {
      console.error('[VisaRuleModel] Error fetching visa rules:', error);
      throw new Error(`Failed to fetch visa rules: ${error.message}`);
    }

    return (data as VisaRule[]) || [];
  }
}
