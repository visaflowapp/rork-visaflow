import React, { useState } from 'react';
import { 
  Modal, 
  View, 
  Text, 
  StyleSheet, 
  TouchableOpacity, 
  Alert
} from 'react-native';
import { X, AlertTriangle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Button from './Button';

interface CancelSubscriptionModalProps {
  visible: boolean;
  onClose: () => void;
}

const CancelSubscriptionModal: React.FC<CancelSubscriptionModalProps> = ({
  visible,
  onClose
}) => {
  const [isCancelling, setIsCancelling] = useState(false);
  const [selectedReason, setSelectedReason] = useState<string | null>(null);

  const reasons = [
    "Too expensive",
    "Not using it enough",
    "Missing features",
    "Found a better alternative",
    "Technical issues",
    "Other"
  ];

  const handleCancel = () => {
    if (!selectedReason) {
      Alert.alert('Error', 'Please select a reason for cancellation');
      return;
    }

    setIsCancelling(true);

    // Simulate API call
    setTimeout(() => {
      setIsCancelling(false);
      Alert.alert(
        'Subscription Cancelled',
        'Your subscription has been cancelled. You will have access until the end of your current billing period.',
        [{ text: 'OK', onPress: handleClose }]
      );
    }, 1500);
  };

  const handleClose = () => {
    setSelectedReason(null);
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
            <Text style={styles.title}>Cancel Subscription</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={24} color={Colors.black} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.warningContainer}>
              <AlertTriangle size={24} color={Colors.warning} style={styles.warningIcon} />
              <Text style={styles.warningText}>
                You will lose access to premium features at the end of your current billing period.
              </Text>
            </View>
            
            <Text style={styles.reasonTitle}>
              Please tell us why you're cancelling:
            </Text>
            
            <View style={styles.reasonsList}>
              {reasons.map((reason) => (
                <TouchableOpacity
                  key={reason}
                  style={[
                    styles.reasonItem,
                    selectedReason === reason && styles.selectedReasonItem
                  ]}
                  onPress={() => setSelectedReason(reason)}
                >
                  <View style={[
                    styles.radioButton,
                    selectedReason === reason && styles.radioButtonSelected
                  ]}>
                    {selectedReason === reason && (
                      <View style={styles.radioButtonInner} />
                    )}
                  </View>
                  <Text style={styles.reasonText}>{reason}</Text>
                </TouchableOpacity>
              ))}
            </View>
            
            <Button
              title="Cancel Subscription"
              onPress={handleCancel}
              loading={isCancelling}
              style={styles.cancelButton}
              textStyle={styles.cancelButtonText}
            />
            
            <TouchableOpacity onPress={handleClose} style={styles.keepButton}>
              <Text style={styles.keepButtonText}>Keep My Subscription</Text>
            </TouchableOpacity>
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
    paddingBottom: 16,
  },
  warningContainer: {
    flexDirection: 'row',
    backgroundColor: 'rgba(255, 149, 0, 0.1)',
    padding: 16,
    borderRadius: 12,
    marginBottom: 24,
    alignItems: 'center',
  },
  warningIcon: {
    marginRight: 12,
  },
  warningText: {
    fontSize: 14,
    color: Colors.black,
    flex: 1,
    lineHeight: 20,
  },
  reasonTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 16,
  },
  reasonsList: {
    marginBottom: 24,
  },
  reasonItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  selectedReasonItem: {
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
  },
  radioButton: {
    width: 20,
    height: 20,
    borderRadius: 10,
    borderWidth: 2,
    borderColor: Colors.silver,
    marginRight: 12,
    justifyContent: 'center',
    alignItems: 'center',
  },
  radioButtonSelected: {
    borderColor: Colors.primary,
  },
  radioButtonInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
    backgroundColor: Colors.primary,
  },
  reasonText: {
    fontSize: 16,
    color: Colors.black,
  },
  cancelButton: {
    backgroundColor: Colors.error,
    marginBottom: 16,
  },
  cancelButtonText: {
    color: Colors.white,
  },
  keepButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  keepButtonText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
});

export default CancelSubscriptionModal;