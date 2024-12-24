import React, { useState } from 'react';
import {
    View,
    Text,
    Button,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker'; // For picking a file
import axios from 'axios'; // Necessary to send request to the Flask API
import { useNavigation } from '@react-navigation/native'
import { StackNavigationProp } from '@react-navigation/stack';
import { RootStackParamList } from '../../types/types';
import styles from './AddScreen.styles';
type AddScreenNavigationProp = StackNavigationProp<RootStackParamList, 'Add'>;

const AddScreen = () => {
  const [loading, setLoading] = useState(false); // While calling API shows a spinner
  const [vocabData, setVocabData]= useState([]); // For storing vocabulary data
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

        console.log('Navigating to LibraryMain with data:', {
            extractedVocab: response.data.vocab,
            fileName: file.assets[0].name.replace('.docx', ''),
        });
        
          // Navigate to LibraryScreen with extracted vocab and file name
          navigation.navigate('Library', {
            screen: 'LibraryMain', // Parent and nested screen names
            params: {
              extractedVocab: response.data.vocab,
              fileName: file.assets[0].name.replace('.docx', ''),
              frontContent: 'Word',
              backContent: 'Definition',
            },
          });
    } catch (e: any) {
        console.error('Error uploading file:', e);
        setError(e.message || 'An error occurred during the upload.');
    } finally {
        setLoading(false); // Hide the loading spinner
    }
  };

  // Handle Save to Library
  const saveToLibrary = () => {
    if (vocabData.length === 0) {
        setError('No vocabulary data to save');
        return;
    }

    // Navigate to Library Screen with vocab data
    navigation.navigate('Library', {extractedVocab: vocabData});
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
            <ScrollView style={styles.resultsContainer}>
                <Text style={styles.resultsHeader}>Extracted Vocabulary:</Text>
                {vocabData.map((item, index) => (
                    <Text key={index} style={styles.vocabItem}>
                        {item.Word} ({item.Pinyin}): {item.Definition}
                    </Text>
                ))}
            </ScrollView>
        )}

        {vocabData.length > 0 && (
            <TouchableOpacity style={styles.saveButton} onPress={saveToLibrary}>
                <Text style={styles.saveButtonText}>Save to Library</Text>
            </TouchableOpacity>
        )}
    </View>
  );
};

export default AddScreen;