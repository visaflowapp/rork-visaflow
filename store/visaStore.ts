import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';
import { VisaState } from './types';
import { dummyProfile } from '@/mocks/visaData';

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
          // Only load dummy data if no visas exist and no persisted data
          const visasToLoad = state.activeVisas.length === 0 ? [] : state.activeVisas;
          
          set({
            userProfile: state.userProfile || dummyProfile,
            activeVisas: visasToLoad.sort((a, b) => a.daysLeft - b.daysLeft),
            alerts: state.alerts.length === 0 ? [] : state.alerts,
            isLoading: false,
          });
        }, 300);
      },
      
      addVisa: (visa) => {
        console.log('VisaStore: Adding visa', visa);
        set({ isLoading: true });
        
        const newVisa = {
          id: Date.now().toString(),
          ...visa,
          is_active: true,
          daysLeft: Math.ceil((new Date(visa.exit_date).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24)),
        };
        
        console.log('VisaStore: Created new visa object', newVisa);
        
        setTimeout(() => {
          console.log('VisaStore: Saving visa to state');
          set(state => ({
            activeVisas: [...state.activeVisas, newVisa].sort((a, b) => a.daysLeft - b.daysLeft),
            isLoading: false,
          }));
          console.log('VisaStore: Visa saved successfully');
        }, 100); // Reduced from 500ms to 100ms
      },
      
      removeVisa: (visaId: string) => {
        set({ isLoading: true });
        
        setTimeout(() => {
          set(state => ({
            activeVisas: state.activeVisas.filter(visa => visa.id !== visaId),
            isLoading: false,
          }));
        }, 300);
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
      
      markAllAlertsAsRead: () => {
        set(state => ({
          alerts: state.alerts.map(alert => ({ ...alert, is_read: true })),
        }));
      },
      
      updateProfile: (profileUpdate) => {
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