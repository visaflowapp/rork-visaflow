import React, { useState } from 'react';
import { View, Text, StyleSheet, Modal, TouchableOpacity, Alert } from 'react-native';
import { AlertTriangle, X } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Button from './Button';

interface CancelSubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
}

const CancelSubscriptionModal: React.FC<CancelSubscriptionModalProps> = ({ visible, onClose }) => {
  const [isLoading, setIsLoading] = useState(false);

  const handleCancel = () => {
    onClose();
  };

  const handleConfirmCancel = () => {
    setIsLoading(true);
    
    // Simulate API call to cancel subscription
    setTimeout(() => {
      setIsLoading(false);
      Alert.alert(
        'Subscription Cancelled',
        'Your subscription has been cancelled. You will have access to premium features until the end of your current billing period.',
        [{ text: 'OK', onPress: onClose }]
      );
    }, 1500);
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <View style={styles.modalContainer}>
          <View style={styles.modalHeader}>
            <Text style={styles.modalTitle}>Cancel Subscription</Text>
            <TouchableOpacity onPress={onClose} style={styles.closeButton}>
              <X size={24} color={Colors.black} />
            </TouchableOpacity>
          </View>
          
          <View style={styles.warningContainer}>
            <AlertTriangle size={24} color={Colors.warning} style={styles.warningIcon} />
            <Text style={styles.warningText}>
              Are you sure you want to cancel your subscription?
            </Text>
          </View>
          
          <Text style={styles.modalDescription}>
            If you cancel, you will lose access to premium features at the end of your current billing period:
          </Text>
          
          <View style={styles.featuresList}>
            <Text style={styles.featureItem}>• Advanced visa analytics</Text>
            <Text style={styles.featureItem}>• Document storage</Text>
            <Text style={styles.featureItem}>• Priority support</Text>
            <Text style={styles.featureItem}>• Ad-free experience</Text>
          </View>
          
          <View style={styles.buttonContainer}>
            <Button
              title="Keep Subscription"
              onPress={handleCancel}
              style={styles.keepButton}
            />
            <Button
              title="Yes, Cancel"
              onPress={handleConfirmCancel}
              variant="outline"
              loading={isLoading}
              style={styles.cancelButton}
              textStyle={styles.cancelButtonText}
            />
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
    padding: 16,
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderRadius: 20,
    padding: 24,
    width: '100%',
    maxWidth: 500,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 10 },
    shadowOpacity: 0.1,
    shadowRadius: 20,
    elevation: 10,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 16,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    color: Colors.black,
  },
  closeButton: {
    padding: 4,
  },
  warningContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightRed,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  warningIcon: {
    marginRight: 12,
  },
  warningText: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.error,
    flex: 1,
  },
  modalDescription: {
    fontSize: 16,
    color: Colors.black,
    marginBottom: 12,
    lineHeight: 22,
  },
  featuresList: {
    marginBottom: 24,
  },
  featureItem: {
    fontSize: 16,
    color: Colors.textSecondary,
    marginBottom: 8,
    lineHeight: 22,
  },
  buttonContainer: {
    flexDirection: 'column',
    gap: 12,
  },
  keepButton: {
    backgroundColor: Colors.primary,
  },
  cancelButton: {
    borderColor: Colors.error,
  },
  cancelButtonText: {
    color: Colors.error,
  },
});

export default CancelSubscriptionModal;