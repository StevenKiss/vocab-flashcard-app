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
import { useNavigation, CommonActions } from '@react-navigation/native';
import axios from 'axios';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './CreateSetScreen.styles';


const CreateSetScreen = () => {
    const [title, setTitle] = useState('');
    const [flashcards, setFlashcards] = useState([
        { Character: '', Pinyin: '', Definition: ''},
        { Character: '', Pinyin: '', Definition: ''},
    ]);

    const navigation = useNavigation();
    

    const addFlashcard = () => {
        setFlashcards([...flashcards, { Character: '', Pinyin: '', Definition: ''}]);
    }

    const deleteFlashcard = (index) => {
        Alert.alert(
            'Confirm Delete',
            'Are you sure you want to delete this flashcard?',
            [
                { text: 'Cancel', style: 'cancel'},
                {
                    text: 'Delete',
                    style: 'destructive',
                    onPress: () => {
                        setFlashcards((prev) => prev.filter((_, i) => i !==index));
                    },
                },
            ]
        );
    };

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
            const newSet = {
                title,
                createdAt: new Date(),
                vocab: flashcards,
                characters: [],
            };

            // Send vocab to backend for character extraction (remeber to update when on new IP each time)
            const response = await axios.post("http://192.168.4.23:5000/process_vocab", newSet)

            if (response.status === 200 && response.data.characters) {
                newSet.characters = response.data.characters;

                // Save the set to Firestore
                const setId = title.replace(/\s+/g, '-').toLowerCase();
                const docRef = doc(db, `users/${uid}/CharacterAndVocabData/${setId}`);
                await setDoc(docRef, newSet);

                Alert.alert('Success', 'Set created successfully!');
                
                // Reset CreateSetScreen state
                setTitle('');
                setFlashcards([
                    { Character: '', Pinyin: '', Definition: '' },
                    { Character: '', Pinyin: '', Definition: '' },
                ]);

                // Reset the add stack back to its base
                navigation.dispatch(
                    CommonActions.reset({
                      index: 0,
                      routes: [{ name: 'Library', params: { screen: 'LibraryMain' } }],
                    })
                );

            } else {
                throw new Error('Failed to extract characters');
            }
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
                            {/* Card info (Number and Delete) */}
                            <View style={styles.cardInfoContainer}>
                                <Text style={styles.cardNumber}>{index + 1}</Text>

                                <TouchableOpacity
                                    style={styles.deleteButton}
                                    onPress={() => deleteFlashcard(index)}
                                >
                                    <Icon name="remove" size={24} color="red" />
                                </TouchableOpacity>
                            </View>
                            
                            {/* Card Inputs */}
                            <TextInput
                                style={styles.input}
                                placeholder="Character(s)"
                                value={card.Character}
                                onChangeText={(text) =>
                                    setFlashcards((prev) => {
                                        const updated = [...prev];
                                        updated[index].Character = text;
                                        return updated;
                                    })
                                }
                                // Makes sure that only chinese characters are allowed as an input
                                onEndEditing={() => {
                                    const chineseRegex = /^[\u4e00-\u9fa5]+$/; // Strictly Chinese characters
                                    const currentCharacter = flashcards[index].Character;
                                    if (currentCharacter !== '' && !chineseRegex.test(currentCharacter)) {
                                        Alert.alert('Invalid Input', 'Please ensure only Chinese characters are entered.');
                                        setFlashcards((prev) => {
                                            const updated = [...prev];
                                            updated[index].Character = ''; // Clear invalid input
                                            return updated;
                                        });
                                    }
                                }}
                            />

                            <TextInput
                                style={styles.input}
                                placeholder="Pinyin"
                                value={card.Pinyin}
                                onChangeText={(text) =>
                                    setFlashcards((prev) => {
                                        const updated = [...prev];
                                        updated[index].Pinyin = text;
                                        return updated;
                                    })
                                }
                            />
                            <TextInput
                                style={styles.input}
                                placeholder="Definition"
                                value={card.Definition}
                                onChangeText={(text) =>
                                    setFlashcards((prev) => {
                                        const updated = [...prev];
                                        updated[index].Definition = text;
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