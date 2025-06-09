import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';

interface VisaRecord {
  id: string;
  country: string;
  visa_type: string;
  entry_date: string;
  duration: number;
  exit_date: string;
  extensions_available: number;
  daysLeft: number;
  is_active: boolean;
}

interface Alert {
  id: string;
  type: 'deadline' | 'policy' | 'embassy';
  title: string;
  description: string;
  timestamp: string;
  is_read: boolean;
  icon: string;
}

interface UserProfile {
  id: string;
  name: string;
  nationality: string;
  preferred_regions: string[];
  notifications: boolean;
  travel_mode: boolean;
  email: string;
}

interface VisaState {
  // Local state
  userId: string | null;
  activeVisas: VisaRecord[];
  alerts: Alert[];
  userProfile: UserProfile | null;
  isLoading: boolean;
  
  // Actions
  setUserId: (userId: string) => void;
  loadUserData: () => void;
  addVisa: (visa: Omit<VisaRecord, 'id' | 'daysLeft' | 'is_active'>) => void;
  removeVisa: (id: string) => void;
  dismissAlert: (id: string) => void;
  markAlertAsRead: (id: string) => void;
  updateProfile: (profile: Partial<UserProfile>) => void;
  toggleNotifications: (enabled: boolean) => void;
  toggleTravelMode: (enabled: boolean) => void;
}

// Updated dummy data with Indonesia B211A Visa
const dummyVisas: VisaRecord[] = [
  {
    id: '1',
    country: 'Indonesia',
    visa_type: 'B211A Visa (Single-Entry Tourist/Business Visa)',
    entry_date: '2025-03-13',
    duration: 60,
    exit_date: '2025-05-12',
    extensions_available: 2,
    is_active: true,
    daysLeft: 34,
  }
];

const dummyAlerts: Alert[] = [
  {
    id: '1',
    type: 'deadline',
    title: 'Visa Expiring Soon',
    description: 'Your Indonesia B211A Visa expires in 34 days',
    timestamp: new Date().toISOString(),
    is_read: false,
    icon: 'clock',
  }
];

const dummyProfile: UserProfile = {
  id: 'demo-user',
  name: 'Alex Johnson',
  nationality: 'United States',
  email: 'alex@example.com',
  preferred_regions: ['Europe', 'Asia'],
  notifications: true,
  travel_mode: false,
};

export const useVisaStore = create<VisaState>()(
  persist(
    (set, get) => ({
      // Initial state
      userId: null,
      activeVisas: [],
      alerts: [],
      userProfile: null,
      isLoading: false,
      
      setUserId: (userId: string) => {
        set({ userId });
        get().loadUserData();
      },
      
      loadUserData: () => {
        set({ isLoading: true });
        
        // Simulate loading delay
        setTimeout(() => {
          const state = get();
          // Only load dummy data if no visas exist
          const visasToLoad = state.activeVisas.length === 0 ? dummyVisas : state.activeVisas;
          
          set({
            userProfile: dummyProfile,
            activeVisas: visasToLoad.sort((a, b) => a.daysLeft - b.daysLeft),
            alerts: dummyAlerts,
            isLoading: false,
          });
        }, 500);
      },
      
      addVisa: (visa) => {
        // Only allow one visa at a time - replace existing visa
        const newVisa = {
          id: Date.now().toString(),
          ...visa,
          is_active: true,
          daysLeft: Math.ceil((new Date(visa.exit_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
        };
        
        set({
          activeVisas: [newVisa], // Replace with single visa
        });
      },
      
      removeVisa: (visaId: string) => {
        set(state => ({
          activeVisas: state.activeVisas.filter(visa => visa.id !== visaId),
        }));
      },
      
      dismissAlert: (alertId: string) => {
        set(state => ({
          alerts: state.alerts.filter(alert => alert.id !== alertId),
        }));
      },
      
      markAlertAsRead: (alertId: string) => {
        set(state => ({
          alerts: state.alerts.map(alert => 
            alert.id === alertId ? { ...alert, is_read: true } : alert
          ),
        }));
      },
      
      updateProfile: (profileUpdate: Partial<UserProfile>) => {
        set(state => ({ 
          userProfile: state.userProfile ? { 
            ...state.userProfile, 
            ...profileUpdate 
          } : null
        }));
      },
      
      toggleNotifications: (enabled: boolean) => {
        get().updateProfile({ notifications: enabled });
      },
      
      toggleTravelMode: (enabled: boolean) => {
        get().updateProfile({ travel_mode: enabled });
      },
    }),
    {
      name: 'visa-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        userId: state.userId,
        userProfile: state.userProfile,
        activeVisas: state.activeVisas,
        alerts: state.alerts,
      }),
    }
  )
);