import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  StyleSheet, 
  ScrollView, 
  TouchableOpacity, 
  TextInput,
  ActivityIndicator,
  Modal,
  FlatList,
  Pressable,
  KeyboardAvoidingView,
  Platform
} from 'react-native';
import { Stack } from 'expo-router';
import { Calendar, ChevronDown, Plane, PlaneTakeoff, PlaneLanding, CreditCard, ExternalLink, Info, Search } from 'lucide-react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { colors } from '@/constants/colors';
import { countries } from '@/constants/mockData';
import { getCountryFlag } from '@/utils/countryFlags';

// Trip purposes
const tripPurposes = [
  'Tourism',
  'Business',
  'Digital Nomad',
  'Study',
  'Work',
  'Family Visit'
];

// Trip types
const tripTypes = [
  'One Way',
  'Round Trip'
];

export default function RequirementsScreen() {
  // Form state
  const [passportCountry, setPassportCountry] = useState('United States');
  const [tripType, setTripType] = useState('Round Trip');
  const [fromCountry, setFromCountry] = useState('');
  const [transitCountry, setTransitCountry] = useState('');
  const [toCountry, setToCountry] = useState('');
  const [tripPurpose, setTripPurpose] = useState('Tourism');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)); // 7 days from now
  
  // UI state
  const [showPassportDropdown, setShowPassportDropdown] = useState(false);
  const [showTripTypeDropdown, setShowTripTypeDropdown] = useState(false);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showTransitDropdown, setShowTransitDropdown] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [showPurposeDropdown, setShowPurposeDropdown] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // API state
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Filter countries based on search query
  const filteredCountries = countries.filter(country => 
    country.toLowerCase().includes(searchQuery.toLowerCase())
  );

  // Format date for display
  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric'
    });
  };

  // Handle date changes
  const onStartDateChange = (event: any, selectedDate?: Date) => {
    setShowStartDatePicker(false);
    if (selectedDate) {
      setStartDate(selectedDate);
      // If end date is before start date, update it
      if (endDate < selectedDate) {
        setEndDate(new Date(selectedDate.getTime() + 7 * 24 * 60 * 60 * 1000));
      }
    }
  };

  const onEndDateChange = (event: any, selectedDate?: Date) => {
    setShowEndDatePicker(false);
    if (selectedDate) {
      setEndDate(selectedDate);
    }
  };

  // Fetch visa requirements
  const fetchVisaRequirements = async () => {
    if (!passportCountry || !toCountry) {
      setError('Please select both passport country and destination');
      return;
    }

    setIsLoading(true);
    setError(null);
    setShowResults(false);

    try {
      const apiKey = process.env.EXPO_PUBLIC_NOMAD_API_KEY;
      const apiHost = process.env.EXPO_PUBLIC_NOMAD_API_HOST;

      if (!apiKey || !apiHost) {
        throw new Error('Missing API configuration. Please set environment variables.');
      }

      // Convert country names to ISO codes (simplified for demo)
      const from = passportCountry === 'United States' ? 'US' : 'US'; // Default to US for demo
      const to = toCountry === 'Thailand' ? 'TH' : 'TH'; // Default to TH for demo
      
      const url = `https://${apiHost}/api/v1/visa/requirements/${from}/${to}`;
      
      const response = await fetch(url, {
        method: 'GET',
        headers: {
          'x-rapidapi-key': apiKey,
          'x-rapidapi-host': apiHost,
          'Content-Type': 'application/json',
        },
      });

      if (!response.ok) {
        throw new Error(`API request failed: ${response.status}`);
      }

      const data = await response.json();
      setApiResponse(data);
      setShowResults(true);
      
    } catch (err: unknown) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Mock data for demonstration when API is not available
  const mockVisaData = {
    visa_required: false,
    max_stay_days: 60,
    visa_on_arrival: false,
    evisa_available: true,
    special_visas: [
      {
        name: "Destination Thailand Visa (DTV)",
        description: "Available for remote workers and long term travelers",
        url: "https://www.thaievisa.go.th/visa/dtv-visa"
      }
    ],
    requirements: [
      {
        name: "Mandatory Digital Arrival Card",
        description: "Must be completed before arrival",
        url: "https://tdac.immigration.go.th/arrival-card/#/home"
      },
      {
        name: "Passport Validity",
        description: "Passport must be valid for at least 6 months from the time of entry",
        url: null
      },
      {
        name: "Return Ticket",
        description: "Proof of onward travel may be required",
        url: null
      },
      {
        name: "Sufficient Funds",
        description: "Proof of 20,000 THB per person or 40,000 THB per family may be requested",
        url: null
      }
    ]
  };

  // Render dropdown item
  const renderDropdownItem = (item: string, onSelect: (item: string) => void, closeDropdown: () => void) => {
    return (
      <TouchableOpacity
        style={styles.dropdownItem}
        onPress={() => {
          onSelect(item);
          closeDropdown();
        }}
      >
        <Text style={styles.countryFlag}>{getCountryFlag(item)}</Text>
        <Text style={styles.dropdownItemText}>{item}</Text>
      </TouchableOpacity>
    );
  };

  // Render country dropdown
  const renderCountryDropdown = (
    visible: boolean, 
    onClose: () => void, 
    onSelect: (country: string) => void,
    placeholder: string
  ) => {
    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
      >
        <KeyboardAvoidingView 
          behavior={Platform.OS === "ios" ? "padding" : "height"}
          style={styles.modalOverlay}
        >
          <View style={styles.modalContent}>
            <View style={styles.searchContainer}>
              <Search size={20} color={colors.textSecondary} style={styles.searchIcon} />
              <TextInput
                style={styles.searchInput}
                placeholder="Search countries"
                value={searchQuery}
                onChangeText={setSearchQuery}
                autoFocus
              />
              <TouchableOpacity onPress={onClose} style={styles.closeButton}>
                <Text style={styles.closeButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
            
            <FlatList
              data={filteredCountries}
              keyExtractor={(item) => item}
              renderItem={({ item }) => renderDropdownItem(item, onSelect, onClose)}
              style={styles.dropdownList}
              showsVerticalScrollIndicator={true}
              initialNumToRender={20}
              keyboardShouldPersistTaps="handled"
            />
          </View>
        </KeyboardAvoidingView>
      </Modal>
    );
  };

  // Render simple dropdown (for trip type and purpose)
  const renderSimpleDropdown = (
    visible: boolean,
    onClose: () => void,
    onSelect: (item: string) => void,
    items: string[],
    title: string
  ) => {
    return (
      <Modal
        visible={visible}
        transparent={true}
        animationType="slide"
        onRequestClose={onClose}
      >
        <View style={styles.modalOverlay}>
          <View style={styles.simpleModalContent}>
            <Text style={styles.modalTitle}>{title}</Text>
            
            {items.map((item) => (
              <TouchableOpacity
                key={item}
                style={styles.simpleDropdownItem}
                onPress={() => {
                  onSelect(item);
                  onClose();
                }}
              >
                <Text style={styles.simpleDropdownItemText}>{item}</Text>
              </TouchableOpacity>
            ))}
            
            <TouchableOpacity 
              style={styles.cancelButton}
              onPress={onClose}
            >
              <Text style={styles.cancelButtonText}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    );
  };

  return (
    <View style={styles.container}>
      <Stack.Screen 
        options={{ 
          title: 'Visa Requirements',
          headerStyle: { backgroundColor: colors.primary },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: 'bold',
            textAlign: 'center',
          },
          headerTitleAlign: 'center',
        }} 
      />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >
        {/* Header Section */}
        <View style={styles.headerSection}>
          <Text style={styles.headerTitle}>Visa Requirements</Text>
          <Text style={styles.headerSubtitle}>Check entry requirements for your next destination</Text>
        </View>

        {/* Form Card */}
        <View style={styles.formCard}>
          {/* Passport Country */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Your Nationality</Text>
            <TouchableOpacity 
              style={styles.dropdownButton}
              onPress={() => setShowPassportDropdown(true)}
            >
              <View style={styles.dropdownButtonContent}>
                <Text style={styles.countryFlag}>{getCountryFlag(passportCountry)}</Text>
                <Text style={styles.dropdownButtonText}>{passportCountry}</Text>
              </View>
              <ChevronDown size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Trip Type */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Trip Type</Text>
            <TouchableOpacity 
              style={styles.dropdownButton}
              onPress={() => setShowTripTypeDropdown(true)}
            >
              <View style={styles.dropdownButtonContent}>
                <Plane size={20} color={colors.primary} style={styles.inputIcon} />
                <Text style={styles.dropdownButtonText}>{tripType}</Text>
              </View>
              <ChevronDown size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* From Country */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Where From?</Text>
            <TouchableOpacity 
              style={styles.dropdownButton}
              onPress={() => setShowFromDropdown(true)}
            >
              <View style={styles.dropdownButtonContent}>
                <PlaneTakeoff size={20} color={colors.primary} style={styles.inputIcon} />
                <Text style={[
                  styles.dropdownButtonText,
                  !fromCountry && styles.placeholderText
                ]}>
                  {fromCountry ? (
                    <>
                      {getCountryFlag(fromCountry)} {fromCountry}
                    </>
                  ) : (
                    'Select origin country'
                  )}
                </Text>
              </View>
              <ChevronDown size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Transit Country (Optional) */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Transit Connection (Optional)</Text>
            <TouchableOpacity 
              style={styles.dropdownButton}
              onPress={() => setShowTransitDropdown(true)}
            >
              <View style={styles.dropdownButtonContent}>
                <Plane size={20} color={colors.primary} style={styles.inputIcon} />
                <Text style={[
                  styles.dropdownButtonText,
                  !transitCountry && styles.placeholderText
                ]}>
                  {transitCountry ? (
                    <>
                      {getCountryFlag(transitCountry)} {transitCountry}
                    </>
                  ) : (
                    'Select transit country (optional)'
                  )}
                </Text>
              </View>
              <ChevronDown size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* To Country */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Where To?</Text>
            <TouchableOpacity 
              style={styles.dropdownButton}
              onPress={() => setShowToDropdown(true)}
            >
              <View style={styles.dropdownButtonContent}>
                <PlaneLanding size={20} color={colors.primary} style={styles.inputIcon} />
                <Text style={[
                  styles.dropdownButtonText,
                  !toCountry && styles.placeholderText
                ]}>
                  {toCountry ? (
                    <>
                      {getCountryFlag(toCountry)} {toCountry}
                    </>
                  ) : (
                    'Select destination country'
                  )}
                </Text>
              </View>
              <ChevronDown size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Trip Purpose */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>Purpose of Travel</Text>
            <TouchableOpacity 
              style={styles.dropdownButton}
              onPress={() => setShowPurposeDropdown(true)}
            >
              <View style={styles.dropdownButtonContent}>
                <CreditCard size={20} color={colors.primary} style={styles.inputIcon} />
                <Text style={styles.dropdownButtonText}>{tripPurpose}</Text>
              </View>
              <ChevronDown size={20} color={colors.primary} />
            </TouchableOpacity>
          </View>

          {/* Date Range */}
          <View style={styles.formGroup}>
            <Text style={styles.formLabel}>
              {tripType === 'One Way' ? 'Select Departure Date' : 'Enter a Date Range'}
            </Text>
            
            {tripType === 'One Way' ? (
              <TouchableOpacity 
                style={styles.singleDateButton}
                onPress={() => setShowStartDatePicker(true)}
              >
                <Calendar size={20} color={colors.primary} style={styles.inputIcon} />
                <Text style={styles.dateButtonText}>{formatDate(startDate)}</Text>
              </TouchableOpacity>
            ) : (
              <View style={styles.dateRangeContainer}>
                <TouchableOpacity 
                  style={styles.dateButton}
                  onPress={() => setShowStartDatePicker(true)}
                >
                  <Calendar size={20} color={colors.primary} style={styles.inputIcon} />
                  <Text style={styles.dateButtonText}>{formatDate(startDate)}</Text>
                </TouchableOpacity>
                
                <Text style={styles.dateRangeSeparator}>—</Text>
                
                <TouchableOpacity 
                  style={styles.dateButton}
                  onPress={() => setShowEndDatePicker(true)}
                >
                  <Calendar size={20} color={colors.primary} style={styles.inputIcon} />
                  <Text style={styles.dateButtonText}>{formatDate(endDate)}</Text>
                </TouchableOpacity>
              </View>
            )}
          </View>

          {/* Check Requirements Button */}
          <TouchableOpacity 
            style={styles.checkButton}
            onPress={fetchVisaRequirements}
            disabled={isLoading}
          >
            {isLoading ? (
              <ActivityIndicator color="white" size="small" />
            ) : (
              <Text style={styles.checkButtonText}>Check Requirements</Text>
            )}
          </TouchableOpacity>
        </View>

        {/* Error Message */}
        {error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorTitle}>Error</Text>
            <Text style={styles.errorMessage}>{error}</Text>
          </View>
        )}

        {/* Results Section */}
        {showResults && (
          <View style={styles.resultsContainer}>
            {/* Use either API response or mock data */}
            {renderResults(apiResponse || mockVisaData)}
          </View>
        )}

        {/* Help Section */}
        <View style={styles.helpCard}>
          <View style={styles.helpHeader}>
            <Info size={20} color={colors.primary} />
            <Text style={styles.helpTitle}>Need Help?</Text>
          </View>
          <Text style={styles.helpText}>
            Our visa requirement data is updated regularly, but regulations can change quickly. 
            Always verify with the official embassy or consulate before travel.
          </Text>
        </View>
      </ScrollView>

      {/* Date Pickers */}
      {showStartDatePicker && (
        <DateTimePicker
          value={startDate}
          mode="date"
          display="default"
          onChange={onStartDateChange}
          minimumDate={new Date()}
        />
      )}
      
      {showEndDatePicker && (
        <DateTimePicker
          value={endDate}
          mode="date"
          display="default"
          onChange={onEndDateChange}
          minimumDate={startDate}
        />
      )}

      {/* Dropdowns */}
      {renderCountryDropdown(
        showPassportDropdown,
        () => {
          setShowPassportDropdown(false);
          setSearchQuery('');
        },
        setPassportCountry,
        'Select passport country'
      )}
      
      {renderCountryDropdown(
        showFromDropdown,
        () => {
          setShowFromDropdown(false);
          setSearchQuery('');
        },
        setFromCountry,
        'Select origin country'
      )}
      
      {renderCountryDropdown(
        showTransitDropdown,
        () => {
          setShowTransitDropdown(false);
          setSearchQuery('');
        },
        setTransitCountry,
        'Select transit country'
      )}
      
      {renderCountryDropdown(
        showToDropdown,
        () => {
          setShowToDropdown(false);
          setSearchQuery('');
        },
        setToCountry,
        'Select destination country'
      )}
      
      {renderSimpleDropdown(
        showTripTypeDropdown,
        () => setShowTripTypeDropdown(false),
        setTripType,
        tripTypes,
        'Select Trip Type'
      )}
      
      {renderSimpleDropdown(
        showPurposeDropdown,
        () => setShowPurposeDropdown(false),
        setTripPurpose,
        tripPurposes,
        'Select Purpose of Travel'
      )}
    </View>
  );
}

// Function to render formatted results
function renderResults(data: any) {
  return (
    <View style={styles.resultsCard}>
      {/* Visa Requirements Section */}
      <View style={styles.resultSection}>
        <Text style={styles.resultSectionTitle}>Visa Requirements</Text>
        
        {data.visa_required === false && (
          <View style={styles.resultItem}>
            <View style={styles.resultItemHeader}>
              <Text style={styles.resultItemTitle}>
                Visa is not required for {data.special_visas ? 'Tourism or Business' : 'your trip'} for a maximum of {data.max_stay_days} days
              </Text>
            </View>
            <TouchableOpacity style={styles.seeDetailsButton}>
              <Text style={styles.seeDetailsText}>See Details</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {data.visa_required === true && (
          <View style={styles.resultItem}>
            <View style={styles.resultItemHeader}>
              <Text style={styles.resultItemTitle}>
                Visa is required for your trip
              </Text>
            </View>
            <TouchableOpacity style={styles.seeDetailsButton}>
              <Text style={styles.seeDetailsText}>See Details</Text>
            </TouchableOpacity>
          </View>
        )}
        
        {/* Special Visas */}
        {data.special_visas && data.special_visas.map((visa: any, index: number) => (
          <View key={index} style={styles.resultItem}>
            <View style={styles.resultItemHeader}>
              <Text style={styles.resultItemTitle}>{visa.name}</Text>
            </View>
            <Text style={styles.resultItemDescription}>{visa.description}</Text>
            <TouchableOpacity style={styles.seeDetailsButton}>
              <Text style={styles.seeDetailsText}>See Details</Text>
            </TouchableOpacity>
            
            {visa.url && (
              <TouchableOpacity style={styles.applyButton}>
                <Text style={styles.applyButtonText}>Apply Online</Text>
                <ExternalLink size={16} color="white" style={styles.applyButtonIcon} />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>
      
      {/* Passport & Documents Section */}
      <View style={styles.resultSection}>
        <Text style={styles.resultSectionTitle}>Passport & Documents</Text>
        
        {data.requirements && data.requirements.map((req: any, index: number) => (
          <View key={index} style={styles.resultItem}>
            <View style={styles.resultItemHeader}>
              <Text style={styles.resultItemTitle}>{req.name}</Text>
            </View>
            <Text style={styles.resultItemDescription}>{req.description}</Text>
            <TouchableOpacity style={styles.seeDetailsButton}>
              <Text style={styles.seeDetailsText}>See Details</Text>
            </TouchableOpacity>
            
            {req.url && (
              <TouchableOpacity style={styles.applyButton}>
                <Text style={styles.applyButtonText}>Apply Online</Text>
                <ExternalLink size={16} color="white" style={styles.applyButtonIcon} />
              </TouchableOpacity>
            )}
          </View>
        ))}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: colors.primary,
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 40,
  },
  headerSection: {
    backgroundColor: colors.primary,
    paddingHorizontal: 20,
    paddingTop: 20,
    paddingBottom: 30,
    borderBottomLeftRadius: 24,
    borderBottomRightRadius: 24,
  },
  headerTitle: {
    fontSize: 28,
    fontWeight: 'bold',
    color: 'white',
    marginBottom: 8,
  },
  headerSubtitle: {
    fontSize: 16,
    color: 'rgba(255, 255, 255, 0.8)',
  },
  formCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    padding: 20,
    marginHorizontal: 16,
    marginTop: -20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  formGroup: {
    marginBottom: 16,
  },
  formLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
    color: colors.text,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: 'white',
  },
  dropdownButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dropdownButtonText: {
    fontSize: 16,
    color: colors.text,
    flex: 1,
  },
  placeholderText: {
    color: colors.textSecondary,
  },
  inputIcon: {
    marginRight: 12,
  },
  countryFlag: {
    fontSize: 20,
    marginRight: 12,
  },
  dateRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 12,
    paddingVertical: 12,
    flex: 1,
    backgroundColor: 'white',
  },
  singleDateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: 'white',
  },
  dateButtonText: {
    fontSize: 14,
    color: colors.text,
  },
  dateRangeSeparator: {
    marginHorizontal: 8,
    fontSize: 16,
    color: colors.textSecondary,
  },
  checkButton: {
    backgroundColor: colors.primary,
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginTop: 8,
  },
  checkButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 16,
    paddingBottom: 30,
    maxHeight: '80%',
  },
  simpleModalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 20,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
    color: colors.text,
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 8,
  },
  closeButton: {
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  closeButtonText: {
    color: colors.primary,
    fontSize: 16,
    fontWeight: '500',
  },
  dropdownList: {
    paddingHorizontal: 16,
  },
  dropdownItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 14,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  dropdownItemText: {
    fontSize: 16,
    color: colors.text,
  },
  simpleDropdownItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  simpleDropdownItemText: {
    fontSize: 16,
    color: colors.text,
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: 16,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: colors.lightGray,
    borderRadius: 12,
  },
  cancelButtonText: {
    color: colors.text,
    fontSize: 16,
    fontWeight: '600',
  },
  errorCard: {
    backgroundColor: colors.lightRed,
    borderRadius: 12,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  errorTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: colors.error,
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: colors.error,
    lineHeight: 20,
  },
  resultsContainer: {
    marginTop: 24,
    paddingHorizontal: 16,
  },
  resultsCard: {
    backgroundColor: 'white',
    borderRadius: 20,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.2,
    shadowRadius: 15,
    elevation: 8,
  },
  resultSection: {
    padding: 20,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  resultSectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: colors.text,
  },
  resultItem: {
    marginBottom: 16,
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  resultItemHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  resultItemTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: colors.text,
    flex: 1,
  },
  resultItemDescription: {
    fontSize: 14,
    color: colors.textSecondary,
    marginBottom: 12,
    lineHeight: 20,
  },
  seeDetailsButton: {
    alignSelf: 'flex-start',
    marginBottom: 12,
  },
  seeDetailsText: {
    color: colors.primary,
    fontSize: 14,
    fontWeight: '500',
  },
  applyButton: {
    backgroundColor: colors.primary,
    borderRadius: 8,
    paddingVertical: 10,
    paddingHorizontal: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    alignSelf: 'flex-start',
  },
  applyButtonText: {
    color: 'white',
    fontSize: 14,
    fontWeight: '600',
    marginRight: 6,
  },
  applyButtonIcon: {
    marginLeft: 4,
  },
  helpCard: {
    backgroundColor: 'white',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 24,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.2,
    shadowRadius: 12,
    elevation: 8,
  },
  helpHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  helpTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginLeft: 8,
    color: colors.text,
  },
  helpText: {
    fontSize: 14,
    color: colors.textSecondary,
    lineHeight: 20,
  },
});