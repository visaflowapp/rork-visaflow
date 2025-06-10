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
  Platform,
  Linking,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { Calendar } from 'react-native-calendars';
import { Clock, ChevronDown, Plane, PlaneTakeoff, PlaneLanding, CreditCard, ExternalLink, Info, Search } from 'lucide-react-native';
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
  const [toCountry, setToCountry] = useState('Thailand');
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
  
  // Calendar state
  const [calendarType, setCalendarType] = useState<'start' | 'end'>('start');
  const [markedDates, setMarkedDates] = useState<{[key: string]: any}>({});
  
  // API state
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);

  // Update marked dates when start/end dates change
  useEffect(() => {
    updateMarkedDates();
  }, [startDate, endDate, tripType]);

  // Update marked dates for calendar
  const updateMarkedDates = () => {
    const startDateStr = formatDateForCalendar(startDate);
    const endDateStr = formatDateForCalendar(endDate);
    
    if (tripType === 'One Way') {
      setMarkedDates({
        [startDateStr]: { selected: true, selectedColor: colors.primary }
      });
    } else {
      // Create range of dates
      const range: {[key: string]: any} = {};
      let currentDate = new Date(startDate);
      const lastDate = new Date(endDate);
      
      while (currentDate <= lastDate) {
        const dateStr = formatDateForCalendar(currentDate);
        
        if (dateStr === startDateStr) {
          range[dateStr] = { selected: true, startingDay: true, color: colors.primary };
        } else if (dateStr === endDateStr) {
          range[dateStr] = { selected: true, endingDay: true, color: colors.primary };
        } else {
          range[dateStr] = { selected: true, color: colors.primary, textColor: 'white' };
        }
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      setMarkedDates(range);
    }
  };

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

  // Format date for calendar (YYYY-MM-DD)
  const formatDateForCalendar = (date: Date) => {
    return date.toISOString().split('T')[0];
  };

  // Handle calendar day press
  const handleDayPress = (day: any) => {
    const selectedDate = new Date(day.dateString);
    
    if (calendarType === 'start') {
      setStartDate(selectedDate);
      
      // If end date is before start date, update it
      if (endDate < selectedDate) {
        const newEndDate = new Date(selectedDate);
        newEndDate.setDate(newEndDate.getDate() + 7);
        setEndDate(newEndDate);
      }
      
      if (tripType === 'One Way') {
        setShowStartDatePicker(false);
      } else {
        // For round trip, switch to end date selection
        setCalendarType('end');
      }
    } else {
      // End date selection
      if (selectedDate >= startDate) {
        setEndDate(selectedDate);
        setShowEndDatePicker(false);
      }
    }
  };

  // Open external URL
  const openExternalLink = async (url: string) => {
    if (!url) {
      Alert.alert("Link Not Available", "The application link is not available at this time.");
      return;
    }
    
    try {
      const canOpen = await Linking.canOpenURL(url);
      if (canOpen) {
        await Linking.openURL(url);
      } else {
        console.error("Cannot open URL:", url);
        Alert.alert("Cannot Open Link", "The link cannot be opened. Please try visiting the official website directly.");
      }
    } catch (error) {
      console.error("Error opening URL:", error);
      Alert.alert("Error", "There was an error opening the link. Please try again later.");
    }
  };

  // Show details in an alert
  const showDetails = (title: string, description: string) => {
    Alert.alert(title, description);
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
      // In a real app, you would make an actual API call here with the user's input
      // For example:
      // const response = await fetch(`/api/v1/visa/requirements/${passportCountry}/${toCountry}`, {
      //   method: 'GET',
      //   headers: { 'Content-Type': 'application/json' },
      // });
      // const data = await response.json();
      
      // For demo purposes, we'll use dynamic mock data based on user input
      await new Promise(resolve => setTimeout(resolve, 1000)); // Simulate API delay
      
      const mockData = getMockVisaData(passportCountry, toCountry, tripPurpose);
      setApiResponse(mockData);
      setShowResults(true);
      
    } catch (err: unknown) {
      const errorObj = err instanceof Error ? err : new Error(String(err));
      setError(errorObj.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Dynamic mock data based on user input
  const getMockVisaData = (from: string, to: string, purpose: string) => {
    // Different responses based on destination country
    if (to === 'Thailand') {
      return {
        visa_required: false,
        max_stay_days: 60,
        visa_on_arrival: false,
        evisa_available: true,
        special_visas: [
          {
            name: "Destination Thailand Visa (DTV)",
            description: "Available for remote workers and long term travelers",
            url: "https://www.thaievisa.go.th"
          }
        ],
        requirements: [
          {
            name: "Mandatory Digital Arrival Card",
            description: "Must be completed before arrival",
            url: "https://tdac.immigration.go.th"
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
    } else if (to === 'Indonesia') {
      return {
        visa_required: purpose === 'Digital Nomad',
        max_stay_days: purpose === 'Tourism' ? 30 : 60,
        visa_on_arrival: true,
        evisa_available: true,
        special_visas: [
          {
            name: "B211A Visa",
            description: "For digital nomads and remote workers staying up to 60 days",
            url: "https://imigrasi.go.id"
          }
        ],
        requirements: [
          {
            name: "Electronic Customs Declaration",
            description: "Must be completed before arrival",
            url: "https://ecd.beacukai.go.id"
          },
          {
            name: "Passport Validity",
            description: "Passport must be valid for at least 6 months from the time of entry",
            url: null
          },
          {
            name: "Return Ticket",
            description: "Proof of onward travel is required",
            url: null
          },
          {
            name: "Sufficient Funds",
            description: "Proof of $1,500 USD for the duration of stay",
            url: null
          }
        ]
      };
    } else if (to === 'Vietnam') {
      return {
        visa_required: true,
        max_stay_days: 30,
        visa_on_arrival: true,
        evisa_available: true,
        special_visas: [
          {
            name: "E-Visa",
            description: "Available for tourists and business travelers for up to 30 days",
            url: "https://evisa.gov.vn"
          }
        ],
        requirements: [
          {
            name: "Visa Application",
            description: "Must be completed online before arrival",
            url: "https://evisa.gov.vn"
          },
          {
            name: "Passport Validity",
            description: "Passport must be valid for at least 6 months from the time of entry",
            url: null
          },
          {
            name: "Passport Photos",
            description: "Two recent passport-sized photos",
            url: null
          },
          {
            name: "Proof of Accommodation",
            description: "Hotel bookings or address of stay in Vietnam",
            url: null
          }
        ]
      };
    } else {
      // Default response for other countries
      return {
        visa_required: true,
        max_stay_days: 30,
        visa_on_arrival: false,
        evisa_available: false,
        special_visas: [],
        requirements: [
          {
            name: "Passport Validity",
            description: "Passport must be valid for at least 6 months from the time of entry",
            url: null
          },
          {
            name: "Visa Application",
            description: "Contact the embassy or consulate for specific requirements",
            url: null
          }
        ]
      };
    }
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

  // Render calendar modal
  const renderCalendarModal = (
    visible: boolean,
    onClose: () => void,
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
          <View style={styles.calendarModalContent}>
            <View style={styles.calendarHeader}>
              <Text style={styles.calendarTitle}>{title}</Text>
              <TouchableOpacity onPress={onClose}>
                <Text style={styles.calendarCloseText}>Done</Text>
              </TouchableOpacity>
            </View>
            
            <Calendar
              current={calendarType === 'start' ? formatDateForCalendar(startDate) : formatDateForCalendar(endDate)}
              minDate={calendarType === 'end' ? formatDateForCalendar(startDate) : formatDateForCalendar(new Date())}
              onDayPress={handleDayPress}
              markedDates={markedDates}
              markingType={tripType === 'Round Trip' ? 'period' : 'dot'}
              theme={{
                selectedDayBackgroundColor: colors.primary,
                todayTextColor: colors.primary,
                arrowColor: colors.primary,
                dotColor: colors.primary,
                textDayFontWeight: '500',
                textMonthFontWeight: 'bold',
                textDayHeaderFontWeight: '500',
                textSectionTitleColor: '#000',
                textDayFontSize: 16,
                textMonthFontSize: 16,
                textDayHeaderFontSize: 14
              }}
              style={styles.calendar}
            />
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
              {tripType === 'One Way' ? 'Select Departure Date' : 'Select Travel Dates'}
            </Text>
            
            {tripType === 'One Way' ? (
              <TouchableOpacity 
                style={styles.singleDateButton}
                onPress={() => {
                  setCalendarType('start');
                  setShowStartDatePicker(true);
                }}
              >
                <View style={styles.dropdownButtonContent}>
                  <Clock size={20} color={colors.primary} style={styles.inputIcon} />
                  <Text style={styles.dateButtonText}>{formatDate(startDate)}</Text>
                </View>
              </TouchableOpacity>
            ) : (
              <View style={styles.dateRangeContainer}>
                <TouchableOpacity 
                  style={styles.dateButton}
                  onPress={() => {
                    setCalendarType('start');
                    setShowStartDatePicker(true);
                  }}
                >
                  <View style={styles.dropdownButtonContent}>
                    <Clock size={20} color={colors.primary} style={styles.inputIcon} />
                    <Text style={styles.dateButtonText}>{formatDate(startDate)}</Text>
                  </View>
                </TouchableOpacity>
                
                <Text style={styles.dateRangeSeparator}>—</Text>
                
                <TouchableOpacity 
                  style={styles.dateButton}
                  onPress={() => {
                    setCalendarType('end');
                    setShowEndDatePicker(true);
                  }}
                >
                  <View style={styles.dropdownButtonContent}>
                    <Clock size={20} color={colors.primary} style={styles.inputIcon} />
                    <Text style={styles.dateButtonText}>{formatDate(endDate)}</Text>
                  </View>
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
            <View style={styles.resultsCard}>
              {/* Visa Requirements Section */}
              <View style={styles.resultSection}>
                <Text style={styles.resultSectionTitle}>Visa Requirements</Text>
                
                {/* Visa Not Required Card */}
                {apiResponse.visa_required === false && (
                  <View style={styles.resultItem}>
                    <View style={styles.resultItemHeader}>
                      <Text style={styles.resultItemTitle}>
                        Visa not required for up to {apiResponse.max_stay_days} days
                      </Text>
                    </View>
                    <Text style={styles.resultItemDescription}>
                      You don't need a visa for {toCountry} if you have a {passportCountry} passport.
                    </Text>
                    <TouchableOpacity 
                      style={styles.seeDetailsButton}
                      onPress={() => showDetails(
                        "Visa Details",
                        `${passportCountry} citizens can stay in ${toCountry} for up to ${apiResponse.max_stay_days} days without a visa.`
                      )}
                    >
                      <Text style={styles.seeDetailsText}>See Details</Text>
                    </TouchableOpacity>
                  </View>
                )}
                
                {/* Visa Required Card */}
                {apiResponse.visa_required === true && (
                  <View style={styles.resultItem}>
                    <View style={styles.resultItemHeader}>
                      <Text style={styles.resultItemTitle}>
                        Visa is required for your trip
                      </Text>
                    </View>
                    <Text style={styles.resultItemDescription}>
                      {passportCountry} passport holders need a visa to enter {toCountry}.
                    </Text>
                    <TouchableOpacity 
                      style={styles.seeDetailsButton}
                      onPress={() => showDetails(
                        "Visa Requirements",
                        `${passportCountry} citizens need a visa to enter ${toCountry}. Maximum stay: ${apiResponse.max_stay_days} days.`
                      )}
                    >
                      <Text style={styles.seeDetailsText}>See Details</Text>
                    </TouchableOpacity>
                  </View>
                )}
                
                {/* Special Visas */}
                {apiResponse.special_visas && apiResponse.special_visas.map((visa: any, index: number) => (
                  <View key={index} style={styles.resultItem}>
                    <View style={styles.resultItemHeader}>
                      <Text style={styles.resultItemTitle}>{visa.name}</Text>
                    </View>
                    <Text style={styles.resultItemDescription}>{visa.description}</Text>
                    <TouchableOpacity 
                      style={styles.seeDetailsButton}
                      onPress={() => showDetails(visa.name, visa.description)}
                    >
                      <Text style={styles.seeDetailsText}>See Details</Text>
                    </TouchableOpacity>
                    
                    {visa.url && (
                      <TouchableOpacity 
                        style={styles.applyButton}
                        onPress={() => openExternalLink(visa.url)}
                      >
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
                
                {apiResponse.requirements && apiResponse.requirements.map((req: any, index: number) => (
                  <View key={index} style={styles.resultItem}>
                    <View style={styles.resultItemHeader}>
                      <Text style={styles.resultItemTitle}>{req.name}</Text>
                    </View>
                    <Text style={styles.resultItemDescription}>{req.description}</Text>
                    <TouchableOpacity 
                      style={styles.seeDetailsButton}
                      onPress={() => showDetails(req.name, req.description)}
                    >
                      <Text style={styles.seeDetailsText}>See Details</Text>
                    </TouchableOpacity>
                    
                    {req.url && (
                      <TouchableOpacity 
                        style={styles.applyButton}
                        onPress={() => openExternalLink(req.url)}
                      >
                        <Text style={styles.applyButtonText}>Apply Online</Text>
                        <ExternalLink size={16} color="white" style={styles.applyButtonIcon} />
                      </TouchableOpacity>
                    )}
                  </View>
                ))}
                
                {/* Fallback if no requirements are provided */}
                {(!apiResponse.requirements || apiResponse.requirements.length === 0) && (
                  <View style={styles.resultItem}>
                    <Text style={styles.resultItemDescription}>
                      No specific document requirements found. Please check with the embassy or consulate for the most up-to-date information.
                    </Text>
                  </View>
                )}
              </View>
            </View>
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

      {/* Calendar Modal */}
      {renderCalendarModal(
        showStartDatePicker || showEndDatePicker,
        () => {
          setShowStartDatePicker(false);
          setShowEndDatePicker(false);
        },
        calendarType === 'start' 
          ? (tripType === 'One Way' ? 'Select Departure Date' : 'Select Start Date')
          : 'Select End Date'
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

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#007AFF',
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
  calendarModalContent: {
    backgroundColor: 'white',
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    padding: 16,
    paddingBottom: 30,
  },
  calendarHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
    paddingBottom: 8,
    borderBottomWidth: 1,
    borderBottomColor: colors.border,
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: colors.text,
  },
  calendarCloseText: {
    fontSize: 16,
    color: colors.primary,
    fontWeight: '600',
  },
  calendar: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: 'white',
    height: 350,
  },
});