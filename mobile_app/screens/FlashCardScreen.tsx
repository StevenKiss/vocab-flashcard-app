import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Flashcard from '../components/Flashcard';

type VocabItem = {
    Word: string;
    Pinyin: string;
    Definition: string;
}

const sampleVocab: VocabItem[] = [
    { Word: '星期日', Pinyin: 'xīngqīrì', Definition: 'Sunday' },
    { Word: '生日', Pinyin: 'shēngrì', Definition: 'Birthday' },
    { Word: '大家', Pinyin: 'dàjiā', Definition: 'Everyone' },
];

const FlashcardScreen = () => {
    const [frontContent, setFrontContent] = useState('Word');
    const [backContent, setBackContent] = useState('Definition');

    return (
        <View style={styles.container}>
            {/* Drop Down selector for front content*/}
            <View style={styles.selectorContainer}>
                <Text style={styles.label}>Front Content:</Text>
                <Picker
                    selectedValue={frontContent}
                    onValueChange={(value) => setFrontContent(value)}
                    style={styles.picker}  
                >
                    <Picker.Item label="Chinese Character" value="Word" />
                    <Picker.Item label="Pinyin" value="Pinyin" />
                    <Picker.Item label="English Definition" value="Definition" />
                </Picker>
            </View>

            {/* Drop Down selector for back content*/}
            <View style={styles.selectorContainer}>
                <Text style={styles.label}>Back Content:</Text>
                <Picker
                    selectedValue={backContent}
                    onValueChange={(value) => setBackContent(value)}
                    style={styles.picker}  
                >
                    <Picker.Item label="Chinese Character" value="Word" />
                    <Picker.Item label="Pinyin" value="Pinyin" />
                    <Picker.Item label="English Definition" value="Definition" />
                </Picker>
            </View>

            {/*View scrollable flashcards*/}
            <ScrollView contentContainerStyle={styles.flashcardContainer}>
                {sampleVocab.map((item, index) => (
                    <Flashcard
                        key={index}
                        frontContent={item[frontContent as keyof VocabItem]}
                        backContent={item[backContent as keyof VocabItem]}
                    />
                ))}
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
        backgroundColor: '#EFE7EC',
    },
    selectorContainer: {
        marginVertical: 10,
    },
    label: {
        fontSize: 16,
        color: '#6F4E7C',
        fontWeight: 'bold',
        marginBottom: 5,
    },
    picker: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        elevation: 2,
    },
    flashcardContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
});

export default FlashcardScreen;