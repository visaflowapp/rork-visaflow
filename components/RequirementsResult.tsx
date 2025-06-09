import React from 'react';
import { View, Text, StyleSheet, ScrollView } from 'react-native';
import Colors from '@/constants/colors';
import { visaRequirements } from '@/constants/mockData';

interface RequirementsResultProps {
  nationality: string;
  destination: string;
  purpose: string;
}

const RequirementsResult: React.FC<RequirementsResultProps> = ({
  nationality,
  destination,
  purpose,
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

      <View style={styles.disclaimer}>
        <Text style={styles.disclaimerText}>
          Information is for reference only. Requirements may change. Always verify with official sources.
        </Text>
      </View>

      <ScrollView style={styles.content}>
        {visaRequirements.visaTypes.map((visa, index) => (
          <View key={index} style={styles.visaTypeCard}>
            <View style={styles.visaTypeHeader}>
              <Text style={styles.visaTypeTitle}>{visa.type}</Text>
              <View style={styles.visaTypeBadge}>
                <Text style={styles.visaTypeBadgeText}>{visa.duration}</Text>
              </View>
            </View>
            
            <View style={styles.visaTypeDetails}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Fee</Text>
                <Text style={styles.detailValue}>{visa.fee}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Processing Time</Text>
                <Text style={styles.detailValue}>{visa.processingTime}</Text>
              </View>
            </View>
            
            <Text style={styles.requirementsTitle}>Requirements</Text>
            {visa.requirements.map((req, reqIndex) => (
              <View key={reqIndex} style={styles.requirementItem}>
                <View style={styles.bullet} />
                <Text style={styles.requirementText}>{req}</Text>
              </View>
            ))}
          </View>
        ))}

        <View style={styles.entryRulesCard}>
          <Text style={styles.entryRulesTitle}>Entry Rules</Text>
          {visaRequirements.entryRules.map((rule, index) => (
            <View key={index} style={styles.requirementItem}>
              <View style={styles.bullet} />
              <Text style={styles.requirementText}>{rule}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: Colors.white,
    borderRadius: 16,
    overflow: 'hidden',
    marginHorizontal: 16,
    marginVertical: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 12 },
    shadowOpacity: 0.25,
    shadowRadius: 25,
    elevation: 15,
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
  disclaimer: {
    backgroundColor: 'rgba(255, 204, 0, 0.1)',
    padding: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  disclaimerText: {
    fontSize: 12,
    color: Colors.black,
    textAlign: 'center',
  },
  content: {
    padding: 16,
  },
  visaTypeCard: {
    marginBottom: 24,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  visaTypeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  visaTypeTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
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
    marginBottom: 16,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  detailLabel: {
    fontSize: 14,
    color: Colors.silver,
  },
  detailValue: {
    fontSize: 14,
    fontWeight: '600',
    color: Colors.black,
  },
  requirementsTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 12,
  },
  requirementItem: {
    flexDirection: 'row',
    marginBottom: 8,
    alignItems: 'flex-start',
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    backgroundColor: Colors.primary,
    marginTop: 6,
    marginRight: 8,
  },
  requirementText: {
    flex: 1,
    fontSize: 14,
    color: Colors.black,
    lineHeight: 20,
  },
  entryRulesCard: {
    marginBottom: 24,
    backgroundColor: Colors.white,
    borderRadius: 12,
    padding: 16,
    borderWidth: 1,
    borderColor: Colors.border,
  },
  entryRulesTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
    marginBottom: 12,
  },
});

export default RequirementsResult;