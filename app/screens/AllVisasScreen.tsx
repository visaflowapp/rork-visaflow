import React from 'react';
import { View, Text, StyleSheet, ScrollView, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { ArrowLeft } from 'lucide-react-native';
import { useVisaStore } from '@/store/visaStore';
import VisaCard from '@/components/VisaCard';

export default function AllVisasScreen() {
  const router = useRouter();
  const { activeVisas, removeVisa } = useVisaStore();

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'All Visas',
          headerStyle: { backgroundColor: '#0000EE' },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 17,
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color="white" />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {activeVisas.length === 0 ? (
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>No visas found</Text>
          </View>
        ) : (
          <View style={styles.visaList}>
            {activeVisas.map((visa) => (
              <View key={visa.id} style={styles.visaCardWrapper}>
                <VisaCard
                  id={visa.id}
                  country={visa.country}
                  visaType={visa.visa_type}
                  entryDate={visa.entry_date}
                  duration={visa.duration}
                  exitDate={visa.exit_date}
                  extensionsAvailable={visa.extensions_available}
                  daysLeft={visa.daysLeft}
                  onRemove={removeVisa}
                />
              </View>
            ))}
          </View>
        )}
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#0000EE',
  },
  backButton: {
    marginLeft: 8,
    padding: 4,
  },
  content: {
    flex: 1,
    padding: 16,
  },
  emptyState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 60,
  },
  emptyStateText: {
    fontSize: 16,
    color: 'white',
  },
  visaList: {
    paddingBottom: 24,
  },
  visaCardWrapper: {
    marginBottom: 16,
    alignItems: 'center',
  },
});
