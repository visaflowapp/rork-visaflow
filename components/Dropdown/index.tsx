import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  Modal, 
  FlatList,
  SafeAreaView,
  TextInput,
  TouchableWithoutFeedback
} from 'react-native';
import { ChevronDown, Search, Check } from 'lucide-react-native';
import { getCountryFlag } from './CountryFlags';
import { dropdownStyles as styles } from './styles';

interface DropdownProps {
  label: string;
  options: string[];
  value: string;
  onSelect: (item: string) => void;
  placeholder?: string;
  showFlags?: boolean;
}

const Dropdown: React.FC<DropdownProps> = ({
  label,
  options,
  value,
  onSelect,
  placeholder = 'Select an option',
  showFlags = false
}) => {
  const [visible, setVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [filteredOptions, setFilteredOptions] = useState(options);

  useEffect(() => {
    if (searchQuery.trim() === '') {
      setFilteredOptions(options);
    } else {
      const filtered = options.filter(option => 
        option.toLowerCase().includes(searchQuery.toLowerCase())
      );
      setFilteredOptions(filtered);
    }
  }, [searchQuery, options]);

  const toggleDropdown = () => {
    setVisible(!visible);
    if (!visible) {
      setSearchQuery('');
      setFilteredOptions(options);
    }
  };

  const handleItemSelect = (item: string) => {
    onSelect(item);
    setVisible(false);
    setSearchQuery('');
    setFilteredOptions(options);
  };

  const closeModal = () => {
    setVisible(false);
    setSearchQuery('');
    setFilteredOptions(options);
  };

  const renderItem = ({ item }: { item: string }) => (
    <TouchableOpacity 
      style={[
        styles.item,
        item === value && styles.selectedItem
      ]} 
      onPress={() => handleItemSelect(item)}
      activeOpacity={0.7}
    >
      {showFlags && (
        <Text style={styles.flagEmoji}>{getCountryFlag(item)}</Text>
      )}
      <Text style={[
        styles.itemText,
        item === value && styles.selectedItemText
      ]}>
        {item}
      </Text>
      {item === value && (
        <Check size={18} color="#007AFF" style={styles.checkIcon} />
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
        onPress={toggleDropdown}
        activeOpacity={0.8}
      >
        {value && showFlags && (
          <Text style={styles.selectedFlag}>{getCountryFlag(value)}</Text>
        )}
        <Text style={[
          styles.buttonText,
          !value && styles.placeholderText,
          value && styles.selectedText
        ]}>
          {value || placeholder}
        </Text>
        <ChevronDown 
          size={20} 
          color={value ? "#007AFF" : "#8E8E93"} 
          style={[
            styles.chevron,
            visible && styles.chevronRotated
          ]}
        />
      </TouchableOpacity>

      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={closeModal}
      >
        <TouchableWithoutFeedback onPress={closeModal}>
          <View style={styles.overlay}>
            <TouchableWithoutFeedback onPress={() => {}}>
              <SafeAreaView style={styles.modalContainer}>
                <View style={styles.modalContent}>
                  <View style={styles.modalHeader}>
                    <Text style={styles.modalTitle}>{label}</Text>
                    <TouchableOpacity onPress={closeModal}>
                      <Text style={styles.closeText}>Done</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.searchContainer}>
                    <Search size={20} color="#8E8E93" style={styles.searchIcon} />
                    <TextInput
                      style={styles.searchInput}
                      placeholder="Search..."
                      value={searchQuery}
                      onChangeText={setSearchQuery}
                      autoCapitalize="none"
                      clearButtonMode="while-editing"
                    />
                  </View>
                  
                  <FlatList
                    data={filteredOptions}
                    renderItem={renderItem}
                    keyExtractor={(item, index) => `${item}-${index}`}
                    style={styles.listContainer}
                    keyboardShouldPersistTaps="handled"
                    showsVerticalScrollIndicator={true}
                    initialNumToRender={15}
                    maxToRenderPerBatch={15}
                    windowSize={10}
                    getItemLayout={(data, index) => ({
                      length: 56,
                      offset: 56 * index,
                      index,
                    })}
                    ListEmptyComponent={
                      <View style={styles.emptyContainer}>
                        <Text style={styles.emptyText}>No results found</Text>
                      </View>
                    }
                  />
                </View>
              </SafeAreaView>
            </TouchableWithoutFeedback>
          </View>
        </TouchableWithoutFeedback>
      </Modal>
    </View>
  );
};

export default Dropdown;