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
import { X, AlertTriangle } from 'lucide-react-native';
import Colors from '@/constants/colors';
import Button from './Button';
import { useRouter } from 'expo-router';

interface DeleteAccountModalProps {
  visible: boolean;
  onClose: () => void;
}

const DeleteAccountModal: React.FC<DeleteAccountModalProps> = ({
  visible,
  onClose
}) => {
  const router = useRouter();
  const [confirmation, setConfirmation] = useState('');
  const [isDeleting, setIsDeleting] = useState(false);

  const handleDelete = () => {
    if (confirmation.toLowerCase() !== 'delete') {
      Alert.alert('Error', 'Please type "delete" to confirm');
      return;
    }

    setIsDeleting(true);

    // Simulate API call
    setTimeout(() => {
      setIsDeleting(false);
      Alert.alert(
        'Account Deleted',
        'Your account has been successfully deleted. You will be redirected to the sign in screen.',
        [{ 
          text: 'OK', 
          onPress: () => {
            handleClose();
            // Redirect to sign in screen
            router.replace('/screens/SignInScreen');
          } 
        }]
      );
    }, 1500);
  };

  const handleClose = () => {
    setConfirmation('');
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
            <Text style={styles.title}>Delete Account</Text>
            <TouchableOpacity onPress={handleClose} style={styles.closeButton}>
              <X size={24} color={Colors.black} />
            </TouchableOpacity>
          </View>

          <View style={styles.content}>
            <View style={styles.warningContainer}>
              <AlertTriangle size={24} color={Colors.error} style={styles.warningIcon} />
              <Text style={styles.warningTitle}>This action cannot be undone</Text>
            </View>
            
            <Text style={styles.description}>
              Deleting your account will permanently remove all your data, including:
            </Text>
            
            <View style={styles.bulletPoints}>
              <Text style={styles.bulletPoint}>• All visa records and tracking data</Text>
              <Text style={styles.bulletPoint}>• Notification preferences and history</Text>
              <Text style={styles.bulletPoint}>• Personal information and settings</Text>
              <Text style={styles.bulletPoint}>• Subscription information (if applicable)</Text>
            </View>
            
            <Text style={styles.confirmationLabel}>
              Type &quot;delete&quot; to confirm:
            </Text>
            
            <TextInput
              style={styles.confirmationInput}
              value={confirmation}
              onChangeText={setConfirmation}
              placeholder="Type 'delete' here"
              autoCapitalize="none"
            />
            
            <Button
              title="Delete My Account"
              onPress={handleDelete}
              loading={isDeleting}
              style={styles.deleteButton}
              textStyle={styles.deleteButtonText}
            />
            
            <TouchableOpacity onPress={handleClose} style={styles.cancelButton}>
              <Text style={styles.cancelButtonText}>Cancel</Text>
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
    alignItems: 'center',
    backgroundColor: Colors.lightRed,
    padding: 16,
    borderRadius: 12,
    marginBottom: 16,
  },
  warningIcon: {
    marginRight: 12,
  },
  warningTitle: {
    fontSize: 16,
    fontWeight: 'bold',
    color: Colors.error,
  },
  description: {
    fontSize: 16,
    color: Colors.black,
    marginBottom: 12,
    lineHeight: 22,
  },
  bulletPoints: {
    marginBottom: 24,
  },
  bulletPoint: {
    fontSize: 14,
    color: Colors.black,
    marginBottom: 8,
    lineHeight: 20,
  },
  confirmationLabel: {
    fontSize: 16,
    fontWeight: '600',
    color: Colors.black,
    marginBottom: 8,
  },
  confirmationInput: {
    height: 56,
    borderWidth: 1,
    borderColor: Colors.error,
    borderRadius: 12,
    paddingHorizontal: 16,
    fontSize: 16,
    color: Colors.black,
    backgroundColor: Colors.white,
    marginBottom: 24,
  },
  deleteButton: {
    backgroundColor: Colors.error,
    marginBottom: 16,
  },
  deleteButtonText: {
    color: Colors.white,
  },
  cancelButton: {
    alignItems: 'center',
    paddingVertical: 12,
  },
  cancelButtonText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
});

export default DeleteAccountModal;