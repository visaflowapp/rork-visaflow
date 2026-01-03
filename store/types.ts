export interface VisaRecord {
  id: string;
  country: string;
  visa_type: string;
  entry_date: string;
  duration: number;
  exit_date: string;
  extensions_available: number;
  daysLeft: number;
  is_active: boolean;
  notes?: string;
}

export interface Alert {
  id: string;
  type: 'deadline' | 'policy' | 'embassy';
  title: string;
  description: string;
  timestamp: string;
  is_read: boolean;
  icon: string;
}

export interface UserProfile {
  id: string;
  name: string;
  nationality: string;
  preferred_regions: string[];
  notifications: boolean;
  travel_mode: boolean;
  email: string;
  travelStyle?: string;
  hasMultiplePassports?: boolean;
  secondNationality?: string;
  primaryResidency?: string;
  passportExpiry?: string;
  secondPassportExpiry?: string;
  typicalTripLength?: string;
  frequentSpecialDestinations?: string;
  preferredAlertTiming?: number;
  hasUpcomingTrips?: boolean;
}

export interface VisaState {
  // Local state
  userId: string | null;
  activeVisas: VisaRecord[];
  alerts: Alert[];
  userProfile: UserProfile | null;
  isLoading: boolean;
  hasCompletedOnboarding: boolean;
  
  // Actions
  setUserId: (userId: string) => void;
  loadUserData: () => void;
  addVisa: (visa: Omit<VisaRecord, 'id' | 'daysLeft' | 'is_active'>) => void;
  removeVisa: (id: string) => void;
  dismissAlert: (id: string) => void;
  markAlertAsRead: (id: string) => void;
  markAllAlertsAsRead: () => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  toggleNotifications: (enabled: boolean) => void;
  toggleTravelMode: (enabled: boolean) => void;
  completeOnboarding: () => void;
}