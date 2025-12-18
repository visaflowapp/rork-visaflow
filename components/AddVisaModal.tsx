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
import { getCountryFlag, getAllCountries } from '@/utils/countryFlags';

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

// Dynamic visa types based on country
const getVisaTypesForCountry = (country: string): string[] => {
  const visaTypesByCountry: { [key: string]: string[] } = {
    'Indonesia': ['B211A Visa', 'B211B Visa', 'Tourist Visa', 'Business Visa'],
    'Thailand': ['Tourist Visa', 'Non-O Visa', 'Non-B Visa', 'Elite Visa', 'Digital Nomad Visa'],
    'Malaysia': ['Tourist Visa', 'MM2H Visa', 'Business Visa', 'Digital Nomad Visa'],
    'Philippines': ['Tourist Visa', 'SRRV Visa', 'Business Visa', 'Digital Nomad Visa'],
    'Vietnam': ['Tourist Visa', 'Business Visa', 'Work Permit', 'eVisa'],
    'Singapore': ['Tourist Visa', 'Business Visa', 'Work Visa', 'Tech.Pass'],
    'Cambodia': ['Tourist Visa', 'Business Visa', 'eVisa'],
    'Japan': ['Tourist Visa', 'Business Visa', 'Work Visa', 'Digital Nomad Visa'],
    'South Korea': ['Tourist Visa', 'Business Visa', 'Work Visa', 'Digital Nomad Visa'],
    'Taiwan': ['Tourist Visa', 'Business Visa', 'Gold Card'],
    'Mexico': ['Tourist Visa', 'Temporary Resident Visa', 'Digital Nomad Visa'],
    'Colombia': ['Tourist Visa', 'Digital Nomad Visa', 'Business Visa'],
    'Brazil': ['Tourist Visa', 'Business Visa', 'Digital Nomad Visa'],
    'Portugal': ['Tourist Visa', 'Digital Nomad Visa', 'D7 Visa', 'Business Visa'],
    'Spain': ['Tourist Visa', 'Digital Nomad Visa', 'Business Visa'],
    'Italy': ['Tourist Visa', 'Digital Nomad Visa', 'Business Visa'],
    'Greece': ['Tourist Visa', 'Digital Nomad Visa', 'Business Visa'],
    'Croatia': ['Tourist Visa', 'Digital Nomad Visa', 'Business Visa'],
    'Georgia': ['Tourist Visa', 'Digital Nomad Visa', 'Business Visa'],
    'Turkey': ['Tourist Visa', 'Business Visa', 'eVisa'],
  };

  return visaTypesByCountry[country] || ['Tourist Visa', 'Business Visa', 'Digital Nomad Visa'];
};

const allCountries = getAllCountries();

const AddVisaModal: React.FC<AddVisaModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  console.log('AddVisaModal: Rendered with visible =', visible);
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

  const isFormValid = () => {
    return country && visaType && entryDate && exitDate && exitDate > entryDate;
  };

  const handleSave = () => {
    console.log('Form validation:', {
      country,
      visaType,
      entryDate,
      exitDate,
      isValid: isFormValid()
    });
    
    if (!isFormValid()) {
      Alert.alert('Missing Information', 'Please fill in all required fields and ensure exit date is after entry date.');
      return;
    }

    const visaData = {
      country,
      visa_type: visaType,
      entry_date: entryDate.toISOString().split('T')[0],
      exit_date: exitDate.toISOString().split('T')[0],
      duration: calculateDuration(),
      extensions_available: parseInt(extensionsAvailable, 10) || 0,
      notes: notes.trim() || undefined,
    };
    
    console.log('Saving visa data:', visaData);
    onSave(visaData);
    resetForm();
  };

  const handleClose = () => {
    resetForm();
    onClose();
  };

  const handleCountrySelect = (selectedCountry: string) => {
    setCountry(selectedCountry);
    setVisaType(''); // Reset visa type when country changes
    setShowCountryDropdown(false);
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

  console.log('AddVisaModal: Render called with visible =', visible);
  
  if (!visible) {
    console.log('AddVisaModal: Not visible, returning null');
    return null;
  }
  
  console.log('AddVisaModal: Rendering modal content');

  const availableVisaTypes = country ? getVisaTypesForCountry(country) : [];

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
      onShow={() => console.log('AddVisaModal: Modal shown')}
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
                testID="country-picker"
                style={styles.dropdownButton}
                onPress={() => setShowCountryDropdown(true)}
              >
                <Text style={country ? styles.dropdownText : styles.placeholderText}>
                  {country ? `${getCountryFlag(country)} ${country}` : 'Select country'}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Visa Type *</Text>
              <TouchableOpacity
                testID="visa-type-picker"
                style={[styles.dropdownButton, !country && styles.disabledButton]}
                onPress={() => country && setShowVisaTypeDropdown(true)}
                disabled={!country}
              >
                <Text style={visaType ? styles.dropdownText : styles.placeholderText}>
                  {visaType || (country ? 'Select visa type' : 'Select country first')}
                </Text>
              </TouchableOpacity>
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Entry Date *</Text>
              <TouchableOpacity
                testID="entry-date-picker"
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
              <Text style={styles.label}>Exit Date *</Text>
              <TouchableOpacity
                testID="exit-date-picker"
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
              testID="cancel-add-visa"
              title="Cancel"
              onPress={handleClose}
              variant="outline"
              style={styles.footerButton}
            />
            <Button
              testID="save-visa"
              title="Save Visa"
              onPress={handleSave}
              style={[
                styles.footerButton,
                !isFormValid() && styles.disabledSaveButton
              ]}
              disabled={!isFormValid()}
            />
          </View>

          {showEntryDatePicker && (
            <DateTimePicker
              value={entryDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onEntryDateChange}
              minimumDate={new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)}
            />
          )}

          {showExitDatePicker && (
            <DateTimePicker
              value={exitDate}
              mode="date"
              display={Platform.OS === 'ios' ? 'spinner' : 'default'}
              onChange={onExitDateChange}
              minimumDate={entryDate}
            />
          )}

{showCountryDropdown && (
            <SimpleDropdown
              label="Select Country"
              options={allCountries}
              value={country}
              onSelect={handleCountrySelect}
              placeholder="Select country"
              onClose={() => setShowCountryDropdown(false)}
              renderOption={(item) => `${getCountryFlag(item)} ${item}`}
              searchable={true}
            />
          )}

          {showVisaTypeDropdown && (
            <SimpleDropdown
              label="Select Visa Type"
              options={availableVisaTypes}
              value={visaType}
              onSelect={(value) => {
                setVisaType(value);
                setShowVisaTypeDropdown(false);
              }}
              placeholder="Select visa type"
              onClose={() => setShowVisaTypeDropdown(false)}
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
  disabledButton: {
    backgroundColor: '#F2F2F7',
    borderColor: '#E5E5EA',
  },
  dropdownText: {
    fontSize: 16,
    color: '#000000',
  },
  placeholderText: {
    fontSize: 16,
    color: '#8E8E93',
  },
  disabledSaveButton: {
    opacity: 0.5,
  },
});

export default AddVisaModal;