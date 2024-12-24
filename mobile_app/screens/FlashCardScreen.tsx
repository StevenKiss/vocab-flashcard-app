import React, {useState, useRef, useEffect} from 'react';
import {View, Text, StyleSheet, Button, TouchableOpacity, Animated, Platform, StatusBar} from 'react-native';
import Swiper from 'react-native-deck-swiper';
import {useNavigation, useRoute} from '@react-navigation/native';
import {SafeAreaView} from 'react-native-safe-area-context';

const FlashcardScreen = () => {
    const route = useRoute();
    const navigation = useNavigation();
    const {vocab} = route.params; // Vocab taken from LibraryScreen

    const [knownWords, setKnownWords] = useState([]);
    const [unknownWords, setUnknownWords] = useState(vocab);
    const [frontContent, setFrontContent] = useState('Word'); // Default: Chinese Character
    const [backContent, setBackContent] = useState('Definition'); // Default: English
    const [isFront, setIsFront] = useState(true); //Tracks the card side
    const [progress, setProgress] = useState(0);

    // Progress bar logic
    useEffect(() => {
        const total = vocab.length;
        const completed = knownWords.length + (vocab.length - unknownWords.length);
        const calculatedProgress = total > 0 ? completed / total : 0;
        setProgress(calculatedProgress); // Avoid floating-point issues
    }, [knownWords, unknownWords]);

    // Animation for flipping card
    const flipAnim = useRef(new Animated.Value(0)).current;

    // Interpolations for the front and back of the card
    const frontInterpolate = flipAnim.interpolate({
        inputRange: [0, 180],
        outputRange: ['0deg', '180deg'],
    });

    const backInterpolate = flipAnim.interpolate({
        inputRange: [0, 180],
        outputRange: ['180deg', '0deg'],
    });

    // To make sure flipAnim is in sync with isFront
    useEffect(() => {
        console.log(`isFront changed: ${isFront}`);
        flipAnim.setValue(isFront ? 0 : 180); // Ensure the animation starts correctly
    }, [isFront]);

    let isFlipping = false;
    // Flipping Card logic
    const flipCard = () => {
        if (isFlipping) return;
        isFlipping = true;
    
        const toValue = isFront ? 180 : 0;
    
        Animated.timing(flipAnim, {
            toValue, // Rotate to 180 or back to 0
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            isFlipping = false;
            setIsFront(!isFront); // Toggle `isFront` only after animation completes
        });
    };    

    // Swipping Handling
    const handleSwipeRight = (cardIndex) => {
        if (cardIndex >= 0 && cardIndex < unknownWords.length) {
            const word = unknownWords[cardIndex];
            setKnownWords((prev) => [...prev, word]);
            setUnknownWords((prev) => prev.filter((_,i) => i !== cardIndex));
            resetCardToFront(); // Resets the card to front side after swiping
        }
    };

    const handleSwipeLeft = (cardIndex) => {
        if (cardIndex >= 0 && cardIndex < unknownWords.length) {
            setUnknownWords((prev) => prev.filter((_, i) => i !== cardIndex));
            console.log('Word not known:', unknownWords[cardIndex]);
            resetCardToFront(); // Resets the card to the front side after swiping
        }
    };

    /* FOR WHEN I WILL HAVE TO DEBUG FLASHCARD FLIPPING IMPROPERLY
    flipAnim.addListener(({value}) => {
        console.log(`flipAnim value: ${value}`);
    });
    */

    // Reseting card to front handling
    const resetCardToFront = () => {
        flipAnim.setValue(0);
        setIsFront(true);
    }

    return (
        <View style={styles.appContainer}>
            <SafeAreaView style={styles.safeArea}>
                <StatusBar
                    translucent
                    backgroundColor="transparent"
                    barStyle="dark-content"
                />
                <View style={styles.container}>
                    {/* Header Section */}
                    <View style={styles.header}>
                        <TouchableOpacity style={styles.backButton} onPress={() => navigation.goBack()}>
                            <Text style={styles.buttonText}>Back</Text>
                        </TouchableOpacity>
                        <Text style={styles.progressText}>
                            {knownWords.length + (vocab.length - unknownWords.length)}/{vocab.length}
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
                            key={unknownWords.length}
                            cards={unknownWords}
                            renderCard={(card) => (
                                <View style={styles.cardWrapper}>
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
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#EFE7EC',
    },
    flashcardContainer:{
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 30,
    },
    cardWrapper: {
        flex: 0.6,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
    },
    card: {
        position: 'absolute',
        width: 300,
        height: 400,
        justifyContent: 'center',
        alignItems: 'center',
        backfaceVisibility: 'hidden',
        borderRadius: 10,
        padding: 20,
        backgroundColor: '#FFFFFF',
        elevation: 4,
    },
    cardFront: {
        backgroundColor: '#FFFFFF'
    },
    cardBack: {
        backgroundColor: '#FFE4B5',
    },
    cardTouchable: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    cardText: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    header: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        paddingHorizontal: 15,
        paddingVertical: 0,
        marginBottom: 0,
        zIndex: 1, // Ensure above Swiper
    },
    progressText: {
        fontSize: 18,
        fontWeight: 'bold',
        color: '#6F4E7C',
    },
    backButton: {
        padding: 10,
    },
    settingsButton: {
        padding: 10,
    },
    buttonText: {
        fontSize: 16,
        fontWeight: 'bold',
        color: '#6F4E7C',
    },
    progressBarContainer: {
        height: 5,
        backgroundColor: '#E0e0e0',
        marginHorizontal: 15,
        marginBottom: 15,
        marginVertical: 10,
        borderRadius: 3,
        zIndex: 1, // Ensure above Swiper
    },
    progressBarFill: {
        height: '100%',
        backgroundColor: '#6F4E7C',
        borderRadius: 3,
    },
    statsContainer: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        paddingHorizontal: 25,
        zIndex: 1, // Ensure above Swiper
    },
    unknownText: {
        fontSize: 18,
        color: 'red',
        fontWeight: 'bold',
    },
    knownText: {
        fontSize: 18,
        color: 'green',
        fontWeight: 'bold',
    },
    safeArea: {
        flex: 1,
        backgroundColor: 'EFE7EC',
    },
    appContainer: {
        flex: 1,
        backgroundColor: '#EFE7EC',
    }
});

export default FlashcardScreen;