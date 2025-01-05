import React, { useCallback, useState } from 'react';
import {
  View,
  Text,
  FlatList, 
  TouchableOpacity,
  Modal,
  StatusBar,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../../firebase/firebaseConfig';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './CharactersScreen.styles';

const CharactersScreen = () => {
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  
  const fetchCharacters = async () => {
    try {
      const uid = auth.currentUser?.uid;
      if (!uid) {
        throw new Error('User not authenticated.');
      }
      
      // Fetch all files under CharacterAndVocabData
      const collectionRef = collection(db, `users/${uid}/CharacterAndVocabData`);
      const filesSnapshot = await getDocs(collectionRef);

      // Iterate over files to get characters
      const charactersData = [];
      filesSnapshot.docs.forEach((fileDoc) => {
        const fileData = fileDoc.data();

        if (fileData.characters && Array.isArray(fileData.characters)) {
          fileData.characters.forEach((character) => 
            charactersData.push({ id: character.id, ...character})
          );
        }
      })
      console.log('Fetched characters:', charactersData); // Debugging log
      setCharacters(charactersData);
    } catch (error) {
      console.error('Error fetching characters:', error);
    }
  };
  // Handles character press
  const handleCharacterPress = (character) => {
    setSelectedCharacter(character);
    setModalVisible(true);
  };

  const renderCharacter = ({ item }) => (
    <TouchableOpacity
      style={styles.characterBox}
      onPress={() => handleCharacterPress(item)}
    >
      <Text style={styles.characterText}>{item.character}</Text>
    </TouchableOpacity>
  );

  // Re-fetch vocab whenever screen is focused
  useFocusEffect(
    useCallback(() => {
      fetchCharacters();
    }, [])
  );

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar
          translucent
          backgroundColor="transparent"
          barStyle="dark-content" 
        />
        <Text style={styles.title}>Characters</Text>
        <FlatList
          data={characters}
          renderItem={renderCharacter}
          keyExtractor={(item) => item.id}
          numColumns={5}
          contentContainerStyle={styles.grid}
        />
        <Modal visible={modalVisible} transparent={true} animationType="slide">
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalTitle}>{selectedCharacter?.character}</Text>
              {selectedCharacter?.pinyin && (
                <Text style={styles.modalPinyin}>
                  Pinyin: {selectedCharacter.pinyin}
                </Text>
              )}
              {selectedCharacter?.definition && (
                <Text style={styles.modalDefinition}>
                  Definition: {selectedCharacter.definition}
                </Text>
              )}
              {selectedCharacter?.phrases?.length > 0 && (
                <>
                  <Text style={styles.modalPhraseHeader}>Phrases:</Text>
                  {selectedCharacter.phrases.map((phrase, index) =>
                    <Text key={index} style={styles.modalPhrase}>
                      {phrase.phrase} ({phrase.phrase_pinyin}): {phrase.phrase_definition}
                    </Text>
                  )}
                </>
              )}
              <Text style={styles.modalSets}>
                Sets: {selectedCharacter?.sets?.join(', ')}
              </Text>
              <TouchableOpacity
                style={styles.closeButton} onPress={() => setModalVisible(false)}
              >
                <Text style={styles.closeButtonText}>Close</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>
      </SafeAreaView>
    </View>
  );
};

export default CharactersScreen;