import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, StatusBar } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ConfettiCannon from 'react-native-confetti-cannon';
import styles from './FlashcardScreen.styles';

const FlashcardScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const {vocab} = route.params; // Vocab taken from LibraryScreen

    const [knownWords, setKnownWords] = useState([]); // Set known words to empty
    const [unknownWords, setUnknownWords] = useState([]); // Set unknown words to empty
    const [currentDeck, setCurrentDeck] = useState([...vocab]); // Current active deck
    const [frontContent, setFrontContent] = useState('Word'); // Default: Chinese Character
    const [backContent, setBackContent] = useState('Definition'); // Default: English
    const [isFront, setIsFront] = useState(true); // Tracks the card side
    const [progress, setProgress] = useState(0); // Used to update Progress
    const [deckComplete, setDeckComplete] = useState(false); // Flag for end-of-deck
    const [finished, setFinished] = useState(false); // Flag for finished deck
    
    const flipAnim = useRef(new Animated.Value(0)).current; // Animation for flipping card
    const isFlippingRef = useRef(false);

    // Progress bar logic
    useEffect(() => {
        const total = currentDeck.length;
        const completed = knownWords.length + unknownWords.length;
        const calculatedProgress = total > 0 ? completed / total : 0;
        setProgress(calculatedProgress);
    }, [knownWords, unknownWords]);

    // Interpolations for the front and back of the card
    const frontInterpolate = flipAnim.interpolate({
        inputRange: [0, 180],
        outputRange: ['0deg', '180deg'],
    });

    const backInterpolate = flipAnim.interpolate({
        inputRange: [0, 180],
        outputRange: ['180deg', '0deg'],
    });

    // // To make sure flipAnim is in sync with isFront
    // useEffect(() => {
    //     console.log(`isFront changed: ${isFront}`);
    //     flipAnim.setValue(isFront ? 0 : 180); // Ensure the animation starts correctly
    // }, [isFront]);

    // Flipping Card logic
    const flipCard = () => {
        if (isFlippingRef.current) return;
        isFlippingRef.current = true;
    
        const toValue = isFront ? 180 : 0;
    
        Animated.timing(flipAnim, {
            toValue, // Rotate to 180 or back to 0
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setIsFront(!isFront); // Update 'isFront'
            isFlippingRef.current = false;
        });
    };    

    // Swipping Handling
    const handleSwipeRight = (cardIndex) => {
        if (cardIndex >= 0 && cardIndex < currentDeck.length) {
            const word = currentDeck[cardIndex];
            setKnownWords((prev) => [...prev, word]);
            resetCardToFront(); // Resets the card to front side after swiping
        }
        checkIfDeckComplete(cardIndex);
    };

    const handleSwipeLeft = (cardIndex) => {
        if (cardIndex >= 0 && cardIndex < currentDeck.length) {
            const word = currentDeck[cardIndex];
            setUnknownWords((prev) => [...prev, word]);
            resetCardToFront(); // Resets the card to the front side after swiping
        }
        checkIfDeckComplete(cardIndex);
    };

    // Check if deck is complete
    const checkIfDeckComplete = (cardIndex) => {
        if (cardIndex === currentDeck.length - 1) {
            if (unknownWords.length == 0) {
                setFinished(true);
            } else {
                setDeckComplete(true);
            }
        }
    };

    // Restart the deck
    const restartDeck = () => {
        setKnownWords([]);
        setUnknownWords([]);
        setCurrentDeck([...vocab]);
        setDeckComplete(false);
        setFinished(false);
        setProgress(0);
        resetCardToFront();
    };

    // Practice only unknown words
    const practiceUnknownWords = () => {
        setCurrentDeck([...unknownWords]);
        setKnownWords([]);
        setUnknownWords([]);
        setDeckComplete(false);
        resetCardToFront();
    }

    // Reseting card to front handling
    const resetCardToFront = () => {
        flipAnim.setValue(0);
        setIsFront(true);
    }

    /* FOR WHEN I WILL HAVE TO DEBUG FLASHCARD FLIPPING IMPROPERLY
    flipAnim.addListener(({value}) => {
        console.log(`flipAnim value: ${value}`);
    });
    */

    return (
        <View style={styles.appContainer}>
            <SafeAreaView style={styles.safeArea}>
                <StatusBar
                    translucent
                    backgroundColor="transparent"
                    barStyle="dark-content"
                />
                <View style={styles.container}>
                    {finished ? (
                        <View style={styles.finishedContainer}>
                            <ConfettiCannon count={200} origin={{x: -10, y: 0}} />
                            <Text style={styles.finishedText}>🎉 Congrats! You finished the set! 🎉</Text>
                            <TouchableOpacity style={styles.button} onPress={restartDeck}>
                                <Text style={styles.endButtonText}>Restart Flashcards</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={() => navigation.goBack()}>
                                <Text style={styles.endButtonText}>Leave</Text>
                            </TouchableOpacity>
                        </View>
                    ) : deckComplete ? (
                        <View style={styles.endContainer}>
                            <Text style={styles.endText}>Almost there, continue Learning!</Text>
                            <TouchableOpacity style={styles.button} onPress={restartDeck}>
                                <Text style={styles.endButtonText}>Restart Flashcards</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={practiceUnknownWords}>
                                <Text style={styles.endButtonText}>Practice Remaining Flashcards</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <>
                            {/* Header Section */}
                            <View style={styles.header}>
                                <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                                    <Text style={styles.buttonText}>Back</Text>
                                </TouchableOpacity>
                                <Text style={styles.progressText}>
                                    {knownWords.length + unknownWords.length}/{currentDeck.length}
                                </Text>
                                <TouchableOpacity
                                    style={styles.settingsButton}
                                    onPress={() =>
                                        navigation.navigate('FlashcardSettingsScreen', {
                                            frontContent,
                                            backContent,
                                            setFrontContent,
                                            setBackContent,
                                        })
                                    }
                                >
                                    <Text style={styles.buttonText}>Settings</Text>
                                </TouchableOpacity>
                            </View>

                            {/* Custom Progress Bar */}
                            <View style={styles.progressBarContainer}>
                                <View style={[styles.progressBarFill, {width: `${progress * 100}%`}]} />
                            </View>

                            {/* Known and Unknown Counts */}
                            <View style={styles.statsContainer}>
                                <Text style={styles.unknownText}>{unknownWords.length}</Text>
                                <Text style={styles.knownText}>{knownWords.length}</Text>
                            </View>

                            {/* Flashcard Section */}
                            <View style={styles.flashcardContainer}>
                                <Swiper
                                    key={currentDeck.length}
                                    cards={currentDeck}
                                    renderCard={(card) => (
                                        <View style={styles.cardWrapper}>
                                            {/* Front Card */}
                                            <Animated.View
                                                style={[
                                                    styles.card,
                                                    styles.cardFront,
                                                    {transform: [{rotateY: frontInterpolate}]},
                                                ]}
                                            >
                                                <TouchableOpacity style={styles.cardTouchable} onPress={flipCard}>
                                                    <Text style={styles.cardText}>{card[frontContent]}</Text>
                                                </TouchableOpacity>
                                            </Animated.View>

                                            {/* Back Card */}
                                            <Animated.View
                                                style={[
                                                    styles.card,
                                                    styles.cardBack,
                                                    {transform: [{rotateY: backInterpolate}]},
                                                ]}
                                            >
                                                <TouchableOpacity style={styles.cardTouchable} onPress={flipCard}>
                                                    <Text style={styles.cardText}>{card[backContent]}</Text>
                                                </TouchableOpacity>
                                            </Animated.View>
                                        </View>
                                    )}
                                    onSwipedRight={(cardIndex) => handleSwipeRight(cardIndex)}
                                    onSwipedLeft={(cardIndex) => handleSwipeLeft(cardIndex)}
                                    cardIndex={0}
                                    backgroundColor="#EFE7EC"
                                    stackSize={3}
                                />
                            </View>
                        </>
                    )}
                </View>
            </SafeAreaView>
        </View>
    );
};

export default FlashcardScreen;