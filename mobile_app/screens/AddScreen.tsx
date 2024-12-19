import React, {useState} from 'react';
import {
    View,
    Text,
    Button,
    StyleSheet,
    TouchableOpacity,
    ActivityIndicator,
    ScrollView,
} from 'react-native';
import * as DocumentPicker from 'expo-document-picker'; // For picking a file
import axios from 'axios'; // Necessary to send request to the Flask API

const AddScreen = () => {
  const [loading, setLoading] = useState(false); // While calling API shows a spinner
  const [vocabData, setVocabData]= useState([]); // For storing vocabulary data
  const [error, setError] = useState(''); // For storing error messages

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

    console.log('Selected file:', file);
    console.log("Selected file:", file.assets[0]);
    console.log("File URI:", file.assets[0].uri);
    console.log("File Name:", file.assets[0].name);
    console.log("File MIME Type:", file.assets[0].mimeType);
    console.log("File Size:", file.assets[0].size);

    // Append file to formData
    formData.append('file', {
        uri: file.assets[0].uri,
        name: file.assets[0].name || 'badname_file.docx',
        type: file.assets[0].mimeType,
        //type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    } as any);

    // Logging the formData for debug purposes
    console.log('File to upload:', file);
    console.log('FormData:', formData);
    try{
        // Sending the POST request to the Flask server
        const response = await axios.post("http://192.168.1.9:5000/upload", formData, {
            headers: {
                'Content-Type': 'multipart/form-data',
            },
        });

        // Update state with vocab data
        setVocabData(response.data.vocab);
        console.log('Vocab data received:', response.data.vocab);
    } catch (e: any) {
        console.error('Error uploading file:', e);
        setError(e.message || 'An error occurred during the upload.');
    } finally {
        setLoading(false); // Hide the loading spinner
    }
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
    </View>
  );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#F7F3F7',
    },
    header: {
        fontSize: 18,
        fontWeight: 'bold',
        marginBottom: 20,
        marginTop: 30,
        textAlign: 'center',
        color: '#6F4E7C',
    },
    button: {
        backgroundColor: '#6F4E7C',
        paddingVertical: 12,
        paddingHorizontal: 20,
        borderRadius: 10,
        marginVertical: 10,
        alignItems: 'center',
    },
    buttonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
    },
    error: {
        color: 'red',
        textAlign: 'center',
        marginVertical: 10,
    },
    resultsContainer: {
        marginTop: 20,
        flex: 1,
    },
    resultsHeader: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#6F4E7C',
    },
    vocabItem: {
        fontSize: 14,
        marginBottom: 5,
    },
});

export default AddScreen;