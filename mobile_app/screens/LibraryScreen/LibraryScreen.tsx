import React, {useState, useEffect} from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation, useRoute, RouteProp } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/types';
import styles from './LibraryScreen.styles';

type LibraryRouteProp = RouteProp<RootStackParamList, 'LibraryMain'>;

const LibraryScreen = () => {
  const [flashcardSets, setFlashcardSets] = useState<any[]>([]); // 0 flashcard sets to start
  const navigation = useNavigation();
  const route = useRoute();

  useEffect(()=> {
    // Check if new vocabulary data is passed from Add Screen
    if (route.params?.extractedVocab && route.params?.fileName) {
      console.log('Received in LibraryMain:', route.params.fileName);

      const newSet = {
        id: Date.now().toString(),          // Generate a unique ID
        title: route.params.fileName,       // Use file name as title
        description: '',                    // Blank description
        vocab: route.params.extractedVocab, // Vocab Data
        frontContent: 'Word',               // Default front content
        backContent: 'Definition',          // Default front content
      };

      setFlashcardSets((prevSets) => {
        const updatedSets = [...prevSets, newSet];
        console.log('Flashcard sets:', updatedSets);
        return updatedSets;
      });
    }
  }, [route.params?.extractedVocab, route.params?.fileName])

  // Render each flashcard set as a button
  const renderFlashcardSet = ({item}: {item: {id: string; title: string; description: string; vocab: any[]}}) => {
    console.log('Rendering item:', item);
    return (
      <TouchableOpacity
        style={styles.flashcardButton}
        onPress={() => navigation.navigate('Flashcard', {
          setId: item.id,
          vocab: item.vocab,
          title: item.title,
          frontContent: item.frontContent,
          backContent: item.backContent,
        })
      }
      >
        <Text style={styles.flashcardButtonText}>{item.title || 'Untitled Set'}</Text>
        <Text style={styles.flashcardDescription}>{item.description}</Text>
      </TouchableOpacity>
    );
  };
  return (
    <View style={styles.container}>
      <Text style={styles.header}>Flashcard Sets</Text>
      <FlatList
        data={flashcardSets}
        renderItem={renderFlashcardSet}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 20}}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>
            No flashcard sets available. Add a new set to get started!
          </Text>}
        />
    </View>
  );
};

export default LibraryScreen;