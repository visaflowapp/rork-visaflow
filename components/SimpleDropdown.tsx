import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  Modal,
  FlatList,
  Pressable
} from 'react-native';
import { ChevronDown, Check } from 'lucide-react-native';
import Colors from '@/constants/colors';

interface SimpleDropdownProps {
  label: string;
  options: string[];
  value: string;
  onSelect: (item: string) => void;
  placeholder?: string;
}

const SimpleDropdown: React.FC<SimpleDropdownProps> = ({
  label,
  options,
  value,
  onSelect,
  placeholder = 'Select an option'
}) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleSelect = (item: string) => {
    onSelect(item);
    setIsVisible(false);
  };

  const renderOption = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.option,
        item === value && styles.selectedOption
      ]}
      onPress={() => handleSelect(item)}
    >
      <Text style={[
        styles.optionText,
        item === value && styles.selectedOptionText
      ]}>
        {item}
      </Text>
      {item === value && (
        <Check size={20} color={Colors.primary} />
      )}
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      <TouchableOpacity 
        style={[
          styles.button,
          value && styles.buttonSelected
        ]} 
        onPress={() => setIsVisible(true)}
      >
        <Text style={[
          styles.buttonText,
          !value && styles.placeholderText
        ]}>
          {value || placeholder}
        </Text>
        <ChevronDown size={20} color={Colors.primary} />
      </TouchableOpacity>

      <Modal
        visible={isVisible}
        transparent={true}
        animationType="fade"
        onRequestClose={() => setIsVisible(false)}
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setIsVisible(false)}
        >
          <View style={styles.modalContent}>
            <Text style={styles.modalTitle}>{label}</Text>
            <FlatList
              data={options}
              renderItem={renderOption}
              keyExtractor={(item) => item}
              style={styles.optionsList}
              showsVerticalScrollIndicator={false}
            />
          </View>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: Colors.black,
    fontWeight: '600',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  buttonSelected: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
  },
  buttonText: {
    fontSize: 16,
    flex: 1,
  },
  placeholderText: {
    color: Colors.silver,
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    padding: 20,
    width: '80%',
    maxHeight: '60%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 16,
    textAlign: 'center',
  },
  optionsList: {
    maxHeight: 300,
  },
  option: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  selectedOption: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  optionText: {
    fontSize: 16,
    color: Colors.black,
    flex: 1,
  },
  selectedOptionText: {
    color: Colors.primary,
    fontWeight: '600',
  },
});

export default SimpleDropdown;