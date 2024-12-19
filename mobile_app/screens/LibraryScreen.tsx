import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native';

const LibraryScreen = () => {
  const navigation = useNavigation();

  // Temporary Data for flashcard Sets

  const flashcardSets = [
    { id: '1', title: 'Chinese Vocabulary', description: 'Basics of Chinese' },
    { id: '2', title: 'Hanzi Characters', description: 'Common Hanzi Practice' },
    { id: '3', title: 'Advanced Phrases', description: 'Conversational Phrases' },
  ];

  // Render each flashcard set as a button
  const renderFlashcardSet = ({item}: {item: {id: string; title: string; description: string}}) => (
    <TouchableOpacity
      style={styles.flashcardButton}
      onPress={() => navigation.navigate('Flashcard', {setId: item.id, title: item.title})}
    >
      <Text style={styles.flashcardButtonText}>{item.title}</Text>
      <Text style={styles.flashcardDescription}>{item.description}</Text>
    </TouchableOpacity>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.header}>Flashcard Sets</Text>
      <FlatList
        data={flashcardSets}
        renderItem={renderFlashcardSet}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20}}
        />
    </View>
  );
};

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
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default LibraryScreen;