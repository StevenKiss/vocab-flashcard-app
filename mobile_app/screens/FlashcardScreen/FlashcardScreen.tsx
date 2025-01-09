import React, { useState, useRef, useEffect } from 'react';
import { View, Text, TouchableOpacity, Animated, StatusBar, Alert } from 'react-native';
import Swiper from 'react-native-deck-swiper';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import ConfettiCannon from 'react-native-confetti-cannon';
import styles from './FlashcardScreen.styles';
import Icon from 'react-native-vector-icons/MaterialIcons'

const FlashcardScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const {vocab} = route.params; // Vocab taken from LibraryScreen

    const [knownWords, setKnownWords] = useState([]);               // Set known words to empty
    const [unknownWords, setUnknownWords] = useState([]);           // Set unknown words to empty
    const [currentDeck, setCurrentDeck] = useState([...vocab]);     // Current active deck
    const [frontContent, setFrontContent] = useState('Character');  // Default: Chinese Character
    const [backContent, setBackContent] = useState('Definition');   // Default: English
    const [progress, setProgress] = useState(0);                    // Used to update Progress
    const [deckComplete, setDeckComplete] = useState(false);        // Flag for end-of-deck
    const [finished, setFinished] = useState(false);                // Flag for finished deck
    const [isShuffleOn, setIsShuffleOn] = useState(false);          // Flag for shuffle
    const [swipeHistory, setSwipeHistory] = useState([]);           // Track swiped cards
    const [currentIndex, setCurrentIndex] = useState(0);            // Tracks card index
    const [originalDeck, setOriginalDeck] = useState([...vocab]);   // Keeps original deck

    const [preShuffleDeck, setPreSuffleDeck] = useState(null);      // Deck state before shuffle
    const [canUndo, setCanUndo] = useState(true);                   // Whether user can undo or not

    const isFront = useRef(true);                           // Tracks the card side, Ref to hold value between rerenders
    const flipAnim = useRef(new Animated.Value(0)).current; // Animation for flipping card
    const isFlippingRef = useRef(false);                    // Flipping Reference
    const swiperRef = useRef(null);                         // Swiper Reference

    // When user changes flashcard content in settings
    useEffect(() => {
        if (route.params?.updatedFront && route.params?.updatedBack) {
          // Update the parent's states here
          setFrontContent(route.params.updatedFront);
          setBackContent(route.params.updatedBack);
        }
    }, [route.params]);
    
    // Progress bar logic
    useEffect(() => {
        const total = currentDeck.length;
        const completed = knownWords.length + unknownWords.length;
        const calculatedProgress = total > 0 ? completed / total : 0;
        setProgress(calculatedProgress);
    }, [knownWords, unknownWords, currentDeck]);

    // Front card rotation
    const frontInterpolate = flipAnim.interpolate({
        inputRange: [0, 180],
        outputRange: ['0deg', '180deg'],
    });

    const flipToFrontStyle = {
        transform: [
            {rotateY: frontInterpolate},
            {perspective: 1000},
        ]
    };

    // Back card rotation
    const backInterpolate = flipAnim.interpolate({
        inputRange: [0, 180],
        outputRange: ['180deg', '360deg'],
    });

    const flipToBackStyle = {
        transform: [
            {rotateY: backInterpolate},
            {perspective: 1000},
        ]
    };

    // Flipping Card logic
    const flipCard = () => {
        console.log('flipCard called. isFront =', isFront);
        if (isFlippingRef.current) return;
        isFlippingRef.current = true;
    
        const toValue = isFront.current ? 180 : 0;
        Animated.timing(flipAnim, {
            toValue,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            isFront.current = !isFront.current;
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
        let newDeck = [...originalDeck];
        if (isShuffleOn) {
            // Shuffle unknown words if shuffle mode is on
            for (let i = newDeck.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
            }
        }
        setKnownWords([]);
        setUnknownWords([]);
        setCurrentIndex(0);
        setCurrentDeck(newDeck);
        setDeckComplete(false);
        setFinished(false);
        setProgress(0);
        resetCardToFront();
        setCanUndo(false);
    };

    // Practice only unknown words
    const practiceUnknownWords = () => {
        let newDeck = [...unknownWords];
        if (isShuffleOn) {
            // Shuffle unknown words if shuffle mode is on
            for (let i = newDeck.length - 1; i > 0; i--) {
                const j = Math.floor(Math.random() * (i + 1));
                [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
            }
        }
        setCurrentDeck(newDeck);
        setKnownWords([]);
        setUnknownWords([]);
        setDeckComplete(false);
        setCurrentIndex(0);
        resetCardToFront();
        setCanUndo(true);
    }

    // Reseting card to front handling
    const resetCardToFront = () => {
        flipAnim.setValue(0);
        isFront.current = true;
    }

    // Helper function to compare cards
    const areCardsEqual = (card1, card2) => {
        return (
            card1.Character === card2.Character &&
            card1.Definition === card2.Definition &&
            card1.Pinyin === card2.Pinyin
        );
    };

    // Shuffle logic
    const shuffleDeck = () => {
        // Store state before shuffle
        setPreSuffleDeck({
            deck: [...currentDeck],
            knownWords: [...knownWords],
            unknownWords: [...unknownWords],
            swipeHistory: [...swipeHistory],
            currentIndex,
        });

        const remainingCards = currentDeck.filter(
            (card) =>
                !knownWords.some((knownCard) => areCardsEqual(card, knownCard)) &&
                !unknownWords.some((unknownCard) => areCardsEqual(card, unknownCard))
        );

        // Shuffle the remaining cards
        for (let i = remainingCards.length -1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [remainingCards[i], remainingCards[j]] = [remainingCards[j], remainingCards[i]];
        }
        const shuffledDeck = [...knownWords, ...unknownWords, ...remainingCards];

        setCurrentDeck(shuffledDeck);
        setCurrentIndex(knownWords.length + unknownWords.length);
        resetCardToFront();
    };

    const revertShuffle = () => {
        if (preShuffleDeck) {
            // Get remaining cards from the original deck
            const remainingCards = originalDeck.filter(
                (card) =>
                    !knownWords.some((knownCard) => areCardsEqual(card, knownCard)) &&
                    !unknownWords.some((unknownCard) => areCardsEqual(card, unknownCard))
            );

            // Combine known, unknown, and remaining cards in original order
            const adjustedDeck = [...knownWords, ...unknownWords, ...remainingCards];

            // Update states
            setCurrentDeck(adjustedDeck);
            setCurrentIndex(knownWords.length + unknownWords.length);
            resetCardToFront();
            setPreSuffleDeck(null);
            setCanUndo(swipeHistory.length > 0);
        }
    }

    // Toggle shuffle
    const toggleShuffle = () => {
        console.log("Toggle shuffle");
        if (isShuffleOn) {
            revertShuffle();
        } else {
            shuffleDeck();
        }
        setIsShuffleOn((prev) => !prev);
    };

    // Keep CanUndo up-to-date
    useEffect(() => {
        setCanUndo(swipeHistory.length > 0 && currentIndex > 0);
    }, [swipeHistory, currentIndex]);

    // Undo logic
    const handleUndo = () => {
        if (!canUndo || currentIndex === 0) {
            console.log("Cannot undo");
            return;
        }
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

            setCurrentIndex((oldIndex) => (oldIndex > 0 ? oldIndex - 1 : 0));
            setCanUndo(newHistory.length > 0);
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
    }, [currentIndex, frontContent, backContent]);

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
                                <TouchableOpacity style={styles.navButton} onPress={() => navigation.navigate('LibraryMain')}>
                                    <Icon name="arrow-back-ios-new" size={24} color ="#6F4E7C"/>
                                </TouchableOpacity>
                                <Text style={styles.progressText}>
                                    {knownWords.length + unknownWords.length}/{currentDeck.length}
                                </Text>
                                <TouchableOpacity
                                    style={styles.navButton}
                                    onPress={() =>
                                        navigation.navigate('FlashcardSettingsScreen', {
                                            frontContent,
                                            backContent,
                                            vocab,
                                        })
                                    }
                                >
                                    <Icon name="settings" size={24} color="#6F4E7C" />
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
                                    key={`${currentDeck.length}_${frontContent}_${backContent}`}
                                    cards={currentDeck}
                                    renderCard={(card) => (
                                        <View style={styles.cardWrapper}>
                                            <TouchableOpacity onPress={flipCard} activeOpacity={1} style={styles.cardTouchable}>
                                                {/* Front Card */}
                                                <Animated.View
                                                    style={[
                                                        styles.card,
                                                        styles.cardFront,
                                                        flipToFrontStyle,
                                                    ]}
                                                >
                                                    <Text style={styles.cardText}>{card[frontContent] || 'No content'}</Text>
                                                </Animated.View>

                                                {/* Back Card */}
                                                <Animated.View
                                                    style={[
                                                        styles.card,
                                                        styles.cardBack,
                                                        flipToBackStyle,
                                                    ]}
                                                >
                                                    <Text style={styles.cardText}>{card[backContent] || 'No content'}</Text>
                                                </Animated.View>
                                            </TouchableOpacity>
                                        </View>
                                    )}
                                    cardIndex={currentIndex}
                                    onSwipedRight={(cardIndex) => handleSwipeRight(cardIndex)}
                                    onSwipedLeft={(cardIndex) => handleSwipeLeft(cardIndex)}
                                    onSwipedTop={(cardIndex) => handleSwipeRight(cardIndex)}
                                    onSwipedBottom={(cardIndex) => handleSwipeLeft(cardIndex)}
                                    stackSize={3}
                                    backgroundColor="#EFE7EC"
                                />
                            </View>

                            {/* Bottom Section */}
                            <View style={styles.bottomSection}>
                                {/* Undo Button */}
                                <TouchableOpacity style={[styles.navButton, { opacity: canUndo ? 1 : 0.5},]} onPress={handleUndo} disabled={!canUndo}>
                                    <Icon name="undo" size={30} color={canUndo ? "#6F4E7C" : "#A9A9A9"} />
                                </TouchableOpacity>

                                {/* Shuffle Button */}
                                <TouchableOpacity style={styles.navButton} onPress={toggleShuffle}>
                                    <Icon name={isShuffleOn ? 'shuffle-on' : 'shuffle'} size={24} color="#6F4E7C" />
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