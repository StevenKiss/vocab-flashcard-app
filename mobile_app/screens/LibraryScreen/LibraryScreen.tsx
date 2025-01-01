import React, {useState, useCallback} from 'react';
import { View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation, useRoute, RouteProp, useFocusEffect } from '@react-navigation/native';
import { StackNavigationProp } from '@react-navigation/stack';
import { auth, db } from '../../firebase/firebaseConfig';
import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { RootStackParamList } from '../../types/types';
import styles from './LibraryScreen.styles';

type LibraryRouteProp = RouteProp<RootStackParamList, 'LibraryMain'>;

const LibraryScreen = () => {
  const [flashcardSets, setFlashcardSets] = useState<any[]>([]); // 0 flashcard sets to start
  const navigation = useNavigation();

  const fetchFlashcardSets = async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        throw new Error('User not authenticated.');
      }

      const vocabsetsRef = collection(db, `users/${uid}/vocabsets`);
      const vocabsetsQuery = query(vocabsetsRef, orderBy('createdAt', 'desc'));
      const querySnapshot = await getDocs(vocabsetsQuery);

      const fetchedSets = querySnapshot.docs.map(doc => ({
        id: doc.id,
        ...doc.data(),
      }));

      setFlashcardSets(fetchedSets);
    } catch (error) {
      console.error('Error fetching vocab sets:', error);
    }
  };

  // Re-fetch vocab whenever screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchFlashcardSets();
    }, [])
  );

  // Render each flashcard set as a button
  const renderFlashcardSet = ({item}: {item: {id: string; title: string; description: string; vocab: any[]}}) => {
    console.log('Rendering item:', item);
    return (
      <TouchableOpacity
        style={styles.flashcardButton}
        onPress={() => navigation.navigate('FlashcardScreen', {
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