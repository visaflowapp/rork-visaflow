import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity, Platform } from 'react-native';
import { Stack } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';
import { GlassView } from 'expo-glass-effect';
import AlertCard from '@/components/AlertCard';
import Colors from '@/constants/colors';
import { useVisaStore } from '@/store/visaStore';
import { CheckCircle } from 'lucide-react-native';

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

  const GlassWrapper = Platform.OS === 'ios' ? GlassView : View;
  const glassProps = Platform.OS === 'ios' ? { glassEffectStyle: 'clear' as const } : {};

  const renderEmptyState = () => (
    <GlassWrapper style={styles.emptyContainer} {...glassProps}>
      <Text style={styles.emptyTitle}>No Notifications</Text>
      <Text style={styles.emptyText}>
        You are all caught up! We will notify you when there are new visa alerts or policy changes.
      </Text>
    </GlassWrapper>
  );

  const hasUnreadAlerts = alerts.some(alert => !alert.is_read);

  return (
    <LinearGradient
      colors={[Colors.deepBlue, Colors.spaceDark, Colors.cosmicBlue]}
      style={styles.container}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
    >
      <Stack.Screen 
        options={{ 
          title: 'Notifications',
          headerStyle: { 
            backgroundColor: Colors.deepBlue,
          },
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
                <CheckCircle size={16} color="white" style={styles.markAllIcon} />
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
          <TouchableOpacity onPress={() => handlePress(item.id)}>
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
          </TouchableOpacity>
        )}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={renderEmptyState}
      />
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  listContainer: {
    paddingTop: 16,
    paddingBottom: 24,
  },
  markAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'rgba(255, 255, 255, 0.25)',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 16,
    marginRight: 8,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  markAllIcon: {
    marginRight: 4,
  },
  markAllButtonText: {
    color: 'white',
    fontSize: 13,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 24,
    backgroundColor: 'rgba(13, 27, 42, 0.8)',
    borderRadius: 24,
    marginHorizontal: 16,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.neonBlue,
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 20,
    elevation: 20,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 212, 255, 0.3)',
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.electricCyan,
    marginBottom: 8,
    letterSpacing: 0.5,
  },
  emptyText: {
    fontSize: 15,
    color: 'white',
    textAlign: 'center',
    lineHeight: 22,
    opacity: 0.9,
  },
});