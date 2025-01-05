import React, { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList, 
  TouchableOpacity,
  Modal,
  StatusBar,
} from 'react-native';
import { collection, getDocs, onSnapshot } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './CharactersScreen.styles';

const CharactersScreen = () => {
  const [characters, setCharacters] = useState([]);
  const [selectedCharacter, setSelectedCharacter] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);

  /*
  useEffect(() => {
    // Fetch and listen for updates in the 'characters' collection
    const unsubscribe = onSnapshot(collection(db, 'characters'), (snapshot) => {
      const charactersData = [];
      snapshot.forEach((doc) => {
        charactersData.push({ id: doc.id, ...doc.data() });
      });
      setCharacters(charactersData);
    });
    return () => unsubscribe();
  }, []); */

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
              {selectedCharacter?.phrase && (
                <Text style={styles.modalPhrase}>
                  Phrase: {selectedCharacter.phrase.replace(
                    selectedCharacter.character,
                    `[${selectedCharacter}]`
                  )}
                </Text>
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