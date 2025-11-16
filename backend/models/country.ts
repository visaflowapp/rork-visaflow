import { supabase } from '../db/supabase';

export interface Country {
  id: string;
  iso2: string;
  name: string;
  citizenship_label: string | null;
  region: string | null;
  aliases: string[] | null;
  last_synced_at: string;
  created_at: string;
  updated_at: string;
}

export interface CountryInsert {
  iso2: string;
  name: string;
  citizenship_label?: string | null;
  region?: string | null;
  aliases?: string[] | null;
  last_synced_at?: string;
}

export class CountryModel {
  static async findAll(): Promise<Country[]> {
    console.log('[CountryModel] Fetching all countries...');
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .order('name');

    if (error) {
      console.error('[CountryModel] Error fetching countries:', error);
      throw new Error(`Failed to fetch countries: ${error.message}`);
    }

    console.log(`[CountryModel] Found ${data?.length || 0} countries`);
    return data || [];
  }

  static async findByIso2(iso2: string): Promise<Country | null> {
    console.log(`[CountryModel] Fetching country by ISO2: ${iso2}`);
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .eq('iso2', iso2.toUpperCase())
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error(`[CountryModel] Error fetching country ${iso2}:`, error);
      throw new Error(`Failed to fetch country: ${error.message}`);
    }

    return data;
  }

  static async upsert(country: CountryInsert): Promise<Country> {
    console.log(`[CountryModel] Upserting country: ${country.iso2}`);
    const { data, error } = await supabase
      .from('countries')
      .upsert({
        ...country,
        iso2: country.iso2.toUpperCase(),
        last_synced_at: new Date().toISOString(),
      }, {
        onConflict: 'iso2',
      })
      .select()
      .single();

    if (error) {
      console.error(`[CountryModel] Error upserting country ${country.iso2}:`, error);
      throw new Error(`Failed to upsert country: ${error.message}`);
    }

    console.log(`[CountryModel] Successfully upserted country: ${country.iso2}`);
    return data;
  }

  static async bulkUpsert(countries: CountryInsert[]): Promise<Country[]> {
    console.log(`[CountryModel] Bulk upserting ${countries.length} countries...`);
    
    const normalizedCountries = countries.map(c => ({
      ...c,
      iso2: c.iso2.toUpperCase(),
      last_synced_at: new Date().toISOString(),
    }));

    const { data, error } = await supabase
      .from('countries')
      .upsert(normalizedCountries, {
        onConflict: 'iso2',
      })
      .select();

    if (error) {
      console.error('[CountryModel] Error bulk upserting countries:', error);
      throw new Error(`Failed to bulk upsert countries: ${error.message}`);
    }

    console.log(`[CountryModel] Successfully upserted ${data?.length || 0} countries`);
    return data || [];
  }

  static async search(query: string): Promise<Country[]> {
    console.log(`[CountryModel] Searching countries: ${query}`);
    const { data, error } = await supabase
      .from('countries')
      .select('*')
      .or(`name.ilike.%${query}%,iso2.ilike.%${query}%`)
      .order('name')
      .limit(20);

    if (error) {
      console.error('[CountryModel] Error searching countries:', error);
      throw new Error(`Failed to search countries: ${error.message}`);
    }

    return data || [];
  }
}
