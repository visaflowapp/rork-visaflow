import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Stack } from 'expo-router';
import AlertCard from '@/components/AlertCard';
import Colors from '@/constants/colors';
import { useVisaStore } from '@/store/visaStore';

export default function AlertsScreen() {
  const { alerts, dismissAlert, markAlertAsRead, markAllAlertsAsRead, userId, loadUserData } = useVisaStore();
  
  useEffect(() => {
    if (userId) {
      loadUserData();
    }
  }, [userId, loadUserData]);
  
  const handleDismiss = (id: string) => {
    dismissAlert(id);
  };
  
  const handlePress = (id: string) => {
    markAlertAsRead(id);
  };

  const handleMarkAllAsRead = () => {
    markAllAlertsAsRead();
  };

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Notifications</Text>
      <Text style={styles.emptyText}>
        You're all caught up! We'll notify you when there are new visa alerts or policy changes.
      </Text>
    </View>
  );

  const hasUnreadAlerts = alerts.some(alert => !alert.is_read);

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Notifications',
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center',
          },
          headerTitleAlign: 'center',
          headerRight: () => (
            hasUnreadAlerts ? (
              <TouchableOpacity 
                style={styles.markAllButton}
                onPress={handleMarkAllAsRead}
              >
                <Text style={styles.markAllButtonText}>Mark all as read</Text>
              </TouchableOpacity>
            ) : null
          ),
        }} 
      />
      
      <FlatList
        data={alerts}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <AlertCard
            id={item.id}
            type={item.type}
            title={item.title}
            description={item.description}
            timestamp={item.timestamp}
            isRead={item.is_read}
            icon={item.icon}
            onDismiss={handleDismiss}
          />
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  listContainer: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  markAllButton: {
    backgroundColor: 'rgba(255, 255, 255, 0.9)',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    marginRight: 4,
  },
  markAllButtonText: {
    color: Colors.primary,
    fontSize: 13,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 24,
    backgroundColor: Colors.white,
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 20,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 14,
    color: Colors.silver,
    textAlign: 'center',
    lineHeight: 20,
  },
});