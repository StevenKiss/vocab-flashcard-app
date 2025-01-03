import React, { useState, useCallback } from 'react';
import { View, Text, TouchableOpacity, FlatList, Alert, StatusBar } from 'react-native';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import { auth, db } from '../../firebase/firebaseConfig';
import { collection, getDocs, query, orderBy, deleteDoc, doc } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './LibraryScreen.styles';

const LibraryScreen = () => {
  const [flashcardSets, setFlashcardSets] = useState<any[]>([]); // 0 flashcard sets to start
  const [isEditMode, setIsEditMode] = useState(false);
  const [selectedSets, setSelectedSets] = useState<string[]>([]);

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

  const toggleEditMode = () => {
    setIsEditMode(!isEditMode);
    setSelectedSets([]);
  };

  const toggleSelectSet = (id: string) => {
    setSelectedSets((prev) => 
      prev.includes(id) ? prev.filter((setId) => setId != id): [...prev, id]
    );
  };

  // Delete textbox confirmation box
  const confirmDelete = () => {
    Alert.alert(
      'Delete Flashcard Sets',
      `Are you sure you want to delete ${selectedSets.length} selected set(s)?`,
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Delete', style: 'destructive', onPress: handleDelete, },
      ]
    );
  };

  const handleDelete = async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        throw new Error('User not authenticated');
      }

      for (const setId of selectedSets) {
        const setRef = doc(db, `users/${uid}/vocabsets/${setId}`);
        await deleteDoc(setRef);
      }

      setSelectedSets([]);
      fetchFlashcardSets();
      setIsEditMode(false);
    } catch (error) {
      console.error('Error deleting flashcard sets:', error);
    }
  };

  // Render each flashcard set as a button
  const renderFlashcardSet = ({item}: {item: {id: string; title: string; vocab: any[]}}) => (
    <TouchableOpacity
      style={[
        styles.flashcardButton,
        isEditMode && styles.editModeButton,
        selectedSets.includes(item.id) && styles.selectedSet,
      ]}
      onPress={() => {
        if (isEditMode) {
          toggleSelectSet(item.id);
        } else {
          navigation.navigate('FlashcardScreen', {
            setId: item.id,
            vocab: item.vocab,
            title: item.title,
            frontContent: item.frontContent,
            backContent: item.backContent,
          });
        }
      }}
    >
      <View style={styles.flashcardContent}>
        <View style={styles.textContainer}>
          <Text style={styles.flashcardButtonText}>{item.title || 'Untitled Set'}</Text>
        </View>
        {isEditMode && (
        <View style={styles.checkbox}>
          <Text style={selectedSets.includes(item.id) ? styles.checkboxSelected : styles.checkboxUnselected}>
            {selectedSets.includes(item.id) ? '✓' : ''}
          </Text>
        </View>
      )}
      </View>     
    </TouchableOpacity>
  );
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          barStyle="dark-content"
          backgroundColor="#EFE7EC"
          translucent
        />
      <View style={styles.header}>
        <Text style={styles.headerText}>Flashcard Sets</Text>
        <TouchableOpacity onPress={toggleEditMode}>
          <Text style={styles.editButtonText}>{isEditMode ? 'Done' : 'Edit'}</Text>
        </TouchableOpacity>
      </View>
      <FlatList
        data={flashcardSets}
        renderItem={renderFlashcardSet}
        keyExtractor={(item) => item.id}
        contentContainerStyle={{ paddingBottom: 0}}
        ListEmptyComponent={
          <Text style={styles.emptyMessage}>
            No flashcard sets available. Add a new set to get started!
          </Text>}
        />
        {isEditMode && selectedSets.length > 0 && (
          <TouchableOpacity style={styles.deleteButton} onPress={confirmDelete}>
            <Text style={styles.deleteButtonText}>Delete Selected</Text>
          </TouchableOpacity>
        )}
        </SafeAreaView>
    </View>
  );
};

export default LibraryScreen;