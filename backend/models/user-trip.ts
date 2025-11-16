import { supabase } from '../db/supabase';

export type TripStatus = 'ok' | 'action_required' | 'unknown';

export interface UserTrip {
  id: string;
  user_id: string;
  citizenship_iso2: string;
  destination_iso2: string;
  start_date: string;
  end_date: string;
  visa_rule_id: string | null;
  passport_expiry_date: string | null;
  status: TripStatus;
  next_action_date: string | null;
  compliance_notes: string | null;
  created_at: string;
  updated_at: string;
}

export interface UserTripInsert {
  user_id: string;
  citizenship_iso2: string;
  destination_iso2: string;
  start_date: string;
  end_date: string;
  visa_rule_id?: string | null;
  passport_expiry_date?: string | null;
  status?: TripStatus;
  next_action_date?: string | null;
  compliance_notes?: string | null;
}

export interface UserTripUpdate {
  visa_rule_id?: string | null;
  passport_expiry_date?: string | null;
  status?: TripStatus;
  next_action_date?: string | null;
  compliance_notes?: string | null;
}

export class UserTripModel {
  static async create(trip: UserTripInsert): Promise<UserTrip> {
    console.log(`[UserTripModel] Creating trip for user: ${trip.user_id}`);
    
    const { data, error } = await supabase
      .from('user_trips')
      .insert({
        ...trip,
        citizenship_iso2: trip.citizenship_iso2.toUpperCase(),
        destination_iso2: trip.destination_iso2.toUpperCase(),
        status: trip.status || 'unknown',
      })
      .select()
      .single();

    if (error) {
      console.error('[UserTripModel] Error creating trip:', error);
      throw new Error(`Failed to create trip: ${error.message}`);
    }

    console.log(`[UserTripModel] Successfully created trip: ${data.id}`);
    return data as UserTrip;
  }

  static async update(id: string, updates: UserTripUpdate): Promise<UserTrip> {
    console.log(`[UserTripModel] Updating trip: ${id}`);
    
    const { data, error } = await supabase
      .from('user_trips')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) {
      console.error('[UserTripModel] Error updating trip:', error);
      throw new Error(`Failed to update trip: ${error.message}`);
    }

    return data as UserTrip;
  }

  static async findById(id: string): Promise<UserTrip | null> {
    console.log(`[UserTripModel] Fetching trip: ${id}`);
    
    const { data, error } = await supabase
      .from('user_trips')
      .select('*')
      .eq('id', id)
      .single();

    if (error) {
      if (error.code === 'PGRST116') {
        return null;
      }
      console.error('[UserTripModel] Error fetching trip:', error);
      throw new Error(`Failed to fetch trip: ${error.message}`);
    }

    return data as UserTrip;
  }

  static async findByUserId(userId: string): Promise<UserTrip[]> {
    console.log(`[UserTripModel] Fetching trips for user: ${userId}`);
    
    const { data, error } = await supabase
      .from('user_trips')
      .select('*')
      .eq('user_id', userId)
      .order('start_date', { ascending: false });

    if (error) {
      console.error('[UserTripModel] Error fetching user trips:', error);
      throw new Error(`Failed to fetch user trips: ${error.message}`);
    }

    return (data as UserTrip[]) || [];
  }

  static async findUpcoming(userId: string): Promise<UserTrip[]> {
    console.log(`[UserTripModel] Fetching upcoming trips for user: ${userId}`);
    
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('user_trips')
      .select('*')
      .eq('user_id', userId)
      .gte('start_date', today)
      .order('start_date');

    if (error) {
      console.error('[UserTripModel] Error fetching upcoming trips:', error);
      throw new Error(`Failed to fetch upcoming trips: ${error.message}`);
    }

    return (data as UserTrip[]) || [];
  }

  static async findNeedingAction(): Promise<UserTrip[]> {
    console.log('[UserTripModel] Fetching trips needing action...');
    
    const today = new Date().toISOString().split('T')[0];
    
    const { data, error } = await supabase
      .from('user_trips')
      .select('*')
      .eq('status', 'action_required')
      .lte('next_action_date', today)
      .order('next_action_date');

    if (error) {
      console.error('[UserTripModel] Error fetching trips needing action:', error);
      throw new Error(`Failed to fetch trips needing action: ${error.message}`);
    }

    return (data as UserTrip[]) || [];
  }

  static async delete(id: string): Promise<void> {
    console.log(`[UserTripModel] Deleting trip: ${id}`);
    
    const { error } = await supabase
      .from('user_trips')
      .delete()
      .eq('id', id);

    if (error) {
      console.error('[UserTripModel] Error deleting trip:', error);
      throw new Error(`Failed to delete trip: ${error.message}`);
    }

    console.log(`[UserTripModel] Successfully deleted trip: ${id}`);
  }
}
