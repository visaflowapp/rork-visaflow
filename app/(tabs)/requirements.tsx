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
  Animated,
  KeyboardAvoidingView,
  Platform,
  Linking,
  Alert,
} from 'react-native';
import { Stack } from 'expo-router';
import { Calendar } from 'react-native-calendars';
import { Clock, ChevronDown, Plane, PlaneTakeoff, PlaneLanding, CreditCard, ExternalLink, Info, Search, ChevronRight, CheckCircle2, AlertCircle } from 'lucide-react-native';

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
  // Animation values for focus states
  const [nationalityFocusAnim] = useState(new Animated.Value(1));
  const [tripTypeFocusAnim] = useState(new Animated.Value(1));
  const [fromFocusAnim] = useState(new Animated.Value(1));
  const [transitFocusAnim] = useState(new Animated.Value(1));
  const [toFocusAnim] = useState(new Animated.Value(1));
  const [purposeFocusAnim] = useState(new Animated.Value(1));
  const [datesFocusAnim] = useState(new Animated.Value(1));
  
  // Form state
  const [passportCountry, setPassportCountry] = useState('');
  const [tripType, setTripType] = useState('');
  const [fromCountry, setFromCountry] = useState('');
  const [transitCountry, setTransitCountry] = useState('');
  const [toCountry, setToCountry] = useState('');
  const [tripPurpose, setTripPurpose] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 7 * 24 * 60 * 60 * 1000)); // 7 days from now
  
  // UI state
  const [showPassportDropdown, setShowPassportDropdown] = useState(false);
  const [showTripTypeDropdown, setShowTripTypeDropdown] = useState(false);
  const [showFromDropdown, setShowFromDropdown] = useState(false);
  const [showTransitDropdown, setShowTransitDropdown] = useState(false);
  const [showTransitSection, setShowTransitSection] = useState(false);
  const [showToDropdown, setShowToDropdown] = useState(false);
  const [showPurposeDropdown, setShowPurposeDropdown] = useState(false);
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  
  // Focus animation helper
  const animateFocus = (animValue: Animated.Value, focused: boolean) => {
    Animated.spring(animValue, {
      toValue: focused ? 1.02 : 1,
      friction: 3,
      tension: 40,
      useNativeDriver: true,
    }).start();
  };
  
  // Calendar state
  const [calendarType, setCalendarType] = useState<'start' | 'end'>('start');
  const [markedDates, setMarkedDates] = useState<{[key: string]: any}>({});
  
  // API state
  const [isLoading, setIsLoading] = useState(false);
  const [apiResponse, setApiResponse] = useState<any>(null);
  const [error, setError] = useState<string | null>(null);
  const [showResults, setShowResults] = useState(false);
  
  // Accordion state
  const [expandedSections, setExpandedSections] = useState<{[key: string]: boolean}>({
    visaReqs: true,
    specialVisas: false,
    documents: false,
    validity: false,
  });

  // Update marked dates for calendar
  const updateMarkedDates = React.useCallback(() => {
    const startDateStr = formatDateForCalendar(startDate);
    const endDateStr = formatDateForCalendar(endDate);
    
    if (tripType === 'One Way') {
      setMarkedDates({
        [startDateStr]: { selected: true, selectedColor: '#0000EE' }
      });
    } else {
      // Create range of dates
      const range: {[key: string]: any} = {};
      let currentDate = new Date(startDate);
      const lastDate = new Date(endDate);
      
      while (currentDate <= lastDate) {
        const dateStr = formatDateForCalendar(currentDate);
        
        if (dateStr === startDateStr) {
          range[dateStr] = { selected: true, startingDay: true, color: '#0000EE' };
        } else if (dateStr === endDateStr) {
          range[dateStr] = { selected: true, endingDay: true, color: '#0000EE' };
        } else {
          range[dateStr] = { selected: true, color: '#0000EE', textColor: 'white' };
        }
        
        currentDate.setDate(currentDate.getDate() + 1);
      }
      
      setMarkedDates(range);
    }
  }, [startDate, endDate, tripType]);

  // Update marked dates when start/end dates change
  useEffect(() => {
    updateMarkedDates();
  }, [updateMarkedDates]);

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

  // Toggle accordion section
  const toggleSection = (section: string) => {
    setExpandedSections(prev => ({
      ...prev,
      [section]: !prev[section]
    }));
  };

  // Calculate compliance percentage
  const calculateCompliance = () => {
    if (!apiResponse) return 0;
    
    let total = 0;
    let completed = 0;
    
    if (apiResponse.visa_required === false) {
      completed += 1;
    }
    total += 1;
    
    if (apiResponse.requirements) {
      total += apiResponse.requirements.length;
      completed += Math.floor(apiResponse.requirements.length * 0.6);
    }
    
    return Math.round((completed / total) * 100);
  };

  // Get compliance color
  const getComplianceColor = (percentage: number) => {
    if (percentage >= 80) return '#34C759';
    if (percentage >= 50) return '#FF9500';
    return '#FF3B30';
  };

  // Check if has urgent requirement
  const hasUrgentRequirement = (requirements: any[]) => {
    return requirements.some(req => 
      req.name.includes('Mandatory') || req.name.includes('Required')
    );
  };

  // Render accordion section
  const renderAccordionSection = (
    key: string,
    title: string,
    status: 'complete' | 'warning' | 'urgent' | 'info',
    renderContent: () => React.ReactNode
  ) => {
    const isExpanded = expandedSections[key];
    
    return (
      <View style={styles.accordionSection}>
        <TouchableOpacity 
          style={styles.accordionHeader}
          onPress={() => toggleSection(key)}
          activeOpacity={0.7}
        >
          <View style={styles.accordionHeaderLeft}>
            <View style={[
              styles.statusBadge,
              status === 'complete' && styles.statusBadgeComplete,
              status === 'warning' && styles.statusBadgeWarning,
              status === 'urgent' && styles.statusBadgeUrgent,
              status === 'info' && styles.statusBadgeInfo,
            ]} />
            <Text style={styles.accordionTitle}>{title}</Text>
            {status === 'urgent' && (
              <View style={styles.urgentBadge}>
                <Text style={styles.urgentBadgeText}>!</Text>
              </View>
            )}
          </View>
          <ChevronRight 
            size={20} 
            color="#8E8E93" 
            style={[styles.chevron, isExpanded && styles.chevronExpanded]} 
          />
        </TouchableOpacity>
        
        {isExpanded && (
          <View style={styles.accordionContent}>
            {renderContent()}
          </View>
        )}
      </View>
    );
  };

  // Validate all required fields are filled
  const validateForm = () => {
    if (!passportCountry) return 'Please select your nationality';
    if (!tripType) return 'Please select trip type';
    if (!fromCountry) return 'Please select origin country';
    if (!toCountry) return 'Please select destination country';
    if (!tripPurpose) return 'Please select purpose of travel';
    if (!startDate || !endDate) return 'Please select travel dates';
    return null;
  };

  // Fetch visa requirements
  const fetchVisaRequirements = async () => {
    const validationError = validateForm();
    if (validationError) {
      Alert.alert('Complete All Fields', validationError);
      return;
    }

    setIsLoading(true);
    setError(null);
    setShowResults(false);

    try {
      await new Promise(resolve => setTimeout(resolve, 1500));
      
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
              <Search size={20} color="#8E8E93" style={styles.searchIcon} />
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
                selectedDayBackgroundColor: '#0000EE',
                todayTextColor: '#0000EE',
                arrowColor: '#0000EE',
                dotColor: '#0000EE',
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
          title: 'Global Entry Advisor',
          headerStyle: { backgroundColor: '#0000EE' },
          headerTintColor: 'white',
          headerTitleStyle: {
            fontWeight: '700',
            fontSize: 17,
          },
          headerTitleAlign: 'center',
        }} 
      />

      <ScrollView 
        style={styles.scrollView}
        contentContainerStyle={styles.scrollViewContent}
        showsVerticalScrollIndicator={false}
      >


        {/* Form Card */}
        <View style={styles.formCard}>
          <Text style={styles.sectionHeader}>TRAVEL DETAILS</Text>
          {/* Passport Country */}
          <View style={styles.formGroup}>
            <Animated.View style={[{ transform: [{ scale: nationalityFocusAnim }] }]}>
              <TouchableOpacity 
                style={styles.dropdownButton}
                onPress={() => {
                  animateFocus(nationalityFocusAnim, true);
                  setShowPassportDropdown(true);
                  setTimeout(() => animateFocus(nationalityFocusAnim, false), 150);
                }}
                activeOpacity={0.7}
              >
                <View style={styles.dropdownButtonContent}>
                  {passportCountry && <Text style={styles.countryFlag}>{getCountryFlag(passportCountry)}</Text>}
                  <Text style={[
                    styles.dropdownButtonText,
                    !passportCountry && styles.placeholderText
                  ]}>
                    {passportCountry || 'Select nationality'}
                  </Text>
                </View>
                <ChevronDown size={16} color="#0000EE" />
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Trip Type */}
          <View style={styles.formGroup}>
            <Animated.View style={[{ transform: [{ scale: tripTypeFocusAnim }] }]}>
              <TouchableOpacity 
                style={styles.dropdownButton}
                onPress={() => {
                  animateFocus(tripTypeFocusAnim, true);
                  setShowTripTypeDropdown(true);
                  setTimeout(() => animateFocus(tripTypeFocusAnim, false), 150);
                }}
                activeOpacity={0.7}
              >
                <View style={styles.dropdownButtonContent}>
                  <Plane size={16} color="#0000EE" style={styles.inputIcon} />
                  <Text style={[
                    styles.dropdownButtonText,
                    !tripType && styles.placeholderText
                  ]}>
                    {tripType || 'Select trip type'}
                  </Text>
                </View>
                <ChevronDown size={16} color="#0000EE" />
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* From Country */}
          <View style={styles.formGroup}>
            <Animated.View style={[{ transform: [{ scale: fromFocusAnim }] }]}>
              <TouchableOpacity 
                style={styles.dropdownButton}
                onPress={() => {
                  animateFocus(fromFocusAnim, true);
                  setShowFromDropdown(true);
                  setTimeout(() => animateFocus(fromFocusAnim, false), 150);
                }}
                activeOpacity={0.7}
              >
                <View style={styles.dropdownButtonContent}>
                  <PlaneTakeoff size={16} color="#0000EE" style={styles.inputIcon} />
                  <Text style={[
                    styles.dropdownButtonText,
                    !fromCountry && styles.placeholderText
                  ]}>
                    {fromCountry ? (
                      <>
                        {getCountryFlag(fromCountry)} {fromCountry}
                      </>
                    ) : (
                      'Origin country'
                    )}
                  </Text>
                </View>
                <ChevronDown size={16} color="#0000EE" />
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Transit Country (Optional, Collapsible) */}
          {!showTransitSection ? (
            <TouchableOpacity 
              style={styles.addTransitButton}
              onPress={() => setShowTransitSection(true)}
            >
              <Text style={styles.addTransitText}>+ Add Transit Country</Text>
            </TouchableOpacity>
          ) : (
            <View style={styles.formGroup}>
              <Animated.View style={[{ transform: [{ scale: transitFocusAnim }] }]}>
                <TouchableOpacity 
                  style={styles.dropdownButton}
                  onPress={() => {
                    animateFocus(transitFocusAnim, true);
                    setShowTransitDropdown(true);
                    setTimeout(() => animateFocus(transitFocusAnim, false), 150);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.dropdownButtonContent}>
                    <Plane size={16} color="#0000EE" style={styles.inputIcon} />
                    <Text style={[
                      styles.dropdownButtonText,
                      !transitCountry && styles.placeholderText
                    ]}>
                      {transitCountry ? (
                        <>
                          {getCountryFlag(transitCountry)} {transitCountry}
                        </>
                      ) : (
                        'Transit country (optional)'
                      )}
                    </Text>
                  </View>
                  <ChevronDown size={16} color="#0000EE" />
                </TouchableOpacity>
              </Animated.View>
            </View>
          )}

          {/* To Country */}
          <View style={styles.formGroup}>
            <Animated.View style={[{ transform: [{ scale: toFocusAnim }] }]}>
              <TouchableOpacity 
                style={styles.dropdownButton}
                onPress={() => {
                  animateFocus(toFocusAnim, true);
                  setShowToDropdown(true);
                  setTimeout(() => animateFocus(toFocusAnim, false), 150);
                }}
                activeOpacity={0.7}
              >
                <View style={styles.dropdownButtonContent}>
                  <PlaneLanding size={16} color="#0000EE" style={styles.inputIcon} />
                  <Text style={[
                    styles.dropdownButtonText,
                    !toCountry && styles.placeholderText
                  ]}>
                    {toCountry ? (
                      <>
                        {getCountryFlag(toCountry)} {toCountry}
                      </>
                    ) : (
                      'Destination country'
                    )}
                  </Text>
                </View>
                <ChevronDown size={16} color="#0000EE" />
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Trip Purpose */}
          <View style={styles.formGroup}>
            <Animated.View style={[{ transform: [{ scale: purposeFocusAnim }] }]}>
              <TouchableOpacity 
                style={styles.dropdownButton}
                onPress={() => {
                  animateFocus(purposeFocusAnim, true);
                  setShowPurposeDropdown(true);
                  setTimeout(() => animateFocus(purposeFocusAnim, false), 150);
                }}
                activeOpacity={0.7}
              >
                <View style={styles.dropdownButtonContent}>
                  <CreditCard size={16} color="#0000EE" style={styles.inputIcon} />
                  <Text style={[
                    styles.dropdownButtonText,
                    !tripPurpose && styles.placeholderText
                  ]}>
                    {tripPurpose || 'Select purpose'}
                  </Text>
                </View>
                <ChevronDown size={16} color="#0000EE" />
              </TouchableOpacity>
            </Animated.View>
          </View>

          {/* Date Range */}
          <View style={styles.formGroup}>
            <Animated.View style={[{ transform: [{ scale: datesFocusAnim }] }]}>
              {tripType === 'One Way' ? (
                <TouchableOpacity 
                  style={styles.singleDateButton}
                  onPress={() => {
                    animateFocus(datesFocusAnim, true);
                    setCalendarType('start');
                    setShowStartDatePicker(true);
                    setTimeout(() => animateFocus(datesFocusAnim, false), 150);
                  }}
                  activeOpacity={0.7}
                >
                  <View style={styles.dropdownButtonContent}>
                    <Clock size={16} color="#0000EE" style={styles.inputIcon} />
                    <Text style={styles.dateButtonText}>{formatDate(startDate)}</Text>
                  </View>
                </TouchableOpacity>
              ) : (
                <View style={styles.dateRangeContainer}>
                  <TouchableOpacity 
                    style={styles.dateButton}
                    onPress={() => {
                      animateFocus(datesFocusAnim, true);
                      setCalendarType('start');
                      setShowStartDatePicker(true);
                      setTimeout(() => animateFocus(datesFocusAnim, false), 150);
                    }}
                    activeOpacity={0.7}
                  >
                    <View style={styles.dropdownButtonContent}>
                      <Clock size={16} color="#0000EE" style={styles.inputIcon} />
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
                    activeOpacity={0.7}
                  >
                    <View style={styles.dropdownButtonContent}>
                      <Clock size={16} color="#0000EE" style={styles.inputIcon} />
                      <Text style={styles.dateButtonText}>{formatDate(endDate)}</Text>
                    </View>
                  </TouchableOpacity>
                </View>
              )}
            </Animated.View>
          </View>

          {/* Check Requirements Button */}
          <TouchableOpacity 
            style={styles.checkButton}
            onPress={fetchVisaRequirements}
            disabled={isLoading}
            activeOpacity={0.8}
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
        {showResults && apiResponse && (
          <>
          {/* Compliance Progress Bar */}
          <View style={styles.complianceBarContainer}>
            <View style={styles.complianceHeader}>
              <Text style={styles.complianceTitle}>Compliance Status</Text>
              <Text style={styles.compliancePercentage}>{calculateCompliance()}%</Text>
            </View>
            <View style={styles.progressBarBackground}>
              <View 
                style={[
                  styles.progressBarFill, 
                  { 
                    width: `${calculateCompliance()}%`,
                    backgroundColor: getComplianceColor(calculateCompliance())
                  }
                ]} 
              />
            </View>
          </View>

          <View style={styles.resultsContainer}>
            <View style={styles.resultsCard}>
              {/* Accordion Section: Visa Requirements */}
              {renderAccordionSection(
                'visaReqs',
                'Visa Requirements',
                apiResponse.visa_required ? 'urgent' : 'complete',
                () => (
                  <View>
                    {apiResponse.visa_required === false && (
                      <View style={styles.checklistItem}>
                        <CheckCircle2 size={18} color="#34C759" style={styles.checklistIcon} />
                        <View style={styles.checklistContent}>
                          <Text style={styles.checklistTitle}>Visa-free entry</Text>
                          <Text style={styles.checklistDesc}>Up to {apiResponse.max_stay_days} days with {passportCountry} passport</Text>
                        </View>
                      </View>
                    )}
                    
                    {apiResponse.visa_required === true && (
                      <View style={styles.checklistItem}>
                        <AlertCircle size={18} color="#FF3B30" style={styles.checklistIcon} />
                        <View style={styles.checklistContent}>
                          <Text style={styles.checklistTitle}>Visa required</Text>
                          <Text style={styles.checklistDesc}>{passportCountry} passport holders must obtain visa</Text>
                          <TouchableOpacity 
                            style={styles.inlineDetailsButton}
                            onPress={() => showDetails(
                              "Visa Requirements",
                              `${passportCountry} citizens need a visa to enter ${toCountry}. Maximum stay: ${apiResponse.max_stay_days} days.`
                            )}
                          >
                            <Text style={styles.inlineDetailsText}>See Details</Text>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>
                )
              )}
              
              {/* Accordion Section: Special Visas */}
              {apiResponse.special_visas && apiResponse.special_visas.length > 0 && renderAccordionSection(
                'specialVisas',
                'Destination Visa Options',
                'info',
                () => (
                  <View>
                    {apiResponse.special_visas.map((visa: any, index: number) => (
                      <View key={index} style={styles.checklistItem}>
                        <Info size={18} color="#007AFF" style={styles.checklistIcon} />
                        <View style={styles.checklistContent}>
                          <Text style={styles.checklistTitle}>{visa.name}</Text>
                          <Text style={styles.checklistDesc}>{visa.description}</Text>
                          <View style={styles.inlineActions}>
                            <TouchableOpacity 
                              style={styles.inlineDetailsButton}
                              onPress={() => showDetails(visa.name, visa.description)}
                            >
                              <Text style={styles.inlineDetailsText}>Details</Text>
                            </TouchableOpacity>
                            {visa.url && (
                              <TouchableOpacity 
                                style={styles.inlineApplyButton}
                                onPress={() => openExternalLink(visa.url)}
                              >
                                <Text style={styles.inlineApplyText}>Apply</Text>
                                <ExternalLink size={12} color="white" />
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                )
              )}
              
              {/* Accordion Section: Documents */}
              {apiResponse.requirements && apiResponse.requirements.length > 0 && renderAccordionSection(
                'documents',
                'Passport & Documents',
                hasUrgentRequirement(apiResponse.requirements) ? 'urgent' : 'warning',
                () => (
                  <View>
                    {apiResponse.requirements.map((req: any, index: number) => (
                      <View key={index} style={styles.checklistItem}>
                        {req.name.includes('Mandatory') || req.name.includes('Required') ? (
                          <AlertCircle size={18} color="#FF9500" style={styles.checklistIcon} />
                        ) : (
                          <CheckCircle2 size={18} color="#8E8E93" style={styles.checklistIcon} />
                        )}
                        <View style={styles.checklistContent}>
                          <Text style={styles.checklistTitle}>{req.name}</Text>
                          <Text style={styles.checklistDesc}>{req.description}</Text>
                          <View style={styles.inlineActions}>
                            <TouchableOpacity 
                              style={styles.inlineDetailsButton}
                              onPress={() => showDetails(req.name, req.description)}
                            >
                              <Text style={styles.inlineDetailsText}>Details</Text>
                            </TouchableOpacity>
                            {req.url && (
                              <TouchableOpacity 
                                style={styles.inlineApplyButton}
                                onPress={() => openExternalLink(req.url)}
                              >
                                <Text style={styles.inlineApplyText}>Complete</Text>
                                <ExternalLink size={12} color="white" />
                              </TouchableOpacity>
                            )}
                          </View>
                        </View>
                      </View>
                    ))}
                  </View>
                )
              )}
            </View>
          </View>
          </>
        )}

        {/* Help Section */}
        <View style={styles.helpCard}>
          <View style={styles.helpHeader}>
            <Info size={20} color="#007AFF" />
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
    backgroundColor: '#0000EE',
  },
  scrollView: {
    flex: 1,
  },
  scrollViewContent: {
    paddingBottom: 24,
  },
  formCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    marginTop: 16,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#0000EE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.15,
    shadowRadius: 12,
    elevation: 4,
  },
  sectionHeader: {
    fontSize: 11,
    fontWeight: '700',
    letterSpacing: 1.2,
    color: '#8E8E93',
    marginBottom: 12,
  },
  formGroup: {
    marginBottom: 12,
  },
  dropdownButton: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 0, 238, 0.15)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    shadowColor: '#0000EE',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  dropdownButtonContent: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  dropdownButtonText: {
    fontSize: 14,
    color: '#000000',
    flex: 1,
    fontWeight: '500',
  },
  placeholderText: {
    color: '#A0A0A0',
    fontWeight: '400',
  },
  inputIcon: {
    marginRight: 8,
  },
  countryFlag: {
    fontSize: 18,
    marginRight: 10,
  },
  addTransitButton: {
    paddingVertical: 10,
    paddingHorizontal: 12,
    marginBottom: 12,
    borderRadius: 8,
    borderWidth: 1.5,
    borderColor: 'rgba(0, 0, 238, 0.2)',
    borderStyle: 'dashed',
    backgroundColor: 'rgba(0, 0, 238, 0.03)',
  },
  addTransitText: {
    fontSize: 13,
    color: '#0000EE',
    fontWeight: '500',
    textAlign: 'center',
  },
  dateRangeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  dateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 0, 238, 0.15)',
    borderRadius: 8,
    paddingHorizontal: 10,
    paddingVertical: 10,
    flex: 1,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    shadowColor: '#0000EE',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  singleDateButton: {
    flexDirection: 'row',
    alignItems: 'center',
    borderWidth: 1.5,
    borderColor: 'rgba(0, 0, 238, 0.15)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.7)',
    shadowColor: '#0000EE',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 2,
    elevation: 1,
  },
  dateButtonText: {
    fontSize: 13,
    color: '#000000',
    fontWeight: '500',
  },
  dateRangeSeparator: {
    marginHorizontal: 6,
    fontSize: 14,
    color: '#8E8E93',
    fontWeight: '500',
  },
  checkButton: {
    backgroundColor: '#0000EE',
    borderRadius: 8,
    paddingVertical: 13,
    alignItems: 'center',
    marginTop: 8,
    shadowColor: '#0000EE',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 3,
  },
  checkButtonText: {
    color: 'white',
    fontSize: 15,
    fontWeight: '700',
    letterSpacing: 0.5,
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
    color: '#000000',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
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
    color: '#0000EE',
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
    borderBottomColor: '#E5E5EA',
  },
  dropdownItemText: {
    fontSize: 16,
    color: '#000000',
  },
  simpleDropdownItem: {
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  simpleDropdownItemText: {
    fontSize: 16,
    color: '#000000',
    textAlign: 'center',
  },
  cancelButton: {
    marginTop: 16,
    paddingVertical: 16,
    alignItems: 'center',
    backgroundColor: '#F2F2F7',
    borderRadius: 12,
  },
  cancelButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
  },
  errorCard: {
    backgroundColor: '#FFEEEE',
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
    color: '#FF3B30',
    marginBottom: 8,
  },
  errorMessage: {
    fontSize: 14,
    color: '#FF3B30',
    lineHeight: 20,
  },
  complianceBarContainer: {
    marginHorizontal: 16,
    marginTop: 16,
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 12,
    padding: 12,
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
  },
  complianceHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  complianceTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
  },
  compliancePercentage: {
    fontSize: 15,
    fontWeight: '700',
    color: '#0000EE',
  },
  progressBarBackground: {
    height: 6,
    backgroundColor: '#E5E5EA',
    borderRadius: 3,
    overflow: 'hidden',
  },
  progressBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  resultsContainer: {
    marginTop: 12,
    paddingHorizontal: 16,
  },
  resultsCard: {
    backgroundColor: 'rgba(255, 255, 255, 0.95)',
    borderRadius: 16,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255, 255, 255, 0.3)',
    shadowColor: '#0000EE',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.1,
    shadowRadius: 8,
    elevation: 3,
  },
  accordionSection: {
    borderBottomWidth: 1,
    borderBottomColor: '#E5E5EA',
  },
  accordionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 14,
    paddingHorizontal: 16,
    backgroundColor: 'transparent',
  },
  accordionHeaderLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  statusBadge: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginRight: 10,
  },
  statusBadgeComplete: {
    backgroundColor: '#34C759',
  },
  statusBadgeWarning: {
    backgroundColor: '#FF9500',
  },
  statusBadgeUrgent: {
    backgroundColor: '#FF3B30',
  },
  statusBadgeInfo: {
    backgroundColor: '#007AFF',
  },
  accordionTitle: {
    fontSize: 15,
    fontWeight: '700',
    color: '#000000',
    flex: 1,
  },
  urgentBadge: {
    backgroundColor: '#FF3B30',
    width: 18,
    height: 18,
    borderRadius: 9,
    justifyContent: 'center',
    alignItems: 'center',
    marginLeft: 8,
  },
  urgentBadgeText: {
    color: 'white',
    fontSize: 12,
    fontWeight: '700',
  },
  chevron: {
    marginLeft: 8,
  },
  chevronExpanded: {
    transform: [{ rotate: '90deg' }],
  },
  accordionContent: {
    paddingHorizontal: 16,
    paddingBottom: 12,
  },
  checklistItem: {
    flexDirection: 'row',
    marginBottom: 12,
    paddingBottom: 12,
    borderBottomWidth: 1,
    borderBottomColor: '#F2F2F7',
  },
  checklistIcon: {
    marginRight: 10,
    marginTop: 2,
  },
  checklistContent: {
    flex: 1,
  },
  checklistTitle: {
    fontSize: 13,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 3,
  },
  checklistDesc: {
    fontSize: 12,
    color: '#8E8E93',
    lineHeight: 16,
    marginBottom: 6,
  },
  inlineActions: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  inlineDetailsButton: {
    marginRight: 10,
  },
  inlineDetailsText: {
    color: '#0000EE',
    fontSize: 12,
    fontWeight: '500',
  },
  inlineApplyButton: {
    backgroundColor: '#0000EE',
    borderRadius: 6,
    paddingVertical: 4,
    paddingHorizontal: 10,
    flexDirection: 'row',
    alignItems: 'center',
  },
  inlineApplyText: {
    color: 'white',
    fontSize: 11,
    fontWeight: '600',
    marginRight: 4,
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
    marginBottom: 10,
  },
  helpTitle: {
    fontSize: 16,
    fontWeight: '700',
    marginLeft: 8,
    color: '#000000',
  },
  helpText: {
    fontSize: 13,
    color: '#8E8E93',
    lineHeight: 18,
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
    borderBottomColor: '#E5E5EA',
  },
  calendarTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#000000',
  },
  calendarCloseText: {
    fontSize: 16,
    color: '#0000EE',
    fontWeight: '600',
  },
  calendar: {
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    backgroundColor: 'white',
    height: 350,
  },
});