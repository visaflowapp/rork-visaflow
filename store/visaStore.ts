import { create } from 'zustand';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { persist, createJSONStorage } from 'zustand/middleware';
import { VisaState } from './types';
import { dummyVisas, dummyAlerts, dummyProfile } from '@/mocks/visaData';

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