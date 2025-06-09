import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import Colors from '@/constants/colors';

interface RequirementsResultProps {
  nationality: string;
  destination: string;
  purpose: string;
  data: any; // API response data
}

const RequirementsResult: React.FC<RequirementsResultProps> = ({
  nationality,
  destination,
  purpose,
  data,
}) => {
  // Get country flag emoji
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

  // Parse API response data
  const parseVisaRequirements = () => {
    // Adapt this based on your API response structure
    if (!data) return null;

    // Example structure - adjust based on your API
    return {
      visaRequired: data.visa_required || data.visaRequired || false,
      visaTypes: data.visa_types || data.visaTypes || [],
      entryRules: data.entry_rules || data.entryRules || [],
      maxStay: data.max_stay || data.maxStay || null,
      processingTime: data.processing_time || data.processingTime || null,
      fee: data.fee || null,
      requirements: data.requirements || [],
      notes: data.notes || data.additional_info || null,
    };
  };

  const requirements = parseVisaRequirements();

  if (!requirements) {
    return (
      <View style={styles.container}>
        <View style={styles.header}>
          <Text style={styles.errorText}>Unable to parse requirements data</Text>
        </View>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <View style={styles.tripDetails}>
          <Text style={styles.tripDetailText}>
            {getCountryFlag(nationality)} {nationality} → {getCountryFlag(destination)} {destination}
          </Text>
          <View style={styles.purposeBadge}>
            <Text style={styles.purposeText}>{purpose}</Text>
          </View>
        </View>
      </View>

      <View style={styles.content}>
        {/* Visa Status */}
        <View style={styles.statusCard}>
          <Text style={styles.statusTitle}>
            {requirements.visaRequired ? 'Visa Required' : 'No Visa Required'}
          </Text>
          {requirements.maxStay && (
            <Text style={styles.statusSubtitle}>
              Maximum stay: {requirements.maxStay}
            </Text>
          )}
        </View>

        {/* Visa Types */}
        {requirements.visaTypes && requirements.visaTypes.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available Visa Types</Text>
            {requirements.visaTypes.map((visa: any, index: number) => (
              <View key={index} style={styles.visaTypeCard}>
                <View style={styles.visaTypeHeader}>
                  <Text style={styles.visaTypeTitle}>
                    {visa.type || visa.name || `Visa Type ${index + 1}`}
                  </Text>
                  {visa.duration && (
                    <View style={styles.visaTypeBadge}>
                      <Text style={styles.visaTypeBadgeText}>{visa.duration}</Text>
                    </View>
                  )}
                </View>
                
                {(visa.fee || visa.processing_time) && (
                  <View style={styles.visaTypeDetails}>
                    {visa.fee && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Fee</Text>
                        <Text style={styles.detailValue}>{visa.fee}</Text>
                      </View>
                    )}
                    {visa.processing_time && (
                      <View style={styles.detailRow}>
                        <Text style={styles.detailLabel}>Processing Time</Text>
                        <Text style={styles.detailValue}>{visa.processing_time}</Text>
                      </View>
                    )}
                  </View>
                )}
                
                {visa.requirements && visa.requirements.length > 0 && (
                  <>
                    <Text style={styles.requirementsTitle}>Requirements</Text>
                    {visa.requirements.map((req: string, reqIndex: number) => (
                      <View key={reqIndex} style={styles.requirementItem}>
                        <View style={styles.bullet} />
                        <Text style={styles.requirementText}>{req}</Text>
                      </View>
                    ))}
                  </>
                )}
              </View>
            ))}
          </View>
        )}

        {/* General Requirements */}
        {requirements.requirements && requirements.requirements.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>General Requirements</Text>
            {requirements.requirements.map((req: string, index: number) => (
              <View key={index} style={styles.requirementItem}>
                <View style={styles.bullet} />
                <Text style={styles.requirementText}>{req}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Entry Rules */}
        {requirements.entryRules && requirements.entryRules.length > 0 && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Entry Rules</Text>
            {requirements.entryRules.map((rule: string, index: number) => (
              <View key={index} style={styles.requirementItem}>
                <View style={styles.bullet} />
                <Text style={styles.requirementText}>{rule}</Text>
              </View>
            ))}
          </View>
        )}

        {/* Additional Notes */}
        {requirements.notes && (
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Additional Information</Text>
            <Text style={styles.notesText}>{requirements.notes}</Text>
          </View>
        )}
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 16 },
    shadowOpacity: 0.3,
    shadowRadius: 30,
    elevation: 20,
    maxHeight: 600, // Prevent scrolling
  },
  header: {
    padding: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  tripDetails: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  tripDetailText: {
    fontSize: 16,
    color: Colors.black,
    fontWeight: '500',
  },
  purposeBadge: {
    backgroundColor: Colors.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 16,
  },
  purposeText: {
    color: Colors.white,
    fontWeight: '600',
    fontSize: 12,
  },
  content: {
    padding: 16,
    maxHeight: 500, // Ensure no scrolling
  },
  statusCard: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    borderRadius: 12,
    padding: 16,
    marginBottom: 16,
    alignItems: 'center',
  },
  statusTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.primary,
    marginBottom: 4,
  },
  statusSubtitle: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  section: {
    marginBottom: 16,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 12,
  },
  visaTypeCard: {
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  visaTypeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  visaTypeTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.black,
    flex: 1,
  },
  visaTypeBadge: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
    paddingHorizontal: 10,
    paddingVertical: 4,
    borderRadius: 12,
  },
  visaTypeBadgeText: {
    color: Colors.primary,
    fontWeight: '600',
    fontSize: 12,
  },
  visaTypeDetails: {
    marginBottom: 12,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 4,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.textSecondary,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.black,
  },
  requirementsTitle: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 8,
  },
  requirementItem: {
    flexDirection: 'row',
    marginBottom: 6,
    alignItems: 'flex-start',
  },
  bullet: {
    width: 4,
    height: 4,
    borderRadius: 2,
    backgroundColor: Colors.primary,
    marginTop: 6,
    marginRight: 8,
  },
  requirementText: {
    flex: 1,
    fontSize: 13,
    color: Colors.black,
    lineHeight: 18,
  },
  notesText: {
    fontSize: 14,
    color: Colors.textSecondary,
    lineHeight: 20,
    fontStyle: 'italic',
  },
  errorText: {
    fontSize: 16,
    color: Colors.red,
    textAlign: 'center',
  },
});

export default RequirementsResult;