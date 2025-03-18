import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    FlatList,
    TouchableOpacity,
    Modal,
    StatusBar,
    Animated,
    Alert
} from 'react-native';
import { db, auth } from '../../firebase/firebaseConfig';
import { doc, deleteDoc } from 'firebase/firestore';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/MaterialIcons';
import { Picker } from '@react-native-picker/picker';
import styles from './SetPreviewScreen.styles';

const SetPreviewScreen = ({ navigation, route }) => {
    const { setTitle, cards, progress, creationDate, setId } = route.params || {};

    const [optionsModalVisible, setOptionsModalVisible] = useState(false);
    const [customizeModalVisible, setCustomizeModalVisible] = useState(false);
    const [frontContent, setFrontContent] = useState('Character');
    const [backContent, setBackContent] = useState('Definition');
    const [flippedStates, setFlippedStates] = useState(
        Array(cards.length).fill(false)
    );
    const flipAnimations = useState(cards.map(() => new Animated.Value(0)))[0];
    console.log('Front Content:', frontContent);
    console.log('Back Content:', backContent);

    // Helper functions for card flipping functionality
    const flipCard = (index) => {
        const toValue = flippedStates[index] ? 0 : 180;
        Animated.timing(flipAnimations[index], {
            toValue,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            const updatedFlippedStates = [...flippedStates];
            updatedFlippedStates[index] = !flippedStates[index];
            setFlippedStates(updatedFlippedStates);
        });
    };

    const flipToFrontStyle = (index) => ({
        transform: [
            {
                rotateY: flipAnimations[index].interpolate({
                    inputRange: [0, 180],
                    outputRange: ['0deg', '180deg'],
                }),
            },
        ],
    });

    const flipToBackStyle = (index) => ({
        transform: [
            {
                rotateY: flipAnimations[index].interpolate({
                    inputRange: [0, 180],
                    outputRange: ['180deg', '360deg'],
                }),
            },
        ],
    });

    const renderCard = ({ item, index }) => (
        <View style={styles.cardWrapper}>
            <TouchableOpacity
                style={styles.cardInnerContainer}
                onPress={() => flipCard(index)}
                activeOpacity={1}
            >
                {/* Front Card */}
                <Animated.View
                    style={[
                        styles.card,
                        styles.cardFront,
                        flipToFrontStyle(index),
                    ]}
                >
                    <Text style={styles.cardText}>{item[frontContent] || 'No content'}</Text>
                </Animated.View>

                {/* Back Card */}
                <Animated.View
                    style={[
                        styles.card,
                        styles.cardBack,
                        flipToBackStyle(index),
                    ]}
                >
                    <Text style={styles.cardText}>{item[backContent] || 'No content'}</Text>
                </Animated.View>
            </TouchableOpacity>
        </View>
    );

    // Confirm if user Wants to Delete the Set
    const confirmDelete = () => {
        Alert.alert(
            'Delete Flashcard Sets',
            `Are you sure you want to delete ${setTitle}?`,
            [
                { text: 'Cancel', style: 'cancel' },
                { text: 'Delete', style: 'destructive', onPress: handleDelete, },
            ]
        );
    };

    // Delete the set
    const handleDelete = async () => {
        try {
            const uid = auth.currentUser?.uid;
            if (!uid) {
                throw new Error('User not authenticated');
            }
            
            const setRef = doc(db, `users/${uid}/CharacterAndVocabData/${setId}`);
            await deleteDoc(setRef);
            Alert.alert('Success', `${setTitle} has been deleted.`);
            navigation.goBack();
        } catch (error) {
            console.error('Error deleting flashcard sets:', error);
            Alert.alert('Error', 'Could not delete the flashcard set. Please try again');
        }
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
                {/* Header */}
                <View style={styles.header}>
                    <TouchableOpacity onPress={() => navigation.navigate('LibraryMain')}>
                        <Icon name="close" size={24} color="#6F4E7C" />
                    </TouchableOpacity>
                    <Text style={styles.title}>{setTitle}</Text>
                    <TouchableOpacity onPress={() => setOptionsModalVisible(true)}>
                        <Icon name="more-vert" size={24} color="#6F4E7C" />
                    </TouchableOpacity>
                </View>

                {/* Progress */}
                <Text style={styles.progressText}>Progress: {progress}</Text>

                {/* Customize Button */}
                <TouchableOpacity
                    style={styles.customizeButton}
                    onPress={() => setCustomizeModalVisible(true)}
                >
                    <Text style={styles.customizeButtonText}>
                        Customize: Front and Back
                    </Text>
                </TouchableOpacity>
                
                {/* Embedded Flashcards */}
                <FlatList
                    data={cards}
                    renderItem={renderCard}
                    keyExtractor={(item, index) => index.toString()}
                    contentContainerStyle={styles.cardListContainer}
                />

                {/* Bottom Buttons */}
                <View style={styles.bottomButtons}>
                    <TouchableOpacity
                        style={styles.actionButton}
                        onPress={() =>
                            navigation.navigate('FlashcardScreen', {
                                title: setTitle,
                                vocab: cards,
                                frontContent,
                                backContent,
                                setId,
                            })
                        }
                    >
                        <Text style={styles.buttonText}>Flashcards</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.writeModeButton]}
                        onPress={() => 
                            navigation.navigate('WriteScreen', {
                                title: setTitle,
                                vocab: cards,
                                frontContent,
                                setId,
                            })
                        }
                    >
                        <Text style={styles.buttonText}>Write</Text>
                    </TouchableOpacity>
                </View>

                {/* Options Modal */}
                <Modal
                    visible={optionsModalVisible}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setOptionsModalVisible(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.modalContent}>
                            {/*<TouchableOpacity
                                onPress={() => {
                                    setOptionsModalVisible(false);
                                    Alert.alert('Set Info', `Created: ${creationDate}\nTotal Cards: ${cards.length}`);
                                }}
                                style={styles.modalOption}
                            >
                                <Text style={styles.modalOptionText}>Info</Text>
                            </TouchableOpacity>*/}
                            <TouchableOpacity
                                onPress={() => {
                                    setOptionsModalVisible(false);
                                    navigation.navigate('EditScreen', {setId: setId});
                                }}
                                style={styles.modalOption}
                            >
                                <Text style={styles.modalOptionText}>Edit</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setOptionsModalVisible(false);
                                    confirmDelete();
                                }}
                                style={[styles.modalOption, { backgroundColor: '#E63946' }]}
                            >
                                <Text style={[styles.modalOptionText, { color: '#FFF' }]}>Delete</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                style={styles.modalCloseButton}
                                onPress={() => setOptionsModalVisible(false)}
                            >
                                <Text style={styles.closeText}>Close</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>

                {/* Customization Modal */}
                <Modal
                    visible={customizeModalVisible}
                    transparent
                    animationType="fade"
                    onRequestClose={() => setCustomizeModalVisible(false)}
                >
                    <View style={styles.pickerModal}>
                        <View style={styles.pickerContainer}>
                            <Text style={styles.customizeTitle}>Customize Flashcards</Text>
                            <Text style={styles.customizeLabel}>Front Content:</Text>
                            <Picker
                                selectedValue={frontContent}
                                onValueChange={(value) => setFrontContent(value)}
                                style={styles.picker}
                                itemStyle={{ color: 'black'}}
                            >
                                <Picker.Item label="Chinese Character" value="Character" />
                                <Picker.Item label="Pinyin" value="Pinyin" />
                                <Picker.Item label="English Definition" value="Definition" />
                            </Picker>
                            <Text style={styles.customizeLabel}>Back Content:</Text>
                            <Picker
                                selectedValue={backContent}
                                onValueChange={(value) => setBackContent(value)}
                                style={styles.picker}
                                itemStyle={{ color: 'black' }}
                            >
                                <Picker.Item label="Chinese Character" value="Character" />
                                <Picker.Item label="Pinyin" value="Pinyin" />
                                <Picker.Item label="English Definition" value="Definition" />
                            </Picker>
                            <TouchableOpacity
                                style={styles.pickerSaveButton}
                                onPress={() => setCustomizeModalVisible(false)}
                            >
                                <Text style={styles.pickerSaveText}>Save</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
            </SafeAreaView>
        </View>
    );
};

export default SetPreviewScreen;
