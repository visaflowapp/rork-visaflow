import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TouchableOpacity, 
  StyleSheet, 
  Modal, 
  FlatList,
  SafeAreaView,
  TextInput,
  TouchableWithoutFeedback
} from 'react-native';
import { ChevronDown, Search } from 'lucide-react-native';
import Colors from '@/constants/colors';

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

  const getCountryFlag = (countryName: string) => {
    const flagMap: {[key: string]: string} = {
      "Afghanistan": "🇦🇫",
      "Albania": "🇦🇱",
      "Algeria": "🇩🇿",
      "Andorra": "🇦🇩",
      "Angola": "🇦🇴",
      "Argentina": "🇦🇷",
      "Armenia": "🇦🇲",
      "Australia": "🇦🇺",
      "Austria": "🇦🇹",
      "Azerbaijan": "🇦🇿",
      "Bahamas": "🇧🇸",
      "Bahrain": "🇧🇭",
      "Bangladesh": "🇧🇩",
      "Barbados": "🇧🇧",
      "Belarus": "🇧🇾",
      "Belgium": "🇧🇪",
      "Belize": "🇧🇿",
      "Benin": "🇧🇯",
      "Bhutan": "🇧🇹",
      "Bolivia": "🇧🇴",
      "Bosnia and Herzegovina": "🇧🇦",
      "Botswana": "🇧🇼",
      "Brazil": "🇧🇷",
      "Brunei": "🇧🇳",
      "Bulgaria": "🇧🇬",
      "Burkina Faso": "🇧🇫",
      "Burundi": "🇧🇮",
      "Cambodia": "🇰🇭",
      "Cameroon": "🇨🇲",
      "Canada": "🇨🇦",
      "Cape Verde": "🇨🇻",
      "Central African Republic": "🇨🇫",
      "Chad": "🇹🇩",
      "Chile": "🇨🇱",
      "China": "🇨🇳",
      "Colombia": "🇨🇴",
      "Comoros": "🇰🇲",
      "Congo": "🇨🇬",
      "Costa Rica": "🇨🇷",
      "Croatia": "🇭🇷",
      "Cuba": "🇨🇺",
      "Cyprus": "🇨🇾",
      "Czech Republic": "🇨🇿",
      "Denmark": "🇩🇰",
      "Djibouti": "🇩🇯",
      "Dominica": "🇩🇲",
      "Dominican Republic": "🇩🇴",
      "Ecuador": "🇪🇨",
      "Egypt": "🇪🇬",
      "El Salvador": "🇸🇻",
      "Equatorial Guinea": "🇬🇶",
      "Eritrea": "🇪🇷",
      "Estonia": "🇪🇪",
      "Eswatini": "🇸🇿",
      "Ethiopia": "🇪🇹",
      "Fiji": "🇫🇯",
      "Finland": "🇫🇮",
      "France": "🇫🇷",
      "Gabon": "🇬🇦",
      "Gambia": "🇬🇲",
      "Georgia": "🇬🇪",
      "Germany": "🇩🇪",
      "Ghana": "🇬🇭",
      "Greece": "🇬🇷",
      "Grenada": "🇬🇩",
      "Guatemala": "🇬🇹",
      "Guinea": "🇬🇳",
      "Guinea-Bissau": "🇬🇼",
      "Guyana": "🇬🇾",
      "Haiti": "🇭🇹",
      "Honduras": "🇭🇳",
      "Hong Kong": "🇭🇰",
      "Hungary": "🇭🇺",
      "Iceland": "🇮🇸",
      "India": "🇮🇳",
      "Indonesia": "🇮🇩",
      "Iran": "🇮🇷",
      "Iraq": "🇮🇶",
      "Ireland": "🇮🇪",
      "Israel": "🇮🇱",
      "Italy": "🇮🇹",
      "Jamaica": "🇯🇲",
      "Japan": "🇯🇵",
      "Jordan": "🇯🇴",
      "Kazakhstan": "🇰🇿",
      "Kenya": "🇰🇪",
      "Kiribati": "🇰🇮",
      "Kuwait": "🇰🇼",
      "Kyrgyzstan": "🇰🇬",
      "Laos": "🇱🇦",
      "Latvia": "🇱🇻",
      "Lebanon": "🇱🇧",
      "Lesotho": "🇱🇸",
      "Liberia": "🇱🇷",
      "Libya": "🇱🇾",
      "Liechtenstein": "🇱🇮",
      "Lithuania": "🇱🇹",
      "Luxembourg": "🇱🇺",
      "Madagascar": "🇲🇬",
      "Malawi": "🇲🇼",
      "Malaysia": "🇲🇾",
      "Maldives": "🇲🇻",
      "Mali": "🇲🇱",
      "Malta": "🇲🇹",
      "Marshall Islands": "🇲🇭",
      "Mauritania": "🇲🇷",
      "Mauritius": "🇲🇺",
      "Mexico": "🇲🇽",
      "Micronesia": "🇫🇲",
      "Moldova": "🇲🇩",
      "Monaco": "🇲🇨",
      "Mongolia": "🇲🇳",
      "Montenegro": "🇲🇪",
      "Morocco": "🇲🇦",
      "Mozambique": "🇲🇿",
      "Myanmar": "🇲🇲",
      "Namibia": "🇳🇦",
      "Nauru": "🇳🇷",
      "Nepal": "🇳🇵",
      "Netherlands": "🇳🇱",
      "New Zealand": "🇳🇿",
      "Nicaragua": "🇳🇮",
      "Niger": "🇳🇪",
      "Nigeria": "🇳🇬",
      "North Korea": "🇰🇵",
      "North Macedonia": "🇲🇰",
      "Norway": "🇳🇴",
      "Oman": "🇴🇲",
      "Pakistan": "🇵🇰",
      "Palau": "🇵🇼",
      "Panama": "🇵🇦",
      "Papua New Guinea": "🇵🇬",
      "Paraguay": "🇵🇾",
      "Peru": "🇵🇪",
      "Philippines": "🇵🇭",
      "Poland": "🇵🇱",
      "Portugal": "🇵🇹",
      "Qatar": "🇶🇦",
      "Romania": "🇷🇴",
      "Russia": "🇷🇺",
      "Rwanda": "🇷🇼",
      "Saint Kitts and Nevis": "🇰🇳",
      "Saint Lucia": "🇱🇨",
      "Saint Vincent and the Grenadines": "🇻🇨",
      "Samoa": "🇼🇸",
      "San Marino": "🇸🇲",
      "Saudi Arabia": "🇸🇦",
      "Senegal": "🇸🇳",
      "Serbia": "🇷🇸",
      "Seychelles": "🇸🇨",
      "Sierra Leone": "🇸🇱",
      "Singapore": "🇸🇬",
      "Slovakia": "🇸🇰",
      "Slovenia": "🇸🇮",
      "Solomon Islands": "🇸🇧",
      "Somalia": "🇸🇴",
      "South Africa": "🇿🇦",
      "South Korea": "🇰🇷",
      "South Sudan": "🇸🇸",
      "Spain": "🇪🇸",
      "Sri Lanka": "🇱🇰",
      "Sudan": "🇸🇩",
      "Suriname": "🇸🇷",
      "Sweden": "🇸🇪",
      "Switzerland": "🇨🇭",
      "Syria": "🇸🇾",
      "Taiwan": "🇹🇼",
      "Tajikistan": "🇹🇯",
      "Tanzania": "🇹🇿",
      "Thailand": "🇹🇭",
      "Timor-Leste": "🇹🇱",
      "Togo": "🇹🇬",
      "Tonga": "🇹🇴",
      "Trinidad and Tobago": "🇹🇹",
      "Tunisia": "🇹🇳",
      "Turkey": "🇹🇷",
      "Turkmenistan": "🇹🇲",
      "Tuvalu": "🇹🇻",
      "Uganda": "🇺🇬",
      "Ukraine": "🇺🇦",
      "United Arab Emirates": "🇦🇪",
      "United Kingdom": "🇬🇧",
      "United States": "🇺🇸",
      "Uruguay": "🇺🇾",
      "Uzbekistan": "🇺🇿",
      "Vanuatu": "🇻🇺",
      "Vatican City": "🇻🇦",
      "Venezuela": "🇻🇪",
      "Vietnam": "🇻🇳",
      "Yemen": "🇾🇪",
      "Zambia": "🇿🇲",
      "Zimbabwe": "🇿🇼"
    };
    
    return flagMap[countryName] || "🏳️";
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
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TouchableOpacity 
        style={styles.button} 
        onPress={toggleDropdown}
        activeOpacity={0.8}
      >
        {value && showFlags && (
          <Text style={styles.selectedFlag}>{getCountryFlag(value)}</Text>
        )}
        <Text style={[
          styles.buttonText,
          !value && styles.placeholderText
        ]}>
          {value || placeholder}
        </Text>
        <ChevronDown size={20} color={Colors.silver} />
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
                      <Text style={styles.closeText}>Close</Text>
                    </TouchableOpacity>
                  </View>
                  
                  <View style={styles.searchContainer}>
                    <Search size={20} color={Colors.silver} style={styles.searchIcon} />
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
                    initialNumToRender={20}
                    maxToRenderPerBatch={20}
                    windowSize={10}
                    getItemLayout={(data, index) => ({
                      length: 60,
                      offset: 60 * index,
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
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 1,
    borderColor: Colors.border,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  selectedFlag: {
    fontSize: 18,
    marginRight: 10,
  },
  buttonText: {
    flex: 1,
    fontSize: 16,
    color: Colors.black,
  },
  placeholderText: {
    color: Colors.silver,
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '80%',
  },
  modalContent: {
    padding: 16,
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
  },
  closeText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginTop: 16,
    marginBottom: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: Colors.black,
  },
  listContainer: {
    marginTop: 8,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    height: 60,
  },
  selectedItem: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  flagEmoji: {
    fontSize: 18,
    marginRight: 12,
  },
  itemText: {
    fontSize: 16,
    color: Colors.black,
  },
  selectedItemText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.silver,
    fontSize: 16,
  },
});

export default Dropdown;