import React from 'react';
import { Tabs } from 'expo-router';
import { Clock, Globe, Bell, User } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.neonBlue,
        tabBarInactiveTintColor: 'rgba(255, 255, 255, 0.4)',
        tabBarStyle: {
          backgroundColor: Colors.deepBlue,
          borderTopWidth: 1,
          borderTopColor: 'rgba(0, 212, 255, 0.3)',
          height: 44,
          paddingBottom: 2,
          paddingTop: 2,
          shadowColor: Colors.neonBlue,
          shadowOffset: { width: 0, height: 0 },
          shadowOpacity: 0.5,
          shadowRadius: 15,
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
          backgroundColor: Colors.deepBlue,
          borderBottomWidth: 1,
          borderBottomColor: 'rgba(0, 212, 255, 0.3)',
        },
        headerTintColor: Colors.electricCyan,
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
          title: 'Countdown',
          tabBarLabel: 'Countdown',
          tabBarIcon: ({ color, size }) => (
            <Clock size={24} color={color} />
          ),
          headerTitle: 'Countdown',
        }}
      />
      <Tabs.Screen
        name="requirements"
        options={{
          title: 'Requirements',
          tabBarLabel: 'Requirements',
          tabBarIcon: ({ color, size }) => (
            <Globe size={24} color={color} />
          ),
          headerTitle: 'Requirements',
        }}
      />
      <Tabs.Screen
        name="alerts"
        options={{
          title: 'Notifications',
          tabBarLabel: 'Notifications',
          tabBarIcon: ({ color, size }) => (
            <Bell size={24} color={color} />
          ),
          headerTitle: 'Notifications',
        }}
      />
      <Tabs.Screen
        name="profile"
        options={{
          title: 'Settings',
          tabBarLabel: 'Settings',
          tabBarIcon: ({ color, size }) => (
            <User size={24} color={color} />
          ),
          headerTitle: 'Settings',
        }}
      />
    </Tabs>
  );
}