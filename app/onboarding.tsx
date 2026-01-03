import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Animated,
  ScrollView,
  Platform,
} from 'react-native';
import { useRouter } from 'expo-router';
import { ChevronLeft, ChevronRight } from 'lucide-react-native';
import * as Haptics from 'expo-haptics';
import Colors from '@/constants/colors';
import { useVisaStore } from '@/store/visaStore';
import SimpleDropdown from '@/components/SimpleDropdown';
import { getCountryFlag } from '@/utils/countryFlags';



interface OnboardingData {
  nationality: string;
  travelStyle: string;
  hasMultiplePassports: boolean;
  secondNationality: string;
  primaryResidency: string;
  passportExpiry: string;
  secondPassportExpiry: string;
  typicalTripLength: string;
  frequentSpecialDestinations: string;
  preferredAlertTiming: number;
  hasUpcomingTrips: boolean;
}

const COUNTRIES = [
  'United States', 'Canada', 'United Kingdom', 'Australia', 'Germany', 'France',
  'Italy', 'Spain', 'Netherlands', 'Belgium', 'Switzerland', 'Austria',
  'Sweden', 'Norway', 'Denmark', 'Finland', 'Ireland', 'Portugal',
  'Greece', 'Poland', 'Czech Republic', 'Hungary', 'Romania', 'Bulgaria',
  'Japan', 'South Korea', 'China', 'India', 'Singapore', 'Malaysia',
  'Thailand', 'Indonesia', 'Philippines', 'Vietnam', 'Brazil', 'Mexico',
  'Argentina', 'Chile', 'Colombia', 'Peru', 'South Africa', 'Egypt',
  'Nigeria', 'Kenya', 'Morocco', 'Israel', 'Turkey', 'Russia', 'Ukraine',
  'New Zealand',
];

export default function OnboardingScreen() {
  const router = useRouter();
  const { updateProfile, completeOnboarding } = useVisaStore();
  const [currentStep, setCurrentStep] = useState<number>(0);
  const [showConfetti, setShowConfetti] = useState<boolean>(false);
  const slideAnim = useRef(new Animated.Value(0)).current;
  const fadeAnim = useRef(new Animated.Value(1)).current;
  const progressAnim = useRef(new Animated.Value(0)).current;

  const [data, setData] = useState<OnboardingData>({
    nationality: '',
    travelStyle: '',
    hasMultiplePassports: false,
    secondNationality: '',
    primaryResidency: '',
    passportExpiry: '',
    secondPassportExpiry: '',
    typicalTripLength: '',
    frequentSpecialDestinations: '',
    preferredAlertTiming: 14,
    hasUpcomingTrips: false,
  });

  const [month, setMonth] = useState<string>('');
  const [year, setYear] = useState<string>('');
  const [secondMonth, setSecondMonth] = useState<string>('');
  const [secondYear, setSecondYear] = useState<string>('');

  const TRAVEL_STYLES = [
    'Digital Nomad/Long-term',
    'Expat',
    'Business Traveler',
    'Tourist/Vacationer',
    'Other',
  ];

  const TRIP_LENGTHS = [
    '<1 month',
    '1-3 months',
    '3-6 months',
    '6+ months',
  ];

  const MONTHS = ['01', '02', '03', '04', '05', '06', '07', '08', '09', '10', '11', '12'];
  const YEARS = Array.from({ length: 15 }, (_, i) => (new Date().getFullYear() + i).toString());

  const totalSteps = data.hasMultiplePassports ? 11 : 9;

  useEffect(() => {
    Animated.timing(progressAnim, {
      toValue: (currentStep + 1) / totalSteps,
      duration: 300,
      useNativeDriver: false,
    }).start();
  }, [currentStep, totalSteps, progressAnim]);

  const animateTransition = (direction: 'forward' | 'back') => {
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 0,
        duration: 200,
        useNativeDriver: true,
      }),
      Animated.timing(slideAnim, {
        toValue: direction === 'forward' ? -50 : 50,
        duration: 200,
        useNativeDriver: true,
      }),
    ]).start(() => {
      slideAnim.setValue(direction === 'forward' ? 50 : -50);
      Animated.parallel([
        Animated.timing(fadeAnim, {
          toValue: 1,
          duration: 300,
          useNativeDriver: true,
        }),
        Animated.timing(slideAnim, {
          toValue: 0,
          duration: 300,
          useNativeDriver: true,
        }),
      ]).start();
    });
  };

  const handleNext = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (currentStep === 1 && !data.hasMultiplePassports) {
      animateTransition('forward');
      setCurrentStep(3);
    } else if (currentStep === 4 && !data.hasMultiplePassports) {
      animateTransition('forward');
      setCurrentStep(5);
    } else {
      animateTransition('forward');
      setCurrentStep(currentStep + 1);
    }
  };

  const handleBack = () => {
    if (Platform.OS !== 'web') {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Light);
    }
    
    if (currentStep === 3 && !data.hasMultiplePassports) {
      animateTransition('back');
      setCurrentStep(1);
    } else if (currentStep === 5 && !data.hasMultiplePassports) {
      animateTransition('back');
      setCurrentStep(4);
    } else if (currentStep > 0) {
      animateTransition('back');
      setCurrentStep(currentStep - 1);
    }
  };

  const handleFinish = () => {
    const expiryDate = month && year ? `${month}/${year}` : '';
    const secondExpiryDate = secondMonth && secondYear ? `${secondMonth}/${secondYear}` : '';

    updateProfile({
      nationality: data.nationality,
      travelStyle: data.travelStyle,
      hasMultiplePassports: data.hasMultiplePassports,
      secondNationality: data.secondNationality,
      primaryResidency: data.primaryResidency,
      passportExpiry: expiryDate,
      secondPassportExpiry: secondExpiryDate,
      typicalTripLength: data.typicalTripLength,
      frequentSpecialDestinations: data.frequentSpecialDestinations,
      preferredAlertTiming: data.preferredAlertTiming,
      hasUpcomingTrips: data.hasUpcomingTrips,
    });

    completeOnboarding();
    setShowConfetti(true);

    setTimeout(() => {
      router.replace('/(tabs)');
    }, 2000);
  };

  const canProceed = (): boolean => {
    switch (currentStep) {
      case 0:
        return data.nationality !== '';
      case 1:
        return data.hasMultiplePassports !== undefined;
      case 2:
        return data.secondNationality !== '';
      case 3:
        return data.primaryResidency !== '';
      case 4:
        return month !== '' && year !== '';
      case 5:
        return secondMonth !== '' && secondYear !== '';
      case 6:
        return data.travelStyle !== '';
      case 7:
        return data.typicalTripLength !== '';
      case 8:
        return data.frequentSpecialDestinations !== '';
      case 9:
        return data.preferredAlertTiming > 0;
      case 10:
        return data.hasUpcomingTrips !== undefined;
      default:
        return false;
    }
  };

  const renderQuestion = () => {
    const animStyle = {
      opacity: fadeAnim,
      transform: [{ translateX: slideAnim }],
    };

    if (currentStep === 0) {
      return (
        <Animated.View style={[styles.questionContainer, animStyle]}>
          <Text style={styles.questionTitle}>Where are you from?</Text>
          <Text style={styles.questionSubtitle}>Select your nationality</Text>
          <SimpleDropdown
            options={COUNTRIES.map(c => ({ label: `${getCountryFlag(c)} ${c}`, value: c }))}
            selectedValue={data.nationality}
            onSelect={(value) => setData({ ...data, nationality: value })}
            placeholder="Choose your country"
          />
        </Animated.View>
      );
    }

    if (currentStep === 1) {
      return (
        <Animated.View style={[styles.questionContainer, animStyle]}>
          <Text style={styles.questionTitle}>Do you hold multiple passports?</Text>
          <Text style={styles.questionSubtitle}>This helps us give you accurate visa advice</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.optionButton, data.hasMultiplePassports === true && styles.optionButtonSelected]}
              onPress={() => setData({ ...data, hasMultiplePassports: true })}
            >
              <Text style={[styles.optionButtonText, data.hasMultiplePassports === true && styles.optionButtonTextSelected]}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionButton, data.hasMultiplePassports === false && styles.optionButtonSelected]}
              onPress={() => setData({ ...data, hasMultiplePassports: false })}
            >
              <Text style={[styles.optionButtonText, data.hasMultiplePassports === false && styles.optionButtonTextSelected]}>No</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      );
    }

    if (currentStep === 2) {
      return (
        <Animated.View style={[styles.questionContainer, animStyle]}>
          <Text style={styles.questionTitle}>What&apos;s your second nationality?</Text>
          <Text style={styles.questionSubtitle}>Select your second passport</Text>
          <SimpleDropdown
            options={COUNTRIES.map(c => ({ label: `${getCountryFlag(c)} ${c}`, value: c }))}
            selectedValue={data.secondNationality}
            onSelect={(value) => setData({ ...data, secondNationality: value })}
            placeholder="Choose your second country"
          />
        </Animated.View>
      );
    }

    if (currentStep === 3) {
      return (
        <Animated.View style={[styles.questionContainer, animStyle]}>
          <Text style={styles.questionTitle}>Where&apos;s your home base?</Text>
          <Text style={styles.questionSubtitle}>Your primary country of residence</Text>
          <SimpleDropdown
            options={COUNTRIES.map(c => ({ label: `${getCountryFlag(c)} ${c}`, value: c }))}
            selectedValue={data.primaryResidency}
            onSelect={(value) => setData({ ...data, primaryResidency: value })}
            placeholder="Choose your residence"
          />
        </Animated.View>
      );
    }

    if (currentStep === 4) {
      return (
        <Animated.View style={[styles.questionContainer, animStyle]}>
          <Text style={styles.questionTitle}>When does your primary passport expire?</Text>
          <Text style={styles.questionSubtitle}>Most countries require 6 months validity</Text>
          <View style={styles.datePickerRow}>
            <View style={styles.datePickerHalf}>
              <Text style={styles.datePickerLabel}>Month</Text>
              <SimpleDropdown
                options={MONTHS.map(m => ({ label: m, value: m }))}
                selectedValue={month}
                onSelect={setMonth}
                placeholder="MM"
              />
            </View>
            <View style={styles.datePickerHalf}>
              <Text style={styles.datePickerLabel}>Year</Text>
              <SimpleDropdown
                options={YEARS.map(y => ({ label: y, value: y }))}
                selectedValue={year}
                onSelect={setYear}
                placeholder="YYYY"
              />
            </View>
          </View>
        </Animated.View>
      );
    }

    if (currentStep === 5) {
      return (
        <Animated.View style={[styles.questionContainer, animStyle]}>
          <Text style={styles.questionTitle}>When does your second passport expire?</Text>
          <Text style={styles.questionSubtitle}>We&apos;ll remind you before it&apos;s too late</Text>
          <View style={styles.datePickerRow}>
            <View style={styles.datePickerHalf}>
              <Text style={styles.datePickerLabel}>Month</Text>
              <SimpleDropdown
                options={MONTHS.map(m => ({ label: m, value: m }))}
                selectedValue={secondMonth}
                onSelect={setSecondMonth}
                placeholder="MM"
              />
            </View>
            <View style={styles.datePickerHalf}>
              <Text style={styles.datePickerLabel}>Year</Text>
              <SimpleDropdown
                options={YEARS.map(y => ({ label: y, value: y }))}
                selectedValue={secondYear}
                onSelect={setSecondYear}
                placeholder="YYYY"
              />
            </View>
          </View>
        </Animated.View>
      );
    }

    if (currentStep === 6) {
      return (
        <Animated.View style={[styles.questionContainer, animStyle]}>
          <Text style={styles.questionTitle}>How would you describe your travel style?</Text>
          <Text style={styles.questionSubtitle}>This helps us personalize your experience</Text>
          <View style={styles.optionsColumn}>
            {TRAVEL_STYLES.map((style) => (
              <TouchableOpacity
                key={style}
                style={[styles.optionCard, data.travelStyle === style && styles.optionCardSelected]}
                onPress={() => setData({ ...data, travelStyle: style })}
              >
                <Text style={[styles.optionCardText, data.travelStyle === style && styles.optionCardTextSelected]}>{style}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      );
    }

    if (currentStep === 7) {
      return (
        <Animated.View style={[styles.questionContainer, animStyle]}>
          <Text style={styles.questionTitle}>How long are your typical trips?</Text>
          <Text style={styles.questionSubtitle}>We&apos;ll customize alerts based on your travel patterns</Text>
          <View style={styles.optionsColumn}>
            {TRIP_LENGTHS.map((length) => (
              <TouchableOpacity
                key={length}
                style={[styles.optionCard, data.typicalTripLength === length && styles.optionCardSelected]}
                onPress={() => setData({ ...data, typicalTripLength: length })}
              >
                <Text style={[styles.optionCardText, data.typicalTripLength === length && styles.optionCardTextSelected]}>{length}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </Animated.View>
      );
    }

    if (currentStep === 8) {
      return (
        <Animated.View style={[styles.questionContainer, animStyle]}>
          <Text style={styles.questionTitle}>Do you frequently visit Schengen or Indonesia?</Text>
          <Text style={styles.questionSubtitle}>These regions have special visa rules we can help with</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.optionButton, data.frequentSpecialDestinations === 'Yes' && styles.optionButtonSelected]}
              onPress={() => setData({ ...data, frequentSpecialDestinations: 'Yes' })}
            >
              <Text style={[styles.optionButtonText, data.frequentSpecialDestinations === 'Yes' && styles.optionButtonTextSelected]}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionButton, data.frequentSpecialDestinations === 'No' && styles.optionButtonSelected]}
              onPress={() => setData({ ...data, frequentSpecialDestinations: 'No' })}
            >
              <Text style={[styles.optionButtonText, data.frequentSpecialDestinations === 'No' && styles.optionButtonTextSelected]}>No</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionButton, data.frequentSpecialDestinations === 'Not sure' && styles.optionButtonSelected]}
              onPress={() => setData({ ...data, frequentSpecialDestinations: 'Not sure' })}
            >
              <Text style={[styles.optionButtonText, data.frequentSpecialDestinations === 'Not sure' && styles.optionButtonTextSelected]}>Not sure</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      );
    }

    if (currentStep === 9) {
      return (
        <Animated.View style={[styles.questionContainer, animStyle]}>
          <Text style={styles.questionTitle}>When should we alert you about expiring visas?</Text>
          <Text style={styles.questionSubtitle}>We&apos;ll send reminders to keep you safe</Text>
          <View style={styles.optionsColumn}>
            <TouchableOpacity
              style={[styles.optionCard, data.preferredAlertTiming === 14 && styles.optionCardSelected]}
              onPress={() => setData({ ...data, preferredAlertTiming: 14 })}
            >
              <Text style={[styles.optionCardText, data.preferredAlertTiming === 14 && styles.optionCardTextSelected]}>14 days before</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionCard, data.preferredAlertTiming === 7 && styles.optionCardSelected]}
              onPress={() => setData({ ...data, preferredAlertTiming: 7 })}
            >
              <Text style={[styles.optionCardText, data.preferredAlertTiming === 7 && styles.optionCardTextSelected]}>7 days before</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionCard, data.preferredAlertTiming === 21 && styles.optionCardSelected]}
              onPress={() => setData({ ...data, preferredAlertTiming: 21 })}
            >
              <Text style={[styles.optionCardText, data.preferredAlertTiming === 21 && styles.optionCardTextSelected]}>Both (7 & 14 days)</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      );
    }

    if (currentStep === 10) {
      return (
        <Animated.View style={[styles.questionContainer, animStyle]}>
          <Text style={styles.questionTitle}>Do you have any upcoming trips?</Text>
          <Text style={styles.questionSubtitle}>We can help you track them right away</Text>
          <View style={styles.buttonGroup}>
            <TouchableOpacity
              style={[styles.optionButton, data.hasUpcomingTrips === true && styles.optionButtonSelected]}
              onPress={() => setData({ ...data, hasUpcomingTrips: true })}
            >
              <Text style={[styles.optionButtonText, data.hasUpcomingTrips === true && styles.optionButtonTextSelected]}>Yes</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.optionButton, data.hasUpcomingTrips === false && styles.optionButtonSelected]}
              onPress={() => setData({ ...data, hasUpcomingTrips: false })}
            >
              <Text style={[styles.optionButtonText, data.hasUpcomingTrips === false && styles.optionButtonTextSelected]}>No</Text>
            </TouchableOpacity>
          </View>
        </Animated.View>
      );
    }

    return null;
  };

  if (showConfetti) {
    return (
      <View style={styles.confettiContainer}>
        <Text style={styles.confettiTitle}>All set!</Text>
        <Text style={styles.confettiSubtitle}>You&apos;re ready to track your visas with confidence</Text>
        <Text style={styles.confettiEmoji}>🎉</Text>
      </View>
    );
  }

  const progressWidth = progressAnim.interpolate({
    inputRange: [0, 1],
    outputRange: ['0%', '100%'],
  });

  const isLastStep = currentStep === totalSteps - 1;

  return (
    <View style={styles.container}>
      <View style={styles.progressBarContainer}>
        <Animated.View style={[styles.progressBar, { width: progressWidth }]} />
      </View>

      <ScrollView style={styles.scrollContent} showsVerticalScrollIndicator={false} contentContainerStyle={styles.scrollContentContainer}>
        {renderQuestion()}
      </ScrollView>

      <View style={styles.navigationContainer}>
        {currentStep > 0 && (
          <TouchableOpacity style={styles.backButton} onPress={handleBack}>
            <ChevronLeft size={24} color={Colors.text} />
          </TouchableOpacity>
        )}
        <TouchableOpacity
          style={[styles.nextButton, !canProceed() && styles.nextButtonDisabled]}
          onPress={isLastStep ? handleFinish : handleNext}
          disabled={!canProceed()}
        >
          <Text style={[styles.nextButtonText, !canProceed() && styles.nextButtonTextDisabled]}>
            {isLastStep ? 'Finish' : 'Continue'}
          </Text>
          {!isLastStep && <ChevronRight size={20} color={canProceed() ? Colors.white : Colors.textTertiary} />}
        </TouchableOpacity>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.background,
  },
  progressBarContainer: {
    height: 4,
    backgroundColor: Colors.border,
  },
  progressBar: {
    height: 4,
    backgroundColor: Colors.primary,
  },
  scrollContent: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
    paddingHorizontal: 24,
    paddingTop: 40,
    paddingBottom: 100,
  },
  questionContainer: {
    flex: 1,
  },
  questionTitle: {
    fontSize: 28,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 12,
    lineHeight: 36,
  },
  questionSubtitle: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 32,
    lineHeight: 24,
  },
  buttonGroup: {
    flexDirection: 'row',
    gap: 12,
  },
  optionButton: {
    flex: 1,
    paddingVertical: 16,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.border,
    alignItems: 'center',
  },
  optionButtonSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  optionButtonTextSelected: {
    color: Colors.white,
  },
  optionsColumn: {
    gap: 12,
  },
  optionCard: {
    paddingVertical: 18,
    paddingHorizontal: 20,
    borderRadius: 16,
    backgroundColor: Colors.white,
    borderWidth: 2,
    borderColor: Colors.border,
  },
  optionCardSelected: {
    backgroundColor: Colors.primary,
    borderColor: Colors.primary,
  },
  optionCardText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.text,
  },
  optionCardTextSelected: {
    color: Colors.white,
  },
  datePickerRow: {
    flexDirection: 'row',
    gap: 12,
  },
  datePickerHalf: {
    flex: 1,
  },
  datePickerLabel: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.text,
    marginBottom: 8,
  },
  navigationContainer: {
    position: 'absolute',
    bottom: 0,
    left: 0,
    right: 0,
    flexDirection: 'row',
    paddingHorizontal: 24,
    paddingVertical: 20,
    paddingBottom: 40,
    backgroundColor: Colors.background,
    borderTopWidth: 1,
    borderTopColor: Colors.border,
    gap: 12,
  },
  backButton: {
    width: 56,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.white,
    alignItems: 'center',
    justifyContent: 'center',
    borderWidth: 1,
    borderColor: Colors.border,
  },
  nextButton: {
    flex: 1,
    height: 56,
    borderRadius: 28,
    backgroundColor: Colors.primary,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  nextButtonDisabled: {
    backgroundColor: Colors.border,
  },
  nextButtonText: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.white,
  },
  nextButtonTextDisabled: {
    color: Colors.textTertiary,
  },
  confettiContainer: {
    flex: 1,
    backgroundColor: Colors.background,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 40,
  },
  confettiTitle: {
    fontSize: 36,
    fontWeight: '700',
    color: Colors.text,
    marginBottom: 16,
    textAlign: 'center',
  },
  confettiSubtitle: {
    fontSize: 18,
    color: Colors.textSecondary,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 26,
  },
  confettiEmoji: {
    fontSize: 80,
  },
});
