import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  Platform,
  Alert
} from 'react-native';
import { X } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Button from './Button';
import SimpleDropdown from './SimpleDropdown';

interface AddVisaModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (visaData: {
    country: string;
    visa_type: string;
    entry_date: string;
    exit_date: string;
    duration: number;
    extensions_available: number;
    notes?: string;
  }) => void;
}

const visaTypes = [
  'Tourist Visa',
  'Business Visa',
  'Digital Nomad Visa',
  'Work Visa',
  'Student Visa',
  'Transit Visa',
  'eVisa',
  'B211A Visa'
];

// Popular countries for digital nomads
const popularCountries = [
  'Thailand',
  'Indonesia', 
  'Vietnam',
  'Malaysia',
  'Singapore',
  'Philippines',
  'Cambodia',
  'Japan',
  'South Korea',
  'Taiwan',
  'Mexico',
  'Colombia',
  'Brazil',
  'Portugal',
  'Spain',
  'Italy',
  'Greece',
  'Croatia',
  'Georgia',
  'Turkey'
];

const AddVisaModal: React.FC<AddVisaModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [country, setCountry] = useState('');
  const [visaType, setVisaType] = useState('');
  const [entryDate, setEntryDate] = useState(new Date());
  const [exitDate, setExitDate] = useState(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000)); // 90 days from now
  const [extensionsAvailable, setExtensionsAvailable] = useState('0');
  const [notes, setNotes] = useState('');
  const [showEntryDatePicker, setShowEntryDatePicker] = useState(false);
  const [showExitDatePicker, setShowExitDatePicker] = useState(false);
  const [showCountryDropdown, setShowCountryDropdown] = useState(false);
  const [showVisaTypeDropdown, setShowVisaTypeDropdown] = useState(false);

  const calculateDuration = () => {
    const diffTime = Math.abs(exitDate.getTime() - entryDate.getTime());
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
    return diffDays;
  };

  const resetForm = () => {
    setCountry('');
    setVisaType('');
    setEntryDate(new Date());
    setExitDate(new Date(Date.now() + 90 * 24 * 60 * 60 * 1000));
    setExtensionsAvailable('0');
    setNotes('');
  };

  const handleSave = () => {
    if (!country || !visaType) {
      Alert.alert('Missing Information', 'Please select both country and visa type.');
      return;
    }

    onSave({
      country,
      visa_type: visaType,
      entry_date: entryDate.toISOString().split('T')[0],
      exit_date: exitDate.toISOString().split('T')[0],
      duration: calculateDuration(),
      extensions_available: parseInt(extensionsAvailable, 10) || 0,
      notes: notes.trim() || undefined,
    });

    resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const onEntryDateChange = (event: any, selectedDate?: Date) => {
    setShowEntryDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setEntryDate(selectedDate);
      
      // If exit date is before the new entry date, update it
      if (exitDate < selectedDate) {
        const newExitDate = new Date(selectedDate);
        newExitDate.setDate(newExitDate.getDate() + 90); // Default to 90 days
        setExitDate(newExitDate);
      }
    }
  };

  const onExitDateChange = (event: any, selectedDate?: Date) => {
    setShowExitDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      // Ensure exit date is not before entry date
      if (selectedDate > entryDate) {
        setExitDate(selectedDate);
      }
    }
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Add Visa</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={24} color="#000000" />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.formContainer} 
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.formGroup}>
              <Text style={styles.label}>Country *</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowCountryDropdown(true)}
              >
                <Text style={country ? styles.dropdownText : styles.placeholderText}>
                  {country || 'Select country'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Visa Type *</Text>
              <TouchableOpacity
                style={styles.dropdownButton}
                onPress={() => setShowVisaTypeDropdown(true)}
              >
                <Text style={visaType ? styles.dropdownText : styles.placeholderText}>
                  {visaType || 'Select visa type'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Entry Date</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowEntryDatePicker(true)}
              >
                <Text style={styles.dateText}>
                  {entryDate.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Exit Date</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowExitDatePicker(true)}
              >
                <Text style={styles.dateText}>
                  {exitDate.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Duration (Calculated)</Text>
              <View style={styles.calculatedField}>
                <Text style={styles.calculatedText}>
                  {calculateDuration()} days
                </Text>
              </View>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Extensions Available</Text>
              <TextInput
                style={styles.input}
                value={extensionsAvailable}
                onChangeText={setExtensionsAvailable}
                keyboardType="number-pad"
                placeholder="Number of extensions available"
                placeholderTextColor="#8E8E93"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Notes (Optional)</Text>
              <TextInput
                style={styles.textArea}
                value={notes}
                onChangeText={setNotes}
                placeholder="Add any additional notes about your visa"
                placeholderTextColor="#8E8E93"
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Button
              title="Cancel"
              onPress={handleClose}
              variant="outline"
              style={styles.footerButton}
            />
            <Button
              title="Save Visa"
              onPress={handleSave}
              style={styles.footerButton}
            />
          </View>

          {/* Date Pickers */}
          {showEntryDatePicker && (
            <DateTimePicker
              value={entryDate}
              mode="date"
              display="default"
              onChange={onEntryDateChange}
              minimumDate={new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)} // Allow dates up to 30 days in the past
            />
          )}

          {showExitDatePicker && (
            <DateTimePicker
              value={exitDate}
              mode="date"
              display="default"
              onChange={onExitDateChange}
              minimumDate={entryDate}
            />
          )}

          {/* Dropdowns */}
          {showCountryDropdown && (
            <SimpleDropdown
              label="Select Country"
              options={popularCountries}
              value={country}
              onSelect={(value) => {
                setCountry(value);
                setShowCountryDropdown(false);
              }}
              placeholder="Select country"
            />
          )}

          {showVisaTypeDropdown && (
            <SimpleDropdown
              label="Select Visa Type"
              options={visaTypes}
              value={visaType}
              onSelect={(value) => {
                setVisaType(value);
                setShowVisaTypeDropdown(false);
              }}
              placeholder="Select visa type"
            />
          )}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 30,
    maxHeight: '90%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
  },
  closeButton: {
    padding: 4,
  },
  formContainer: {
    marginBottom: 16,
    flex: 1,
  },
  formGroup: {
    marginBottom: 16,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: '#000000',
    fontWeight: '600',
  },
  input: {
    height: 56,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#FFFFFF',
  },
  textArea: {
    height: 100,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#FFFFFF',
  },
  dateInput: {
    height: 56,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  dateText: {
    fontSize: 16,
    color: '#000000',
  },
  calculatedField: {
    height: 56,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: '#F2F2F7',
    justifyContent: 'center',
  },
  calculatedText: {
    fontSize: 16,
    color: '#8E8E93',
    fontWeight: '500',
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: '#E5E5EA',
  },
  footerButton: {
    flex: 1,
    marginHorizontal: 8,
  },
  dropdownButton: {
    height: 56,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    paddingHorizontal: 16,
    justifyContent: 'center',
    backgroundColor: '#FFFFFF',
  },
  dropdownText: {
    fontSize: 16,
    color: '#000000',
  },
  placeholderText: {
    fontSize: 16,
    color: '#8E8E93',
  },
});

export default AddVisaModal;