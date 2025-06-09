import React from 'react';
import { Tabs } from 'expo-router';
import { Clock, Globe, Bell, Settings } from 'lucide-react-native';
import { colors } from '@/constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: colors.primary,
        tabBarInactiveTintColor: '#8E8E93',
        tabBarStyle: {
          backgroundColor: colors.white,
          borderTopWidth: 1,
          borderTopColor: colors.border,
          height: 44,
          paddingBottom: 2,
          paddingTop: 2,
          shadowColor: '#000',
          shadowOffset: { width: 0, height: -2 },
          shadowOpacity: 0.1,
          shadowRadius: 8,
          elevation: 10,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
          marginTop: 0,
        },
        tabBarIconStyle: {
          marginTop: 0,
        },
        headerStyle: {
          backgroundColor: colors.primary,
        },
        headerTintColor: colors.white,
        headerTitleStyle: {
          fontWeight: 'bold',
          textAlign: 'center',
        },
        headerTitleAlign: 'center',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: '',
          tabBarLabel: 'Countdown',
          tabBarIcon: ({ color, size }) => (
            <Clock size={24} color={color} />
          ),
          headerTitle: '',
        }}
      />
      <Tabs.Screen
        name="requirements"
        options={{
          title: '',
          tabBarLabel: 'Requirements',
          tabBarIcon: ({ color, size }) => (
            <Globe size={24} color={color} />
          ),
          headerTitle: '',
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: '',
          tabBarLabel: 'Notifications',
          tabBarIcon: ({ color, size }) => (
            <Bell size={24} color={color} />
          ),
          headerTitle: '',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: '',
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <Settings size={24} color={color} />
          ),
          headerTitle: '',
        }}
      />
    </Tabs>
  );
}