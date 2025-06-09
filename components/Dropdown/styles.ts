import { StyleSheet, Dimensions } from 'react-native';
import Colors from '@/constants/colors';

const { height } = Dimensions.get('window');

export const dropdownStyles = StyleSheet.create({
  container: {
    marginBottom: 20,
  },
  label: {
    fontSize: 16,
    marginBottom: 8,
    color: Colors.black,
    fontWeight: '600',
  },
  button: {
    flexDirection: 'row',
    alignItems: 'center',
    height: 56,
    paddingHorizontal: 16,
    backgroundColor: Colors.white,
    borderRadius: 12,
    borderWidth: 2,
    borderColor: Colors.border,
    shadowColor: Colors.black,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 8,
    elevation: 3,
  },
  buttonSelected: {
    borderColor: Colors.primary,
    backgroundColor: 'rgba(0, 122, 255, 0.05)',
  },
  selectedFlag: {
    fontSize: 18,
    marginRight: 10,
  },
  buttonText: {
    flex: 1,
    fontSize: 16,
    color: Colors.black,
  },
  placeholderText: {
    color: Colors.silver,
  },
  selectedText: {
    color: Colors.black,
    fontWeight: '500',
  },
  chevron: {
    transform: [{ rotate: '0deg' }],
  },
  chevronRotated: {
    transform: [{ rotate: '180deg' }],
  },
  overlay: {
    flex: 1,
    justifyContent: 'flex-end',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
  },
  modalContainer: {
    backgroundColor: Colors.white,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.8,
  },
  modalContent: {
    padding: 16,
    flex: 1,
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingBottom: 16,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
  },
  modalTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    color: Colors.black,
  },
  closeText: {
    fontSize: 16,
    color: Colors.primary,
    fontWeight: '600',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: Colors.lightGray,
    borderRadius: 10,
    paddingHorizontal: 12,
    marginTop: 16,
    marginBottom: 8,
  },
  searchIcon: {
    marginRight: 8,
  },
  searchInput: {
    flex: 1,
    height: 44,
    fontSize: 16,
    color: Colors.black,
  },
  listContainer: {
    marginTop: 8,
    flex: 1,
  },
  item: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 4,
    borderBottomWidth: 1,
    borderBottomColor: Colors.border,
    height: 56,
  },
  selectedItem: {
    backgroundColor: 'rgba(0, 122, 255, 0.1)',
  },
  flagEmoji: {
    fontSize: 18,
    marginRight: 12,
  },
  itemText: {
    fontSize: 16,
    color: Colors.black,
    flex: 1,
  },
  selectedItemText: {
    color: Colors.primary,
    fontWeight: '600',
  },
  checkIcon: {
    marginLeft: 8,
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    textAlign: 'center',
    color: Colors.silver,
    fontSize: 16,
  },
});