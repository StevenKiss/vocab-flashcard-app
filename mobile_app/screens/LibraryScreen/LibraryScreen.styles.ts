import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#EFE7EC',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
    paddingHorizontal: 20,
  },
  headerText: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#6F4E7C',
    textAlign: 'center',
    flex: 1,
  },
  editButtonText: {
    color: '#6F4E7C',
    fontSize: 16,
    fontWeight: '600',
  },
  flashcardButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 14,
    paddingHorizontal: 20,
    marginHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  flashcardContent: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  textContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  editModeButton: {
    justifyContent: 'flex-start',
  },
  flashcardButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: '600',
    textAlign: 'center',
  },
  flashcardDescription: {
    color: '#6F4E7C',
    fontSize: 14,
    marginTop: 5,
  },
  emptyMessage: {
    textAlign: 'center',
    color: '#6F4E7C',
    marginTop: 20,
  },
  checkbox: {
    width: 24,
    height: 24,
    borderWidth: 2,
    borderColor: '#6FE7C',
    borderRadius: 12,
    justifyContent: 'flex-start',
    alignItems: 'center',
  },
  checkboxSelected: {
    color: '#6F4E7C',
    fontWeight: 'bold',
    fontSize: 16,
  },
  checkboxUnselected: {
    color: 'transparent',
  },
  deleteButton: {
    backgroundColor: '#E63946',
    paddingVertical: 12,
    marginHorizontal: 20,
    borderRadius: 8,
    alignItems: 'center',
  },
  deleteButtonText: {
    color: '#FFF',
    fontSize: 16,
    fontWeight: '600',
  },
  selectedSet: {
    backgroundColor: '#FDE8E8',
  },
  safeArea: {
    flex: 1,
    backgroundColor: '#EFE7EC',
  },
});

export default styles;