import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Animated,
  StatusBar,
  Alert,
} from 'react-native';
import { useNavigation, useRoute } from '@react-navigation/native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { WebView } from 'react-native-webview';
import ConfettiCannon from 'react-native-confetti-cannon';
import Icon from 'react-native-vector-icons/MaterialIcons';
import styles from './WriteScreen.styles';

const WriteScreen = () => {
  const route = useRoute();
  const navigation = useNavigation();
  const {
    vocab,
    frontContent: initialFrontContent,
    setId,
    title,
  } = route.params || {};

  const [knownWords, setKnownWords] = useState([]);
  const [unknownWords, setUnknownWords] = useState([]);
  const [currentDeck, setCurrentDeck] = useState([...vocab]);
  const [frontContent, setFrontContent] = useState(initialFrontContent || 'Character');
  const [progress, setProgress] = useState(0);
  const [deckComplete, setDeckComplete] = useState(false);
  const [finished, setFinished] = useState(false);
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [swipeHistory, setSwipeHistory] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [originalDeck, setOriginalDeck] = useState([...vocab]);
  const [lastShuffleIndex, setLastShuffleIndex] = useState(0);

  const [preShuffleDeck, setPreShuffleDeck] = useState(null);
  const [canUndo, setCanUndo] = useState(true);

  // HTML for HanziWriter
  const getHtmlContent = (vocabWord, currentIndex) => {
    const characters = vocabWord.split(''); // Split vocab word into individual characters

    return `
    <!DOCTYPE html>
    <html>
    <head>
      <script src="https://cdn.jsdelivr.net/npm/hanzi-writer@3.5/dist/hanzi-writer.min.js"></script>
      <style>
        body { margin: 0; padding: 0; display: flex; justify-content: center; align-items: center; height: 100%; }
        #hanzi-target { width: 1000px; height: 1000px; }
      </style>
    </head>
    <body>
      <div id="hanzi-target"></div>
      <script>
        const characters = ${JSON.stringify(characters)};
        let currentCharacterIndex = ${currentIndex};
        
        function startQuiz() {
            const currentCharacter = characters[currentCharacterIndex];
            const writer = HanziWriter.create('hanzi-target', currentCharacter, {
                width: 1000,
                height: 1000,
                padding: 10,
                strokeAnimationSpeed: 1,
                radicalColor: '#6F4E7C',
                showCharacter: false,
                showOutline: true,
                drawingWidth: 20
            });

            writer.quiz({
                onComplete: () => {
                    currentCharacterIndex++;
                    if (currentCharacterIndex < characters.length) {
                        document.getElementById('hanzi-target').innerHTML = ''; // Clears the canvas
                        startQuiz();
                    } else {
                        alert('You completed the vocab word: ${vocabWord}!'); 
                    }
                },
            });
        }

        
        startQuiz();
      </script>
    </body>
    </html>
    `;
    };

    // When user changes features in settings modal, change them

    // Progress bar logic
    useEffect(() => {
        const total = vocab.length;
        const completed = knownWords.length + unknownWords.length;
        const calculatedProgress = total > 0 ? completed / total : 0;
        setProgress(calculatedProgress);
    }, [knownWords, unknownWords, vocab]);

    // Handle Known
    const handleKnown = () => {
        if (currentIndex < currentDeck.length) {
            const word = currentDeck[currentIndex];
            const newKnown = [...knownWords, word];
            setKnownWords(newKnown);
            setSwipeHistory((prev) => [...prev, { word, choice: 'known'}]);
            setCurrentIndex(currentIndex + 1);
            checkIfDeckComplete(currentIndex + 1, newKnown, unknownWords);
        }
    };

    // Handle Unknown
    const handleUnknown = () => {
        if (currentIndex < currentDeck.length) {
            const word = currentDeck[currentIndex];
            const newUnknown = [...unknownWords, word];
            setUnknownWords(newUnknown);
            setSwipeHistory((prev) => [...prev, { word, choice: 'unknown'}]);
            setCurrentIndex(currentIndex + 1);
            checkIfDeckComplete(currentIndex + 1, knownWords, newUnknown);
        }
    };

    // Check if deck is complete
    const checkIfDeckComplete = (currentIndex, updatedKnown, updatedUnknown) => {
        if (currentIndex === currentDeck.length) {
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
        setSwipeHistory([]);
        setLastShuffleIndex(0);
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
        setCurrentIndex(0);
        setDeckComplete(false);
        setSwipeHistory([]);
        setLastShuffleIndex(0);
        setCanUndo(false);
        setCanUndo(false);
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
        setPreShuffleDeck({
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
        setCanUndo(false);
    };

    // Undo shuffle mode
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
            setCanUndo(swipeHistory.length > 0 && currentIndex > lastShuffleIndex);

            setPreShuffleDeck(null);
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
        setLastShuffleIndex(currentIndex);
        setIsShuffleOn((prev) => !prev);
    };

    // Keep CanUndo up-to-date
    useEffect(() => {
        setCanUndo(
            swipeHistory.length > 0 &&
            currentIndex > 0 &&
            currentIndex > lastShuffleIndex
        );
    }, [swipeHistory, currentIndex, lastShuffleIndex]);

    // Undo logic
    const handleUndo = () => {
        if (!canUndo || currentIndex === 0 || currentIndex <= lastShuffleIndex) {
            console.log("Cannot undo");
            return;
        }
        if (swipeHistory.length > 0 && currentIndex > lastShuffleIndex) {
            console.log("Undo: Before => Index:", currentIndex, "History length:", swipeHistory.length);

            const lastSwipe = swipeHistory[swipeHistory.length - 1];
            const { choice } = lastSwipe;

            // Remove last entry from swipe History
            console.log(`swipeHistory before: ${swipeHistory}`);
            const newHistory = swipeHistory.slice(0, -1);
            setSwipeHistory(newHistory);
            console.log(`swipeHistory after: ${swipeHistory}`);


            // Remove word from correct set
            if (choice == 'known') {
                setKnownWords((prev) => prev.slice(0, -1));
            } else if (choice == 'unknown') {
                setUnknownWords((prev) => prev.slice(0,-1));
            }

            setCurrentIndex((oldIndex) => (oldIndex > 0 ? oldIndex - 1 : 0));
            setCanUndo(newHistory.length > 0 && currentIndex > lastShuffleIndex);
        } else {
            console.log("No swipes to undo");
        }
    };

  const currentVocabWord = currentDeck[currentIndex]?.Character || 'No content';
  const referenceText = currentDeck[currentIndex]?.[frontContent] || 'No content';

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
            <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
                {finished ? (
                    <View style={styles.finishedContainer}>
                        <ConfettiCannon count={200} origin={{x: -10, y: 0}} />
                        <Text style={styles.finishedText}>🎉 Congrats! You finished the set! 🎉</Text>
                        <TouchableOpacity style={styles.button} onPress={restartDeck}>
                            <Text style={styles.endButtonText}>Restart Write</Text>
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
                        {/* Header */}
                        <View style={styles.header}>
                        <TouchableOpacity
                            onPress={() =>
                            navigation.navigate('SetPreviewScreen', {
                                setId,
                                setTitle: title,
                                cards: vocab,
                                progress: progress * vocab.length,
                            })
                            }
                        >
                            <Icon name="arrow-back-ios-new" size={24} color="#6F4E7C" />
                        </TouchableOpacity> 
                        <Text style={styles.progressText}>
                            {knownWords.length + unknownWords.length}/{vocab.length}
                        </Text>
                        <TouchableOpacity onPress={() => navigation.navigate('FlashcardSettingsScreen')}>
                            <Icon name="settings" size={24} color="#6F4E7C" />
                        </TouchableOpacity>
                        </View>

                        {/* Custom Progress Bar */}
                        <View style={styles.progressBarContainer}>
                            <View style={[styles.progressBarFill, { width: `${progress * 100}%` }]} />
                        </View>

                        {/* Known and Unknown Counts */}
                        <View style={styles.statsContainer}>
                            <Text style={styles.unknownText}>{unknownWords.length}</Text>
                            <Text style={styles.knownText}>{knownWords.length}</Text>
                        </View>

                        {/* Reference Text */}
                        <View style={styles.referenceContainer} >
                            <Text style={styles.referenceText}>{referenceText}</Text>
                        </View>

                        {/* Hanzi Writer WebView */}
                        <View style={styles.writerContainer}>
                        <WebView
                            originWhitelist={['*']}
                            source={{ html: getHtmlContent(currentVocabWord, 0) }}
                            javaScriptEnabled
                            style={{ width: 300, height: 300 }}
                        />
                        </View>
                        {/* Correct/Incorrect Buttons */}
                        <View style={styles.buttonsContainer}>
                            <TouchableOpacity onPress={handleUnknown} style={styles.incorrectButton}>
                                <Icon name="close" size={30} color="#FFFFFF" />
                            </TouchableOpacity>
                            <TouchableOpacity onPress={handleKnown} style={styles.correctButton}>
                                <Icon name="check" size={30} color="#FFFFFF" />
                            </TouchableOpacity>
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
            </SafeAreaView>
        </View>
    );
};

export default WriteScreen;
