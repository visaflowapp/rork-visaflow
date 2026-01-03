import React, { useState, useMemo } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet,
  Modal,
  FlatList,
  Pressable,
  TextInput
} from 'react-native';
import { Check, Search } from 'lucide-react-native';

interface DropdownOption {
  label: string;
  value: string;
}

interface SimpleDropdownProps {
  options: DropdownOption[];
  selectedValue: string;
  onSelect: (value: string) => void;
  placeholder?: string;
}

const SimpleDropdown: React.FC<SimpleDropdownProps> = ({
  options,
  selectedValue,
  onSelect,
  placeholder = 'Select an option',
}) => {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [searchQuery, setSearchQuery] = useState<string>('');

  const filteredOptions = useMemo(() => {
    if (!searchQuery.trim()) {
      return options;
    }
    const query = searchQuery.toLowerCase();
    return options.filter(option => 
      option.label.toLowerCase().includes(query)
    );
  }, [options, searchQuery]);

  const selectedOption = options.find(opt => opt.value === selectedValue);
  const renderItem = ({ item }: { item: DropdownOption }) => (
    <TouchableOpacity
      style={[
        styles.option,
        item.value === selectedValue && styles.selectedOption
      ]}
      onPress={() => {
        onSelect(item.value);
        setIsOpen(false);
      }}
    >
      <Text style={[
        styles.optionText,
        item.value === selectedValue && styles.selectedOptionText
      ]}>
        {item.label}
      </Text>
      {item.value === selectedValue && (
        <Check size={20} color="#007AFF" />
      )}
    </TouchableOpacity>
  );

  return (
    <View>
      <TouchableOpacity
        style={styles.dropdownButton}
        onPress={() => setIsOpen(true)}
      >
        <Text style={[styles.dropdownButtonText, !selectedValue && styles.placeholderText]}>
          {selectedOption ? selectedOption.label : placeholder}
        </Text>
      </TouchableOpacity>

      <Modal
        visible={isOpen}
        transparent={true}
        animationType="fade"
        statusBarTranslucent
      >
        <Pressable 
          style={styles.modalOverlay}
          onPress={() => setIsOpen(false)}
        >
          <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
            <Text style={styles.modalTitle}>{placeholder}</Text>
            <View style={styles.searchContainer}>
              <Search size={20} color="#8E8E93" style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search..."
                placeholderTextColor="#8E8E93"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus={true}
              />
            </View>
            <FlatList
              data={filteredOptions}
              renderItem={renderItem}
              keyExtractor={(item) => item.value}
              style={styles.optionsList}
              showsVerticalScrollIndicator={false}
            />
          </Pressable>
        </Pressable>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  dropdownButton: {
    backgroundColor: '#FFFFFF',
    borderWidth: 2,
    borderColor: '#E5E5EA',
    borderRadius: 16,
    paddingVertical: 16,
    paddingHorizontal: 20,
    minHeight: 56,
    justifyContent: 'center',
  },
  dropdownButtonText: {
    fontSize: 16,
    color: '#000000',
    fontWeight: '500',
  },
  placeholderText: {
    color: '#8E8E93',
    fontWeight: '400',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalContent: {
    backgroundColor: '#FFFFFF',
    borderRadius: 16,
    padding: 20,
    width: '85%',
    maxHeight: '70%',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
    paddingHorizontal: 12,
    marginBottom: 16,
    height: 44,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    color: '#000000',
    height: '100%',
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
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
    borderBottomColor: '#E5E5EA',
  },
  selectedOption: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  optionText: {
    fontSize: 16,
    color: '#000000',
    flex: 1,
  },
  selectedOptionText: {
    color: '#007AFF',
    fontWeight: '600',
  },
});

export default SimpleDropdown;