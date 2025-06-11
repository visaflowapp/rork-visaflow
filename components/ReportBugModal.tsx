import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  Alert,
  Linking
} from 'react-native';
import { X, Bug, Mail, Send } from 'lucide-react-native';
import Button from './Button';

interface ReportBugModalProps {
  visible: boolean;
  onClose: () => void;
}

const ReportBugModal: React.FC<ReportBugModalProps> = ({ visible, onClose }) => {
  const [bugDescription, setBugDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmitBug = async () => {
    if (!bugDescription.trim()) {
      Alert.alert('Missing Information', 'Please describe the bug you encountered.');
      return;
    }

    setIsSubmitting(true);
    
    // Simulate submission
    setTimeout(() => {
      setIsSubmitting(false);
      setBugDescription('');
      Alert.alert(
        'Bug Report Submitted',
        'Thank you for your feedback! We will investigate this issue.',
        [{ text: 'OK', onPress: onClose }]
      );
    }, 1000);
  };

  const handleContactSupport = () => {
    const email = 'support@visatracker.com';
    const subject = 'Support Request';
    const body = 'Hi, I need help with...';
    
    const mailtoUrl = `mailto:${email}?subject=${encodeURIComponent(subject)}&body=${encodeURIComponent(body)}`;
    
    Linking.openURL(mailtoUrl).catch(() => {
      Alert.alert('Error', 'Could not open email client. Please contact support@visatracker.com directly.');
    });
  };

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color="#8E8E93" />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            {/* Bug Report Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Bug size={24} color="#007AFF" />
                <Text style={styles.sectionTitle}>Report a Bug</Text>
              </View>
              <Text style={styles.sectionDescription}>
                Encountered an issue? Let us know so we can fix it.
              </Text>
              
              <TextInput
                style={styles.textArea}
                value={bugDescription}
                onChangeText={setBugDescription}
                placeholder="Describe the bug you encountered..."
                placeholderTextColor="#8E8E93"
                multiline
                numberOfLines={6}
                textAlignVertical="top"
              />
              
              <Button
                title={isSubmitting ? "Submitting..." : "Submit Report"}
                onPress={handleSubmitBug}
                disabled={isSubmitting}
                style={styles.submitButton}
                icon={<Send size={18} color="white" />}
              />
            </View>

            {/* Divider */}
            <View style={styles.divider} />

            {/* Contact Support Section */}
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Mail size={24} color="#007AFF" />
                <Text style={styles.sectionTitle}>Contact Support</Text>
              </View>
              <Text style={styles.sectionDescription}>
                Need help with something else? Our support team is ready to assist you.
              </Text>
              
              <Button
                title="Email Support"
                onPress={handleContactSupport}
                variant="outline"
                style={styles.contactButton}
                icon={<Mail size={18} color="#007AFF" />}
              />
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  modalContainer: {
    backgroundColor: '#FFFFFF',
    borderRadius: 24,
    width: '100%',
    maxWidth: 400,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    alignItems: 'center',
    paddingTop: 16,
    paddingHorizontal: 16,
  },
  closeButton: {
    padding: 8,
  },
  content: {
    paddingHorizontal: 24,
    paddingBottom: 24,
  },
  section: {
    marginBottom: 8,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 12,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#000000',
    marginLeft: 12,
  },
  sectionDescription: {
    fontSize: 16,
    color: '#8E8E93',
    marginBottom: 20,
    lineHeight: 22,
  },
  textArea: {
    height: 120,
    borderWidth: 1,
    borderColor: '#E5E5EA',
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    fontSize: 16,
    color: '#000000',
    backgroundColor: '#FFFFFF',
    marginBottom: 16,
  },
  submitButton: {
    marginBottom: 8,
  },
  divider: {
    height: 1,
    backgroundColor: '#E5E5EA',
    marginVertical: 24,
  },
  contactButton: {
    marginTop: 8,
  },
});

export default ReportBugModal;