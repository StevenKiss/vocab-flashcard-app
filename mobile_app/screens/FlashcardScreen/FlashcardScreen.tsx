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

    const [knownWords, setKnownWords] = useState([]);               // Set known words to empty
    const [unknownWords, setUnknownWords] = useState([]);           // Set unknown words to empty
    const [currentDeck, setCurrentDeck] = useState([...vocab]);     // Current active deck
    const [frontContent, setFrontContent] = useState('Word');       // Default: Chinese Character
    const [backContent, setBackContent] = useState('Definition');   // Default: English
    const [isFront, setIsFront] = useState(true);                   // Tracks the card side
    const [progress, setProgress] = useState(0);                    // Used to update Progress
    const [deckComplete, setDeckComplete] = useState(false);        // Flag for end-of-deck
    const [finished, setFinished] = useState(false);                // Flag for finished deck
    const [isShuffleOn, setIsShuffleOn] = useState(false);          // Flag for shuffle
    const [swipeHistory, setSwipeHistory] = useState([]);           // Track swiped cards
    const [currentIndex, setCurrentIndex] = useState(0);            // Tracks card index
    
    const flipAnim = useRef(new Animated.Value(0)).current; // Animation for flipping card
    const isFlippingRef = useRef(false); // Flipping Reference
    const swiperRef = useRef(null); // Swiper Reference

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
        if (cardIndex < currentDeck.length) {
            const word = currentDeck[cardIndex];
            const newKnown = [...knownWords, word];
            setKnownWords(newKnown);
            setSwipeHistory((prev) => [...prev, { word, direction: 'right'}]);
            setCurrentIndex(cardIndex + 1);
            resetCardToFront(); // Resets the card to front side after swiping
            checkIfDeckComplete(cardIndex + 1, newKnown, unknownWords);
        }
    };

    const handleSwipeLeft = (cardIndex) => {
        if (cardIndex < currentDeck.length) {
            const word = currentDeck[cardIndex];
            const newUnknown = [...unknownWords, word];
            setUnknownWords(newUnknown);
            setSwipeHistory((prev) => [...prev, { word, direction: 'left'}]);
            setCurrentIndex(cardIndex + 1);
            resetCardToFront(); // Resets the card to the front side after swiping
            checkIfDeckComplete(cardIndex + 1, knownWords, newUnknown);
        }
    };

    // Check if deck is complete
    const checkIfDeckComplete = (cardIndex, updatedKnown, updatedUnknown) => {
        if (cardIndex === currentDeck.length) {
            if (updatedUnknown.length == 0) {
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
        setCurrentIndex(0);
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
        setCurrentIndex(0);
        resetCardToFront();
    }

    // Reseting card to front handling
    const resetCardToFront = () => {
        flipAnim.setValue(0);
        setIsFront(true);
    }

    // Shuffle logic
    const shuffleDeck = () => {
        const shuffledDeck = [...currentDeck];
        for (let i = shuffledDeck.length -1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledDeck[i], shuffledDeck[j]] = [shuffledDeck[j], shuffledDeck[i]];
        }
        setCurrentDeck(shuffledDeck);
        setCurrentIndex(0);
        resetCardToFront();
    };

    // Toggle shuffle
    const toggleShuffle = () => {
        console.log("Toggle shuffle");
        setIsShuffleOn((prev) => {
            const newstate = !prev;
            if (newstate) shuffleDeck();
            return newstate;
        });
    };

    // Undo logic
    const handleUndo = () => {
        if (swipeHistory.length > 0 && currentIndex > 0) {
            console.log("Undo: Before => Index:", currentIndex, "History length:", swipeHistory.length);

            const lastSwipe = swipeHistory[swipeHistory.length - 1];
            const { direction } = lastSwipe;

            // Remove last entry from swipe History
            console.log(`swipeHistory before: ${swipeHistory}`);
            const newHistory = swipeHistory.slice(0, -1);
            setSwipeHistory(newHistory);
            console.log(`swipeHistory after: ${swipeHistory}`);


            // Remove word from correct set
            if (direction == 'right') {
                setKnownWords((prev) => prev.slice(0, -1));
            } else if (direction == 'left') {
                setUnknownWords((prev) => prev.slice(0,-1));
            }

            // // Re-add word to deck at the beginning
            // setCurrentDeck((prevDeck) => {
            //     const newDeck = [...prevDeck];
            //     console.log(newDeck);
            //     newDeck.splice(currentIndex -1, 0, word);
            //     console.log(newDeck);
            //     return newDeck;
            // });

            setCurrentIndex((oldIndex) => (oldIndex > 0 ? oldIndex - 1 : 0));
            resetCardToFront();
        } else {
            console.log("No swipes to undo");
        }
    };

    // Re-redner the card when the index changes due to undo
    useEffect(() => {
        if (swiperRef.current) {
            swiperRef.current.jumpToCardIndex(currentIndex);
        }
    }, [currentIndex]);

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
                            <TouchableOpacity style={styles.button} onPress={practiceUnknownWords}>
                                <Text style={styles.endButtonText}>Practice Remaining Flashcards</Text>
                            </TouchableOpacity>
                            <TouchableOpacity style={styles.button} onPress={restartDeck}>
                                <Text style={styles.endButtonText}>Restart Flashcards</Text>
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
                                    ref={swiperRef}
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
                                    cardIndex={currentIndex}
                                    onSwipedRight={(cardIndex) => handleSwipeRight(cardIndex)}
                                    onSwipedLeft={(cardIndex) => handleSwipeLeft(cardIndex)}
                                    stackSize={3}
                                    backgroundColor="#EFE7EC"
                                />
                            </View>

                            {/* Bottom Section */}
                            <View style={styles.bottomSection}>
                                {/* Undo Button */}
                                <TouchableOpacity style={styles.bottomButton} onPress={handleUndo}>
                                    <Text style={styles.icon}>↩️</Text>
                                </TouchableOpacity>

                                {/* Shuffle Button */}
                                <TouchableOpacity style={styles.bottomButton} onPress={toggleShuffle}>
                                    <Text style={styles.icon}> {isShuffleOn ? '🔀' : '➡️'}</Text>
                                </TouchableOpacity>
                            </View>
                        </>
                    )}
                </View>
            </SafeAreaView>
        </View>
    );
};

export default FlashcardScreen;