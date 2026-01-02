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

interface SimpleDropdownProps {
  label: string;
  options: string[];
  value: string;
  onSelect: (item: string) => void;
  placeholder?: string;
  onClose?: () => void;
  renderOption?: (item: string) => string;
  searchable?: boolean;
}

const SimpleDropdown: React.FC<SimpleDropdownProps> = ({
  label,
  options,
  value,
  onSelect,
  placeholder = 'Select an option',
  onClose,
  renderOption,
  searchable = false
}) => {
  const [searchQuery, setSearchQuery] = useState('');

  const filteredOptions = useMemo(() => {
    if (!searchable || !searchQuery.trim()) {
      return options;
    }
    const query = searchQuery.toLowerCase();
    return options.filter(option => 
      option.toLowerCase().includes(query)
    );
  }, [options, searchQuery, searchable]);
const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity
      style={[
        styles.option,
        item === value && styles.selectedOption
      ]}
      onPress={() => onSelect(item)}
    >
      <Text style={[
        styles.optionText,
        item === value && styles.selectedOptionText
      ]}>
        {renderOption ? renderOption(item) : item}
      </Text>
      {item === value && (
        <Check size={20} color="#007AFF" />
      )}
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={true}
      transparent={true}
      animationType="fade"
      statusBarTranslucent
    >
      <Pressable 
        style={styles.modalOverlay}
        onPress={onClose}
      >
        <Pressable style={styles.modalContent} onPress={(e) => e.stopPropagation()}>
          <Text style={styles.modalTitle}>{label}</Text>
          {searchable && (
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
          )}
          <FlatList
            data={filteredOptions}
            renderItem={renderItem}
            keyExtractor={(item) => item}
            style={styles.optionsList}
            showsVerticalScrollIndicator={false}
          />
        </Pressable>
      </Pressable>
    </Modal>
  );
};

const styles = StyleSheet.create({
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