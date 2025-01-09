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
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './CreateSetScreen.styles';


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

            // Reset CreateSetScreen state
            setTitle('');
            setFlashcards([
                { character: '', pinyin: '', definition: '' },
                { character: '', pinyin: '', definition: '' },
            ]);

            Alert.alert('Success', 'Set created successfully!');
            navigation.navigate('Library', { screen: 'LibraryMain' });
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
                                value={card.character}
                                onChangeText={(text) =>
                                    setFlashcards((prev) => {
                                        const updated = [...prev];
                                        updated[index].character = text;
                                        return updated;
                                    })
                                }
                                // Makes sure that only chinese characters are allowed as an input
                                onEndEditing={() => {
                                    const chineseRegex = /^[\u4e00-\u9fa5]+$/; // Strictly Chinese characters
                                    const currentCharacter = flashcards[index].character;
                                    if (!chineseRegex.test(currentCharacter)) {
                                        Alert.alert('Invalid Input', 'Please ensure only Chinese characters are entered.');
                                        setFlashcards((prev) => {
                                            const updated = [...prev];
                                            updated[index].character = ''; // Clear invalid input
                                            return updated;
                                        });
                                    }
                                }}
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