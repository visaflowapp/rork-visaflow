export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[]

export interface Database {
  public: {
    Tables: {
      users: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          name: string
          nationality: string
          email: string
          preferred_regions: string[]
          notifications: boolean
          travel_mode: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          name: string
          nationality: string
          email: string
          preferred_regions?: string[]
          notifications?: boolean
          travel_mode?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          name?: string
          nationality?: string
          email?: string
          preferred_regions?: string[]
          notifications?: boolean
          travel_mode?: boolean
        }
      }
      visas: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          country: string
          visa_type: string
          entry_date: string
          duration: number
          exit_date: string
          extensions_available: number
          is_active: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          country: string
          visa_type: string
          entry_date: string
          duration: number
          exit_date: string
          extensions_available?: number
          is_active?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          country?: string
          visa_type?: string
          entry_date?: string
          duration?: number
          exit_date?: string
          extensions_available?: number
          is_active?: boolean
        }
      }
      alerts: {
        Row: {
          id: string
          created_at: string
          updated_at: string
          user_id: string
          type: 'deadline' | 'policy' | 'embassy'
          title: string
          description: string
          icon: string
          is_read: boolean
        }
        Insert: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id: string
          type: 'deadline' | 'policy' | 'embassy'
          title: string
          description: string
          icon: string
          is_read?: boolean
        }
        Update: {
          id?: string
          created_at?: string
          updated_at?: string
          user_id?: string
          type?: 'deadline' | 'policy' | 'embassy'
          title?: string
          description?: string
          icon?: string
          is_read?: boolean
        }
      }
    }
    Views: {
      [_ in never]: never
    }
    Functions: {
      [_ in never]: never
    }
    Enums: {
      alert_type: 'deadline' | 'policy' | 'embassy'
    }
  }
}

// Type for visa with calculated days left
export type Visa = Database['public']['Tables']['visas']['Row'] & {
  daysLeft: number;
};