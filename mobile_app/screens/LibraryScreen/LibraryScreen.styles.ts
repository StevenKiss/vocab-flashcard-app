import { StyleSheet } from "react-native";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#EFE7EC', 
  },
  header: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
    color: '#6F4E7C',
    marginTop: 30,
  },
  flashcardButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 10,
    marginVertical: 10,
    alignItems: 'center',
  },
  flashcardButtonText: {
    color: '#000000',
    fontSize: 16,
    fontWeight: '600',
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
});

export default styles;