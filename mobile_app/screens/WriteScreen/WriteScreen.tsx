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

  const [currentIndex, setCurrentIndex] = useState(0);
  const [frontContent, setFrontContent] = useState(initialFrontContent || 'Character');
  const [knownWords, setKnownWords] = useState([]);
  const [unknownWords, setUnknownWords] = useState([]);
  const [deckComplete, setDeckComplete] = useState(false);
  const [finished, setFinished] = useState(false);
  const [isShuffleOn, setIsShuffleOn] = useState(false);
  const [swipeHistory, setSwipeHistory] = useState([]);
  const [progress, setProgress] = useState(0);
  const [preShuffleDeck, setPreShuffleDeck] = useState(null);

  const originalDeck = useRef([...vocab]); // Keeps the original unmodified deck

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

  // Progress calculation
  useEffect(() => {
    const total = vocab.length;
    const completed = knownWords.length + unknownWords.length;
    const calculatedProgress = total > 0 ? completed / total : 0;
    setProgress(calculatedProgress);
  }, [knownWords, unknownWords, vocab]);

  // Shuffle the deck
  const shuffleDeck = () => {
    const shuffled = [...vocab].sort(() => Math.random() - 0.5);
    setCurrentIndex(0);
    setKnownWords([]);
    setUnknownWords([]);
    setProgress(0);
    setDeckComplete(false);
    setFinished(false);
    Alert.alert('Shuffled', 'The deck has been shuffled!');
  };

  // Undo last swipe
  const undoLast = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prevIndex) => prevIndex - 1);
      setKnownWords((prev) => prev.slice(0, -1));
      setUnknownWords((prev) => prev.slice(0, -1));
    } else {
      Alert.alert('No previous characters!', 'You are already at the first character.');
    }
  };

  const currentVocabWord = vocab[currentIndex]?.Character || 'No content';
  const referenceText = vocab[currentIndex]?.[frontContent] || 'No content';

  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />

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

        {/* Bottom Controls */}
        <View style={styles.bottomSection}>
          <TouchableOpacity onPress={undoLast} style={styles.navButton}>
            <Icon name="undo" size={30} color="#6F4E7C" />
          </TouchableOpacity>
          <TouchableOpacity onPress={shuffleDeck} style={styles.navButton}>
            <Icon name="shuffle" size={30} color="#6F4E7C" />
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </View>
  );
};

export default WriteScreen;
