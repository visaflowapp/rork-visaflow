import React from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronRight } from 'lucide-react-native';
import VisaCard from '@/components/VisaCard';
import { VisaRecord } from '@/store/types';


interface VisaCardSectionProps {
  visas: VisaRecord[];
  title: string;
  emptyMessage?: string;
}

const VisaCardSection: React.FC<VisaCardSectionProps> = ({ 
  visas, 
  title, 
  emptyMessage = "No visas found" 
}) => {
  const router = useRouter();

  if (visas.length === 0) {
    return null;
  }

  return (
    <View style={styles.container}>
      <View style={styles.headerContainer}>
        <Text style={styles.sectionTitle}>{title}</Text>
        <TouchableOpacity 
          style={styles.viewAllButton}
          onPress={() => router.push('/screens/AllVisasScreen')}
        >
          <Text style={styles.viewAllText}>View All</Text>
          <ChevronRight size={16} color="#007AFF" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={visas}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <VisaCard
            id={item.id}
            country={item.country}
            visaType={item.visa_type}
            entryDate={item.entry_date}
            duration={item.duration}
            exitDate={item.exit_date}
            extensionsAvailable={item.extensions_available}
            daysLeft={item.daysLeft}
          />
        )}
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.listContent}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 24,
  },
  headerContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
    paddingHorizontal: 16,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  viewAllButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  viewAllText: {
    fontSize: 14,
    color: '#007AFF',
    marginRight: 4,
  },
  listContent: {
    paddingLeft: 16,
    paddingRight: 8,
  },
  visaTypeBadge: {
    backgroundColor: '#007AFF',
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
});

export default VisaCardSection;