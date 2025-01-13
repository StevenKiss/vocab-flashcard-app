import React, { useState } from 'react';
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
import styles from './SetPreviewScreen.styles';

const SetPreviewScreen = ({ navigation, route }) => {
    const { setTitle, cards, progress, creationDate, setId } = route.params || {};

    const [optionsModalVisible, setOptionsModalVisible] = useState(false);
    const [flippedStates, setFlippedStates] = useState(
        Array(cards.length).fill(false)
    );

    // Toggle flip state for individual cards
    const toggleFlip = (index) => {
        const updatedFlippedStates = [...flippedStates];
        updatedFlippedStates[index] = !updatedFlippedStates[index];
        setFlippedStates(updatedFlippedStates);
    };

    const renderCard = ({ item, index }) => (
        <TouchableOpacity
            style={styles.cardContainer}
            onPress={() => toggleFlip(index)}
        >
            <Animated.View
                style={[styles.card, flippedStates[index] && styles.cardBack]}
            >
                <Text style={styles.cardText}>
                    {flippedStates[index] ? item.Definition : item.Character}
                </Text>
            </Animated.View>
        </TouchableOpacity>
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
                    <TouchableOpacity onPress={() => navigation.goBack()}>
                        <Icon name="close" size={24} color="#6F4E7C" />
                    </TouchableOpacity>
                    <Text style={styles.title}>{setTitle}</Text>
                    <TouchableOpacity onPress={() => setOptionsModalVisible(true)}>
                        <Icon name="more-vert" size={24} color="#6F4E7C" />
                    </TouchableOpacity>
                </View>

                {/* Progress */}
                <Text style={styles.progressText}>Progress: {progress}</Text>

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
                            })
                        }
                    >
                        <Text style={styles.buttonText}>Flashcards</Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.actionButton, styles.writeModeButton]}
                        onPress={() => alert('Write Mode Coming Soon!')}
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
                            <TouchableOpacity
                                onPress={() => {
                                    setOptionsModalVisible(false);
                                    Alert.alert('Set Info', `Created: ${creationDate}\nTotal Cards: ${cards.length}`);
                                }}
                                style={styles.modalOption}
                            >
                                <Text style={styles.modalOptionText}>Info</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => {
                                    setOptionsModalVisible(false);
                                    alert('Edit Mode Coming Soon!');
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
            </SafeAreaView>
        </View>
    );
};

export default SetPreviewScreen;
