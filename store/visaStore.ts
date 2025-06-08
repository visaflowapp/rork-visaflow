import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';
import { trpcClient } from '@/lib/trpc';

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
  isBackendAvailable: boolean;
  
  // Actions
  setUserId: (userId: string) => void;
  loadUserData: () => Promise<void>;
  addVisa: (visa: Omit<VisaRecord, 'id' | 'daysLeft' | 'is_active'>) => Promise<void>;
  removeVisa: (id: string) => Promise<void>;
  dismissAlert: (id: string) => Promise<void>;
  markAlertAsRead: (id: string) => Promise<void>;
  updateProfile: (profile: Partial<UserProfile>) => Promise<void>;
  toggleNotifications: (enabled: boolean) => Promise<void>;
  toggleTravelMode: (enabled: boolean) => Promise<void>;
}

export const useVisaStore = create<VisaState>()(
  persist(
    (set, get) => ({
      // Initial state
      userId: null,
      activeVisas: [],
      alerts: [],
      userProfile: null,
      isLoading: false,
      isBackendAvailable: true,
      
      setUserId: (userId: string) => {
        set({ userId });
        get().loadUserData();
      },
      
      loadUserData: async () => {
        const { userId } = get();
        if (!userId) return;
        
        set({ isLoading: true });
        
        try {
          // Try to load profile
          const profile = await trpcClient.profile.get.query({ userId });
          
          // Try to load visas
          const visas = await trpcClient.visas.list.query({ userId });
          
          // Try to load alerts
          const alerts = await trpcClient.alerts.list.query({ userId });
          
          set({
            userProfile: profile,
            activeVisas: visas,
            alerts,
            isLoading: false,
            isBackendAvailable: true,
          });
        } catch (error) {
          console.log('Backend not available, using demo data:', error);
          
          // Set demo data when backend is not available
          const demoVisas: VisaRecord[] = [
            {
              id: '1',
              country: 'Portugal',
              visa_type: 'Digital Nomad Visa',
              entry_date: '2024-03-14',
              duration: 180,
              exit_date: '2024-09-10',
              extensions_available: 1,
              is_active: true,
              daysLeft: 96,
            },
            {
              id: '2',
              country: 'Thailand',
              visa_type: 'Tourist Visa',
              entry_date: '2024-02-01',
              duration: 60,
              exit_date: '2024-04-01',
              extensions_available: 0,
              is_active: true,
              daysLeft: 15,
            }
          ];

          const demoAlerts: Alert[] = [
            {
              id: '1',
              type: 'deadline',
              title: 'Visa Expiring Soon',
              description: 'Your Portugal Digital Nomad Visa expires in 96 days',
              timestamp: new Date().toISOString(),
              is_read: false,
              icon: 'clock',
            },
            {
              id: '2',
              type: 'deadline',
              title: 'Urgent: Thailand Visa',
              description: 'Your Thailand Tourist Visa expires in 15 days',
              timestamp: new Date().toISOString(),
              is_read: false,
              icon: 'alert-triangle',
            }
          ];
          
          set({
            userProfile: {
              id: userId,
              name: 'Demo User',
              nationality: 'United States',
              email: 'demo@example.com',
              preferred_regions: ['Europe', 'Asia'],
              notifications: true,
              travel_mode: false,
            },
            activeVisas: demoVisas,
            alerts: demoAlerts,
            isLoading: false,
            isBackendAvailable: false,
          });
        }
      },
      
      addVisa: async (visa) => {
        const { userId, isBackendAvailable } = get();
        if (!userId) return;
        
        if (isBackendAvailable) {
          try {
            await trpcClient.visas.create.mutate({
              userId,
              ...visa,
            });
            
            // Reload visas
            const visas = await trpcClient.visas.list.query({ userId });
            set({ activeVisas: visas });
            return;
          } catch (error) {
            console.error('Failed to add visa:', error);
            set({ isBackendAvailable: false });
          }
        }
        
        // Add to local state as fallback
        const newVisa = {
          id: Date.now().toString(),
          ...visa,
          is_active: true,
          daysLeft: Math.ceil((new Date(visa.exit_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
        };
        
        set(state => ({
          activeVisas: [...state.activeVisas, newVisa].sort((a, b) => a.daysLeft - b.daysLeft),
        }));
      },
      
      removeVisa: async (visaId: string) => {
        const { userId, isBackendAvailable } = get();
        if (!userId) return;
        
        if (isBackendAvailable) {
          try {
            await trpcClient.visas.delete.mutate({
              userId,
              visaId,
            });
          } catch (error) {
            console.error('Failed to remove visa:', error);
            set({ isBackendAvailable: false });
          }
        }
        
        // Remove from local state regardless
        set(state => ({
          activeVisas: state.activeVisas.filter(visa => visa.id !== visaId),
        }));
      },
      
      dismissAlert: async (alertId: string) => {
        const { userId, isBackendAvailable } = get();
        if (!userId) return;
        
        if (isBackendAvailable) {
          try {
            await trpcClient.alerts.dismiss.mutate({
              userId,
              alertId,
            });
          } catch (error) {
            console.error('Failed to dismiss alert:', error);
            set({ isBackendAvailable: false });
          }
        }
        
        // Remove from local state regardless
        set(state => ({
          alerts: state.alerts.filter(alert => alert.id !== alertId),
        }));
      },
      
      markAlertAsRead: async (alertId: string) => {
        const { userId, isBackendAvailable } = get();
        if (!userId) return;
        
        if (isBackendAvailable) {
          try {
            await trpcClient.alerts.markRead.mutate({
              userId,
              alertId,
            });
          } catch (error) {
            console.error('Failed to mark alert as read:', error);
            set({ isBackendAvailable: false });
          }
        }
        
        // Update local state regardless
        set(state => ({
          alerts: state.alerts.map(alert => 
            alert.id === alertId ? { ...alert, is_read: true } : alert
          ),
        }));
      },
      
      updateProfile: async (profileUpdate: Partial<UserProfile>) => {
        const { userId, userProfile, isBackendAvailable } = get();
        if (!userId || !userProfile) return;
        
        if (isBackendAvailable) {
          try {
            const updatedProfile = await trpcClient.profile.update.mutate({
              userId,
              ...profileUpdate,
            });
            
            set({ userProfile: updatedProfile });
            return;
          } catch (error) {
            console.error('Failed to update profile:', error);
            set({ isBackendAvailable: false });
          }
        }
        
        // Update local state as fallback
        set({ 
          userProfile: { 
            ...userProfile, 
            ...profileUpdate 
          } 
        });
      },
      
      toggleNotifications: async (enabled: boolean) => {
        await get().updateProfile({ notifications: enabled });
      },
      
      toggleTravelMode: async (enabled: boolean) => {
        await get().updateProfile({ travel_mode: enabled });
      },
    }),
    {
      name: 'visa-storage',
      storage: createJSONStorage(() => AsyncStorage),
      partialize: (state) => ({ 
        userId: state.userId,
        userProfile: state.userProfile,
        // Don't persist server data, only user session and profile
      }),
    }
  )
);