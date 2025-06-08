import React, { useEffect } from 'react';
import { View, Text, StyleSheet, FlatList } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import AlertCard from '@/components/AlertCard';
import Colors from '@/constants/colors';
import { useVisaStore } from '@/store/visaStore';

export default function AlertsScreen() {
  const { alerts, dismissAlert, markAlertAsRead, userId, loadUserData } = useVisaStore();
  
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

  const renderEmptyState = () => (
    <View style={styles.emptyContainer}>
      <Text style={styles.emptyTitle}>No Alerts</Text>
      <Text style={styles.emptyText}>
        You're all caught up! We'll notify you when there are new visa alerts or policy changes.
      </Text>
    </View>
  );

  return (
    <View style={styles.container}>
      <LinearGradient
        colors={[Colors.primary, '#0055B3']}
        style={styles.header}
      >
        <Text style={styles.headerTitle}>Alerts</Text>
        <Text style={styles.headerSubtitle}>
          Stay updated on visa changes and deadlines
        </Text>
      </LinearGradient>

      <View style={styles.content}>
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
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.lightGray,
  },
  header: {
    padding: 24,
    paddingTop: 40,
    paddingBottom: 40,
  },
  headerTitle: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.white,
    marginBottom: 8,
    fontFamily: 'Montserrat',
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
    fontFamily: 'Montserrat',
  },
  content: {
    flex: 1,
    marginTop: -20,
  },
  listContainer: {
    paddingTop: 8,
    paddingBottom: 24,
  },
  emptyContainer: {
    padding: 24,
    backgroundColor: Colors.white,
    borderRadius: 20,
    marginHorizontal: 16,
    marginTop: 16,
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 8 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 8,
  },
  emptyTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 8,
    fontFamily: 'Montserrat',
  },
  emptyText: {
    fontSize: 14,
    color: Colors.silver,
    textAlign: 'center',
    lineHeight: 20,
    fontFamily: 'Montserrat',
  },
});