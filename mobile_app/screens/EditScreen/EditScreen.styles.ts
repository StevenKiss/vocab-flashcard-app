import { StyleSheet } from 'react-native';

export default StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF', // same as CreateSetScreen
  },
  safeArea: {
    flex: 1,
    marginHorizontal: 16,
    marginTop: 16,
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    marginVertical: 8,
    textAlign: 'center',
  },
  scrollView: {
    marginVertical: 8,
  },
  card: {
    backgroundColor: '#F8F8F8',
    padding: 10,
    marginBottom: 8,
    borderRadius: 8,
  },
  cardInfoContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  cardNumber: {
    fontSize: 16,
    fontWeight: 'bold',
  },
  deleteButton: {
    padding: 4,
  },
  input: {
    backgroundColor: '#FFF',
    borderWidth: 1,
    borderColor: '#CCC',
    borderRadius: 6,
    marginBottom: 8,
    paddingHorizontal: 10,
    paddingVertical: 6,
  },
  addButton: {
    backgroundColor: '#EFEFEF',
    padding: 12,
    borderRadius: 6,
    alignItems: 'center',
    marginBottom: 16,
  },
  addButtonText: {
    color: '#333',
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 16,
  },
  cancelButton: {
    flex: 1,
    marginRight: 8,
    backgroundColor: '#CCC',
    borderRadius: 6,
    alignItems: 'center',
    padding: 12,
  },
  cancelButtonText: {
    color: '#333',
    fontSize: 16,
  },
  saveButton: {
    flex: 1,
    marginLeft: 8,
    backgroundColor: '#4CAF50',
    borderRadius: 6,
    alignItems: 'center',
    padding: 12,
  },
  saveButtonText: {
    color: '#FFF',
    fontSize: 16,
  },
});
