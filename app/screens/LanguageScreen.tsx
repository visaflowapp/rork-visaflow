import React, { useState } from 'react';
import { View, Text, StyleSheet, FlatList, TouchableOpacity } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import { Check, ArrowLeft } from 'lucide-react-native';
import Colors from '@/constants/colors';
import AsyncStorage from '@react-native-async-storage/async-storage';

const languages = [
  'English',
  'Spanish',
  'German',
  'French',
  'Mandarin (Simplified Chinese)',
  'Portuguese',
  'Russian'
];

export default function LanguageScreen() {
  const router = useRouter();
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  // Load saved language on component mount
  React.useEffect(() => {
    const loadLanguage = async () => {
      try {
        const storedLanguage = await AsyncStorage.getItem('user_language');
        if (storedLanguage) {
          setSelectedLanguage(storedLanguage);
        }
      } catch (error) {
        console.error('Error loading language preference:', error);
      }
    };
    
    loadLanguage();
  }, []);

  const handleLanguageSelect = async (language: string) => {
    setSelectedLanguage(language);
    
    try {
      // Save selected language to storage
      await AsyncStorage.setItem('user_language', language);
      
      // In a real app, you would update the app's language context here
      
      // Go back to previous screen
      router.back();
    } catch (error) {
      console.error('Error saving language preference:', error);
    }
  };

  const renderLanguageItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.languageItem,
        selectedLanguage === item && styles.selectedLanguageItem
      ]}
      onPress={() => handleLanguageSelect(item)}
    >
      <Text style={[
        styles.languageText,
        selectedLanguage === item && styles.selectedLanguageText
      ]}>
        {item}
      </Text>
      
      {selectedLanguage === item && (
        <Check size={20} color={Colors.primary} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Language',
          headerStyle: { backgroundColor: Colors.primary },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
          },
          headerLeft: () => (
            <TouchableOpacity onPress={() => router.back()} style={styles.backButton}>
              <ArrowLeft size={24} color="white" />
            </TouchableOpacity>
          ),
        }} 
      />
      
      <View style={styles.content}>
        <FlatList
          data={languages}
          renderItem={renderLanguageItem}
          keyExtractor={(item) => item}
          contentContainerStyle={styles.listContainer}
        />
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.primary,
  },
  backButton: {
    marginLeft: 8,
    padding: 4,
  },
  content: {
    flex: 1,
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    marginTop: 16,
    overflow: 'hidden',
  },
  listContainer: {
    paddingVertical: 16,
  },
  languageItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  selectedLanguageItem: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  languageText: {
    fontSize: 16,
    color: Colors.black,
  },
  selectedLanguageText: {
    color: Colors.primary,
    fontWeight: '600',
  },
});