import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  TextInput,
  Alert
} from 'react-native';
import { X, Bug, Mail } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Button from './Button';

interface ReportBugModalProps {
  visible: boolean;
  onClose: () => void;
  onContactSupport: () => void;
}

const ReportBugModal: React.FC<ReportBugModalProps> = ({
  visible,
  onClose,
  onContactSupport
}) => {
  const [bugDescription, setBugDescription] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = () => {
    if (!bugDescription.trim()) {
      Alert.alert('Error', 'Please describe the issue you encountered');
      return;
    }

    setIsSubmitting(true);

    // Simulate API call
    setTimeout(() => {
      setIsSubmitting(false);
      Alert.alert(
        'Bug Report Submitted',
        'Thank you for your feedback! Our team will investigate the issue.',
        [{ text: 'OK', onPress: handleClose }]
      );
    }, 1000);
  };

  const handleClose = () => {
    setBugDescription('');
    onClose();
  };

  if (!visible) return null;

  return (
    <Modal
      visible={visible}
      animationType="slide"
      transparent={true}
      onRequestClose={handleClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.header}>
            <Text style={styles.title}>Help & Support</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={24} color={Colors.black} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Bug size={20} color={Colors.primary} style={styles.sectionIcon} />
                <Text style={styles.sectionTitle}>Report a Bug</Text>
              </View>
              <Text style={styles.sectionDescription}>
                Encountered an issue? Let us know so we can fix it.
              </Text>
              <TextInput
                style={styles.textArea}
                value={bugDescription}
                onChangeText={setBugDescription}
                placeholder="Describe the issue you encountered..."
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              <Button
                title="Submit Report"
                onPress={handleSubmit}
                loading={isSubmitting}
                style={styles.submitButton}
              />
            </View>

            <View style={styles.divider} />

            <View style={styles.section}>
              <View style={styles.sectionHeader}>
                <Mail size={20} color={Colors.primary} style={styles.sectionIcon} />
                <Text style={styles.sectionTitle}>Contact Support</Text>
              </View>
              <Text style={styles.sectionDescription}>
                Need help with something else? Our support team is ready to assist you.
              </Text>
              <Button
                title="Email Support"
                onPress={onContactSupport}
                variant="outline"
                style={styles.contactButton}
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
    justifyContent: 'flex-end',
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 24,
    borderTopRightRadius: 24,
    paddingTop: 20,
    paddingHorizontal: 16,
    paddingBottom: 30,
    maxHeight: '80%',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.black,
  },
  closeButton: {
    padding: 4,
  },
  content: {
    flex: 1,
  },
  section: {
    marginBottom: 24,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  sectionIcon: {
    marginRight: 8,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: Colors.black,
  },
  sectionDescription: {
    fontSize: 14,
    color: Colors.textSecondary,
    marginBottom: 16,
    lineHeight: 20,
  },
  textArea: {
    height: 120,
    borderWidth: 1,
    borderColor: Colors.border,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingTop: 12,
    fontSize: 16,
    color: Colors.black,
    backgroundColor: Colors.white,
    marginBottom: 16,
  },
  submitButton: {
    marginBottom: 8,
  },
  contactButton: {
    marginTop: 8,
  },
  divider: {
    height: 1,
    backgroundColor: Colors.border,
    marginVertical: 16,
  },
});

export default ReportBugModal;