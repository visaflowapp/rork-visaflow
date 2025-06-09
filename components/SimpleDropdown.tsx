import React, { useState } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  ScrollView,
  Dimensions
} from 'react-native';
import { ChevronDown, ChevronUp } from 'lucide-react-native';
import Colors from '@/constants/colors';

const { height } = Dimensions.get('window');

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
  const [isOpen, setIsOpen] = useState(false);

  const handleSelect = (item: string) => {
    onSelect(item);
    setIsOpen(false);
  };

  const toggleDropdown = () => {
    setIsOpen(!isOpen);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      
      <TouchableOpacity 
        style={[
          styles.button,
          value && styles.buttonSelected,
          isOpen && styles.buttonOpen
        ]} 
        onPress={toggleDropdown}
        activeOpacity={0.8}
      >
        <Text style={[
          styles.buttonText,
          !value && styles.placeholderText,
          value && styles.selectedText
        ]}>
          {value || placeholder}
        </Text>
        {isOpen ? (
          <ChevronUp size={20} color={value ? Colors.primary : Colors.silver} />
        ) : (
          <ChevronDown size={20} color={value ? Colors.primary : Colors.silver} />
        )}
      </TouchableOpacity>

      {isOpen && (
        <View style={styles.optionsContainer}>
          <ScrollView 
            style={styles.optionsList}
            showsVerticalScrollIndicator={true}
            nestedScrollEnabled={true}
          >
            {options.map((option, index) => (
              <TouchableOpacity
                key={`${option}-${index}`}
                style={[
                  styles.option,
                  option === value && styles.selectedOption
                ]}
                onPress={() => handleSelect(option)}
                activeOpacity={0.7}
              >
                <Text style={[
                  styles.optionText,
                  option === value && styles.selectedOptionText
                ]}>
                  {option}
                </Text>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    marginBottom: 20,
    zIndex: 1000,
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
    borderWidth: 2,
    borderColor: Colors.border,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonSelected: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
  },
  buttonOpen: {
    borderBottomLeftRadius: 0,
    borderBottomRightRadius: 0,
    borderBottomWidth: 0,
  },
  buttonText: {
    flex: 1,
    fontSize: 16,
  },
  placeholderText: {
    color: Colors.silver,
  },
  selectedText: {
    color: Colors.black,
    fontWeight: '500',
  },
  optionsContainer: {
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderTopWidth: 0,
    borderColor: Colors.primary,
    borderBottomLeftRadius: 12,
    borderBottomRightRadius: 12,
    maxHeight: height * 0.3,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 8,
  },
  optionsList: {
    flex: 1,
  },
  option: {
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  selectedOption: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  optionText: {
    fontSize: 16,
    color: Colors.black,
  },
  selectedOptionText: {
    color: Colors.primary,
    fontWeight: '600',
  },
});

export default SimpleDropdown;