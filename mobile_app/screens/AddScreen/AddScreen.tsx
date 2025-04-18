import React, { useState } from 'react';
import {
    View,
    Text,
    Button,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    TextInput,
    StatusBar,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker'; // For picking a file
import axios from 'axios'; // Necessary to send request to the Flask API
import { useNavigation } from '@react-navigation/native'
import { auth, db } from '../../firebase/firebaseConfig';
import { SafeAreaView } from 'react-native-safe-area-context';
import { collection, addDoc, doc, setDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons'

import styles from './AddScreen.styles';

const AddScreen = () => {
    const [loading, setLoading] = useState(false); // While calling API shows a spinner
    const [vocabData, setVocabData] = useState([]); // For storing vocabulary data
    const [characterData, setCharacterData] = useState([]); // For storing invidual characters
    const [fileName, setFileName] = useState(''); // For storing file name
    const [error, setError] = useState(''); // For storing error messages

    const navigation = useNavigation();

    // Handle File Selection
    const pickDocument = async () => {
        setError(''); // Clears the exisitng errors
        try {
            const result = await DocumentPicker.getDocumentAsync({
                type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document', // Restrict to .docx
            });

            if (result.canceled) {
                console.log('File selection canceled');
                return;
            }

            uploadFile(result);
        } catch (e) {
            console.error('Error picking document:', e);
            setError('Could not pick a file. Please try again');
        }
    };

    // Process to upload the selected file to Flask API
    const uploadFile = async (file: any) => {
        setLoading(true); // loading spinner
        const formData = new FormData();


        // Append file to formData
        formData.append('file', {
            uri: file.assets[0].uri,
            name: file.assets[0].name || 'badname_file.docx',
            type: file.assets[0].mimeType,
        } as any);

        // Logging the formData for debug purposes
        console.log('File to upload:', file);
        console.log('FormData:', formData);
        try {
            // Sending the POST request to the Flask server
            const response = await axios.post("http://10.186.182.141:5000/upload", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Save extracted data
            setVocabData(response.data.vocab);
            setCharacterData(response.data.characters);
            setFileName(file.assets[0].name.replace('.docx', ''));
        } catch (e: any) {
            console.error('Error uploading file:', e);
            setError(e.message || 'An error occurred during the upload.');
        } finally {
            setLoading(false); // Hide the loading spinner
        }
    };

    // Handle Save to Library
    const saveToLibrary = async () => {
        console.log("Saving...");
        if (vocabData.length === 0 && characterData.length === 0) {
            setError('No vocabulary or character data to save');
            return;
        }
    
        const uid = auth.currentUser?.uid;
        if (!uid) {
            console.error('User not authenticated.');
            throw new Error('User not authenticated.');
        }
    
        try {
            // Reference to the document for this file in CharacterAndVocabData
            const fileDocRef = doc(db, `users/${uid}/CharacterAndVocabData/${fileName}`);
    
            // Set the metadata and data in one call
            await setDoc(fileDocRef, {
                title: fileName,
                createdAt: new Date(),
                vocab: vocabData, // Store vocab as an array
                characters: characterData, // Store characters as an array
            });
    
            console.log(`Data saved to: users/${uid}/CharacterAndVocabData/${fileName}`);
    
            // Reset states
            setVocabData([]);
            setCharacterData([]);
            setFileName('');
            setError('');
    
            // Navigate to Library Screen with vocab data
            navigation.navigate('Library');
        } catch (error) {
            console.error('Error saving to library:', error);
            setError('Error saving data. Please try again.');
        }
    };

    // Cancel current upload
    const cancelCreation = () => {
        setVocabData([]);
        setFileName('');
        setError('');
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <StatusBar
                    barStyle="dark-content"
                    backgroundColor="#EFE7EC"
                    translucent
                />
                <Text style={styles.header}>Create a Flashcard Set</Text>

                <TouchableOpacity style={styles.button} onPress={pickDocument}>
                    <Text style={styles.buttonText}>Auto Generate (.docx only)</Text>
                </TouchableOpacity>

                <TouchableOpacity style={styles.button} onPress={() => navigation.navigate('CreateSetScreen')}>
                    <Text style={styles.buttonText}>Create Set From Scratch</Text>
                </TouchableOpacity>

                {loading && <ActivityIndicator size="large" color="#6F4E7C"/>}

                {error ? <Text style={styles.error}>{error}</Text> : null}

                {vocabData.length > 0 && (
                    <>
                        {/* Text Input to edit the flashcard set title */}
                        <Text style={styles.resultsHeader}>Title:</Text>
                        <TextInput
                            value={fileName}
                            onChangeText={setFileName}
                            style={styles.textInput}
                        />

                        {/* Scroll view for extracted vocab */}
                        <ScrollView style={styles.resultsContainer}>
                            <Text style={styles.resultsHeader}>Extracted Vocabulary:</Text>
                            {vocabData.map((item, index) => (
                                <Text key={index} style={styles.vocabItem}>
                                    {item.Character} ({item.Pinyin}): {item.Definition}
                                </Text>
                            ))}
                        </ScrollView>

                        {/* Button to save flashcards */}
                        <View style={styles.buttonRow}>
                            <TouchableOpacity style={styles.cancelButton} onPress={cancelCreation}>
                                <Icon name="cancel" size={20} color="#FFF" />
                                <Text style={styles.cancelButtonText}>Cancel</Text>
                            </TouchableOpacity>

                            <TouchableOpacity style={styles.saveButton} onPress={saveToLibrary}>
                                <Icon name="check" size={20} color="#FFF" />
                                <Text style={styles.saveButtonText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </>
                )}
            </SafeAreaView>
        </View>
    );
};

export default AddScreen;