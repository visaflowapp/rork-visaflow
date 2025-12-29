import React from 'react';
import { Tabs } from 'expo-router';
import { Clock, Globe, Bell, User } from 'lucide-react-native';
import Colors from '@/constants/colors';

export default function TabLayout() {
  return (
    <Tabs
      screenOptions={{
        tabBarActiveTintColor: Colors.primary,
        tabBarInactiveTintColor: Colors.textTertiary,
        tabBarStyle: {
          backgroundColor: Colors.white,
          borderTopWidth: 1,
          borderTopColor: Colors.border,
          height: 50,
          paddingBottom: 4,
          paddingTop: 4,
        },
        tabBarLabelStyle: {
          fontSize: 11,
          fontWeight: '600',
        },
        headerStyle: {
          backgroundColor: Colors.white,
        },
        headerTintColor: Colors.text,
        headerTitleStyle: {
          fontWeight: '600',
        },
        headerShadowVisible: false,
        headerTitleAlign: 'center',
      }}
    >
      <Tabs.Screen
        name="index"
        options={{
          title: 'Tracker',
          tabBarLabel: 'Tracker',
          tabBarIcon: ({ color, size }) => (
            <Clock size={24} color={color} />
          ),
          headerTitle: 'Visa Tracker',
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