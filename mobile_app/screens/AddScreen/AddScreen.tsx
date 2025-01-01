import React, { useState } from 'react';
import {
    View,
    Text,
    Button,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
    TextInput,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker'; // For picking a file
import axios from 'axios'; // Necessary to send request to the Flask API
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/types';
import { auth, db } from '../../firebase/firebaseConfig';
import { collection, addDoc } from 'firebase/firestore';
import Icon from 'react-native-vector-icons/MaterialIcons'

import styles from './AddScreen.styles';

type AddScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Add'>;

const AddScreen = () => {
    const [loading, setLoading] = useState(false); // While calling API shows a spinner
    const [vocabData, setVocabData]= useState([]); // For storing vocabulary data
    const [fileName, setFileName] = useState(''); // For storing file name

    const [error, setError] = useState(''); // For storing error messages


    const navigation = useNavigation<AddScreenNavigationProp>();

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
        try{
            // Sending the POST request to the Flask server
            const response = await axios.post("http://10.0.0.72:5000/upload", formData, {
                headers: {
                    'Content-Type': 'multipart/form-data',
                },
            });

            // Save extracted data
            setVocabData(response.data.vocab);
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
        if (vocabData.length === 0) {
            setError('No vocabulary data to save');
            return;
        }

        const uid = auth.currentUser?.uid;
        if (!uid) {
            throw new Error('User not authenticated.');
        }

        const vocabsetsRef = collection(db, `users/${uid}/vocabsets`);
        await addDoc(vocabsetsRef, {
            title: fileName,
            vocab: vocabData,
            createdAt: new Date(),
        });

        setVocabData([]);
        setFileName('');
        // Navigate to Library Screen with vocab data
        navigation.navigate('Library');
    };

    // Cancel current upload
    const cancelCreation = () => {
        setVocabData([]);
        setFileName('');
        setError('');
    };

    return (
        <View style={styles.container}>
            <Text style={styles.header}>Upload a DOCX to Generate Flashcards</Text>

            <TouchableOpacity style={styles.button} onPress={pickDocument}>
                <Text style={styles.buttonText}>Choose DOCX</Text>
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
        </View>
    );
};

export default AddScreen;