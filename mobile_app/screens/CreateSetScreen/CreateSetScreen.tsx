import React, { useState } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ScrollView,
    Alert,
    StatusBar,
} from 'react-native';
import { db, auth } from '../../firebase/firebaseConfig';
import { doc, setDoc } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useNavigation } from '@react-navigation/native'
import styles from './CreateSetScreen.styles'

const CreateSetScreen = () => {
    const [title, setTitle] = useState('');
    const [flashcards, setFlashcards] = useState([
        { character: '', pinyin: '', definition: ''},
        { character: '', pinyin: '', definition: ''},
    ]);

    const navigation = useNavigation();
    

    const addFlashcard = () => {
        setFlashcards([...flashcards, { character: '', pinyin: '', definition: ''}]);
    }

    const handleSaveSet = async () => {
        if (!title.trim()) {
            Alert.alert('Error', 'Please provide a title for the set.');
            return;
        }

        const uid = auth.currentUser?.uid;
        if (!uid) {
            Alert.alert('Error', 'User not authenticated.');
            return;
        }

        try {
            const setId = title.replace(/s\s+/g, '-').toLowerCase();
            const newSet = {
                title,
                createadAt: new Date(),
                vocab: flashcards,
                characters: [],//Need to have it send it to backend and just process the characters Part
            };

            // Svae the set to Firestore
            const docRef = doc(db, `users/${uid}/CharacterAndVocabData/${setId}`);
            await setDoc(docRef, newSet);

            Alert.alert('Success', 'Set created successfully!');
            navigation.navigate('Libaray');
        } catch (error) {
            console.error('Error saving set:', error);
            Alert.alert('Error', 'Failed to save the set. Please try again.');
        }
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <StatusBar 
                    translucent 
                    backgroundColor="trasnparent" 
                    barStyle="dark-content"
                />
                <Text style={styles.header}>Create a New Vocabulary Set</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Enter Title"
                    value={title}
                    onChangeText={setTitle}
                />
                <ScrollView style={styles.scrollView}>
                    {flashcards.map((card, index) => (
                        <View key={index} style={styles.card}>
                            <TextInput
                                style={styles.input}
                                placeholder="Character(s)"
                                value={card.character}
                                onChangeText={(text) =>
                                    setFlashcards((prev) => {
                                        const updated = [...prev];
                                        updated[index].character = text;
                                        return updated;
                                    })
                                }
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Pinyin"
                                value={card.pinyin}
                                onChangeText={(text) =>
                                    setFlashcards((prev) => {
                                        const updated = [...prev];
                                        updated[index].pinyin = text;
                                        return updated;
                                    })
                                }
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Definition"
                                value={card.definition}
                                onChangeText={(text) =>
                                    setFlashcards((prev) => {
                                        const updated = [...prev];
                                        updated[index].definition = text;
                                        return updated;
                                    })
                                }
                            />
                        </View>
                    ))}
                    <TouchableOpacity style={styles.addButton} onPress={addFlashcard}>
                        <Text style={styles.addButtonText}>+ Add Flashcard</Text>
                    </TouchableOpacity>
                </ScrollView>
                <View style={styles.buttonRow}>
                    <TouchableOpacity style={styles.cancelButton} onPress={() => navigation.goBack()}>
                        <Text style={styles.cancelButtonText}>Cancel</Text>
                    </TouchableOpacity>
                    <TouchableOpacity style={styles.saveButton} onPress={handleSaveSet}>
                        <Text style={styles.saveButtonText}>Create</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
};

export default CreateSetScreen;