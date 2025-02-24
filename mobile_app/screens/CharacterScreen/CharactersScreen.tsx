import React, { useCallback, useState } from 'react';
import {
  View,
  Text, 
  TouchableOpacity,
  Modal,
  StatusBar,
} from 'react-native';
import { useFocusEffect } from '@react-navigation/native';
import { collection, getDocs } from 'firebase/firestore';
import { db, auth } from '../../firebase/firebaseConfig';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import { SectionGrid } from 'react-native-super-grid';
import styles from './CharactersScreen.styles';

const CharactersScreen = () => {
  const [sections, setSections] = useState([]);
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

      // Group characters by title
      const groupedSections = [];
      filesSnapshot.docs.forEach((fileDoc) => {
        const fileData = fileDoc.data();

        if (fileData.characters && Array.isArray(fileData.characters)) {
          groupedSections.push({
            title: fileDoc.id,
            data: fileData.characters,
          });
        }
      });
      console.log('Grouped Sections:', groupedSections); // Debugging log
      setSections(groupedSections);
    } catch (error) {
      console.error('Error fetching characters:', error);
    }
  };
  // Handles character press
  const handleCharacterPress = (character) => {
    //console.log("Character selected:", character);
    //console.log("Generated HTML for WebView:", getHtmlContent(character.character));
    setSelectedCharacter(character);
    setModalVisible(true);
  };

  // Generate HanziWriter HTML content for WebView
  const getHtmlContent = (character) => 
    `
    <!DOCTYPE html>
    <html lang="en">
    <head>
      <meta charset="UTF-8">
      <meta name="viewport" content="width=device-width, initial-scale=1.0">
      <script src="https://cdn.jsdelivr.net/npm/hanzi-writer@3.5/dist/hanzi-writer.min.js"></script>
      <style>
        body {
          display: flex;
          justify-content: center;
          align-items: center;
          height: 100%;
          margin: 0;
        }
        #character-target {
          width: 150px;
          height: 150px;
        }
      </style>
    </head>
    <body>
      <div id="character-target"></div>
      <script>
        console.log("HanziWriter Scriptloaded");
        var writer = HanziWriter.create('character-target', '${character}', {
          width: 150,
          height: 150,
          padding: 5,
          strokeAnimationSpeed: 2,
          radicalColor: '#168F16',
          showOutline: true,
        });

        writer.animateCharacter();
        console.log("HanziWriter animation started");
      </script>
    </body>
    </html>
  `;

  const renderCharacter = ({ item }) => (
    <TouchableOpacity
      style={styles.characterBox}
      onPress={() => handleCharacterPress(item)}
    >
      <Text style={styles.characterText}>{item.character}</Text>
    </TouchableOpacity>
  );

  const renderSectionHeader = ({ section: { title } }) => (
    <View style={styles.sectionHeader}>
      <Text style={styles.sectionHeaderText}>{title}</Text>
    </View>
  )

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

        {sections.length === 0 ? (
          <Text style={styles.emptyMessage}>
            No characters available. Add a set to get started!
          </Text>
        ) : (
          <SectionGrid
            sections={sections}
            itemDimension={60}
            spacing={10}
            renderItem={({ item }) => (
              <TouchableOpacity
                style={styles.characterBox}
                onPress={() => handleCharacterPress(item)}
              >
                <Text style={styles.characterText}>{item.character}</Text>
              </TouchableOpacity>
            )}
            renderSectionHeader={({ section }) => (
              <View style={styles.sectionHeader}>
                <Text style={styles.sectionHeaderText}>{section.title}</Text>
              </View>
            )}
          />
        )}
        <Modal visible={modalVisible} transparent={true}>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              {selectedCharacter?.pinyin && (
                <Text style={styles.modalPingyin}>
                  {selectedCharacter.pinyin}
                </Text>
              )}
              {selectedCharacter?.character && (
                <WebView
                  originWhitelist={['*']}
                  source={{ html: getHtmlContent(selectedCharacter.character) }}
                  javaScriptEnabled={true}
                  domStorageEnabled={true}
                  allowFileAccess={true}
                  allowUniversalAccessFromFileURLs={true}
                  style={{ width: 100, height: 100, backgroundColor: 'transparent' }}
                  onLoad={() => console.log("WebView Loaded Successfully")}
                  onError={(e) => console.error("WebView Error:", e.nativeEvent)}
                />
              )}
              {selectedCharacter?.definition && (
                <Text style={styles.modalDefinition}>
                  Definition: {selectedCharacter.definition}
                </Text>
              )}
              {selectedCharacter?.phrases?.length > 0 && (
                <>
                  <Text style={styles.modalPhraseHeader}>Phrases:</Text>
                  {selectedCharacter.phrases.map((phrase, index) => (
                    <Text key={index} style={styles.modalPhrase}>
                      {phrase.phrase} ({phrase.phrase_pinyin}): {phrase.phrase_definition}
                    </Text>
                  ))}
                </>
              )}
              <Text style={styles.modalSets}>
                Sets: {selectedCharacter?.sets?.join(', ')}
              </Text>
              <TouchableOpacity
                style={styles.closeButton}
                onPress={() => setModalVisible(false)}
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