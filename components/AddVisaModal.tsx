import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  ScrollView,
  Platform
} from 'react-native';
import { X } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import Button from './Button';
import Dropdown from './Dropdown';
import Colors from '@/constants/colors';
import { countries } from '@/constants/mockData';

interface AddVisaModalProps {
  visible: boolean;
  onClose: () => void;
  onSave: (visaData: {
    country: string;
    visa_type: string;
    entry_date: string;
    duration: number;
    exit_date: string;
    extensions_available: number;
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

const AddVisaModal: React.FC<AddVisaModalProps> = ({
  visible,
  onClose,
  onSave,
}) => {
  const [country, setCountry] = useState('');
  const [visaType, setVisaType] = useState('');
  const [entryDate, setEntryDate] = useState(new Date());
  const [duration, setDuration] = useState('90');
  const [extensionsAvailable, setExtensionsAvailable] = useState('0');
  const [showDatePicker, setShowDatePicker] = useState(false);

  const calculateExitDate = () => {
    const exitDate = new Date(entryDate);
    exitDate.setDate(exitDate.getDate() + parseInt(duration || '0', 10));
    return exitDate.toISOString().split('T')[0];
  };

  const handleSave = () => {
    if (!country || !visaType || !duration) {
      return;
    }

    onSave({
      country,
      visa_type: visaType,
      entry_date: entryDate.toISOString().split('T')[0],
      duration: parseInt(duration, 10),
      exit_date: calculateExitDate(),
      extensions_available: parseInt(extensionsAvailable, 10),
    });

    // Reset form
    setCountry('');
    setVisaType('');
    setEntryDate(new Date());
    setDuration('90');
    setExtensionsAvailable('0');
    onClose();
  };

  const onDateChange = (event: any, selectedDate?: Date) => {
    setShowDatePicker(Platform.OS === 'ios');
    if (selectedDate) {
      setEntryDate(selectedDate);
    }
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Add Visa</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={Colors.black} />
            </TouchableOpacity>
          </View>

          <ScrollView 
            style={styles.formContainer} 
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            <Dropdown
              label="Country"
              options={countries}
              value={country}
              onSelect={setCountry}
              placeholder="Select country"
              showFlags={true}
            />

            <Dropdown
              label="Visa Type"
              options={visaTypes}
              value={visaType}
              onSelect={setVisaType}
              placeholder="Select visa type"
            />

            <View style={styles.formGroup}>
              <Text style={styles.label}>Entry Date</Text>
              <TouchableOpacity
                style={styles.dateInput}
                onPress={() => setShowDatePicker(true)}
              >
                <Text style={styles.dateText}>
                  {entryDate.toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </Text>
              </TouchableOpacity>
              {showDatePicker && (
                <DateTimePicker
                  value={entryDate}
                  mode="date"
                  display="default"
                  onChange={onDateChange}
                />
              )}
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Duration (days)</Text>
              <TextInput
                style={styles.input}
                value={duration}
                onChangeText={setDuration}
                keyboardType="number-pad"
                placeholder="Enter duration in days"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Extensions Available</Text>
              <TextInput
                style={styles.input}
                value={extensionsAvailable}
                onChangeText={setExtensionsAvailable}
                keyboardType="number-pad"
                placeholder="Number of extensions available"
              />
            </View>

            <View style={styles.formGroup}>
              <Text style={styles.label}>Exit Date (Calculated)</Text>
              <View style={styles.calculatedField}>
                <Text style={styles.calculatedText}>
                  {new Date(calculateExitDate()).toLocaleDateString('en-US', { 
                    month: 'short', 
                    day: 'numeric',
                    year: 'numeric'
                  })}
                </Text>
              </View>
            </View>
          </ScrollView>

          <View style={styles.footer}>
            <Button
              title="Cancel"
              onPress={onClose}
              variant="outline"
              style={styles.footerButton}
            />
            <Button
              title="Save Visa"
              onPress={handleSave}
              style={styles.footerButton}
            />
          </View>
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
    backgroundColor: Colors.white,
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
    color: Colors.black,
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
    color: Colors.black,
    fontWeight: '600',
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
    justifyContent: 'center',
    backgroundColor: Colors.white,
  },
  dateText: {
    fontSize: 16,
    color: Colors.black,
  },
  calculatedField: {
    height: 56,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    backgroundColor: Colors.lightGray,
    justifyContent: 'center',
  },
  calculatedText: {
    fontSize: 16,
    color: Colors.silver,
  },
  footer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 16,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
  },
  footerButton: {
    flex: 1,
    marginHorizontal: 8,
  },
});

export default AddVisaModal;