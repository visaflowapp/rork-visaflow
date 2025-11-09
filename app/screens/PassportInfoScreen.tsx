import React, { useState } from 'react';
import { View, Text, StyleSheet, TextInput, TouchableOpacity, Alert, Platform } from 'react-native';
import { Stack, useRouter } from 'expo-router';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Save, Calendar, ArrowLeft } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Button from '@/components/Button';
import AsyncStorage from '@react-native-async-storage/async-storage';

export default function PassportInfoScreen() {
  const router = useRouter();
  const [passportNumber, setPassportNumber] = useState('');
  const [expiryDate, setExpiryDate] = useState(new Date());
  const [showDatePicker, setShowDatePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Load passport data on component mount
  React.useEffect(() => {
    const loadPassportData = async () => {
      try {
        const storedPassportNumber = await AsyncStorage.getItem('passport_number');
        const storedExpiryDate = await AsyncStorage.getItem('passport_expiry');
        
        if (storedPassportNumber) {
          setPassportNumber(storedPassportNumber);
        }
        
        if (storedExpiryDate) {
          setExpiryDate(new Date(storedExpiryDate));
        }
      } catch (error) {
        console.error('Error loading passport data:', error);
      }
    };
    
    loadPassportData();
  }, []);

  const handleSave = async () => {
    if (!passportNumber.trim()) {
      Alert.alert('Error', 'Please enter your passport number');
      return;
    }
    
    setIsLoading(true);
    
    try {
      await AsyncStorage.setItem('passport_number', passportNumber);
      await AsyncStorage.setItem('passport_expiry', expiryDate.toISOString());
      
      Alert.alert(
        'Success',
        'Passport information saved successfully',
        [{ text: 'OK', onPress: () => router.back() }]
      );
    } catch (error) {
      console.error('Error saving passport data:', error);
      Alert.alert('Error', 'Failed to save passport information');
    } finally {
      setIsLoading(false);
    }
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setExpiryDate(selectedDate);
    }
  };

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'long',
      day: 'numeric',
      year: 'numeric'
    });
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Passport Information',
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
        <View style={styles.card}>
          <Text style={styles.title}>Passport Details</Text>
          <Text style={styles.subtitle}>
            Enter your passport information for quick reference when filling out visa applications
          </Text>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Passport Number</Text>
            <TextInput
              style={styles.input}
              value={passportNumber}
              onChangeText={setPassportNumber}
              placeholder="Enter passport number"
              secureTextEntry={true}
              autoCapitalize="characters"
            />
          </View>
          
          <View style={styles.formGroup}>
            <Text style={styles.label}>Expiration Date</Text>
            <TouchableOpacity
              style={styles.dateInput}
              onPress={() => setShowDatePicker(true)}
            >
              <Text style={styles.dateText}>{formatDate(expiryDate)}</Text>
              <Calendar size={20} color={Colors.primary} />
            </TouchableOpacity>
            
            {showDatePicker && (
              <View style={styles.calendarContainer}>
                <DateTimePicker
                  value={expiryDate}
                  mode="date"
                  display={Platform.OS === 'ios' ? 'inline' : 'default'}
                  onChange={onDateChange}
                  minimumDate={new Date()}
                  style={styles.calendar}
                />
                {Platform.OS === 'ios' && (
                  <TouchableOpacity 
                    style={styles.calendarDoneButton}
                    onPress={() => setShowDatePicker(false)}
                  >
                    <Text style={styles.calendarDoneText}>Done</Text>
                  </TouchableOpacity>
                )}
              </View>
            )}
          </View>
          
          <View style={styles.securityNote}>
            <Text style={styles.securityNoteText}>
              Your passport information is stored securely on your device and is not shared with any third parties.
            </Text>
          </View>
        </View>
      </View>
      
      <View style={styles.footer}>
        <Button
          title="Cancel"
          onPress={() => router.back()}
          variant="outline"
          style={styles.cancelButton}
        />
        <Button
          title="Save Information"
          onPress={handleSave}
          loading={isLoading}
          style={styles.saveButton}
          icon={() => <Save size={18} color={Colors.white} style={styles.saveIcon} />}
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
    padding: 16,
  },
  card: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 24,
    lineHeight: 22,
  },
  formGroup: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 8,
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.black,
    backgroundColor: Colors.white,
  },
  dateInput: {
    height: 56,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    backgroundColor: Colors.white,
  },
  dateText: {
    fontSize: 16,
    color: Colors.black,
  },
  calendarContainer: {
    marginTop: 8,
    backgroundColor: Colors.white,
    borderRadius: 12,
    overflow: 'hidden',
    ...(Platform.OS === 'ios' ? {
      shadowColor: '#000',
      shadowOffset: { width: 0, height: 4 },
      shadowOpacity: 0.2,
      shadowRadius: 8,
    } : {
      elevation: 4,
    }),
  },
  calendar: {
    backgroundColor: Colors.white,
    ...(Platform.OS === 'ios' ? { height: 320 } : {}),
  },
  calendarDoneButton: {
    alignItems: 'center',
    padding: 12,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  calendarDoneText: {
    color: Colors.primary,
    fontSize: 16,
    fontWeight: '600',
  },
  securityNote: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginTop: 16,
  },
  securityNoteText: {
    fontSize: 14,
    color: Colors.primary,
    lineHeight: 20,
  },
  footer: {
    flexDirection: 'row',
    padding: 16,
    paddingBottom: 32,
    backgroundColor: Colors.white,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
  },
  saveButton: {
    flex: 2,
    marginLeft: 8,
  },
  saveIcon: {
    marginRight: 8,
  },
});