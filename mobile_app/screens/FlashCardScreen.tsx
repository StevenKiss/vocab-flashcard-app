import React, {useState} from 'react';
import {View, Text, StyleSheet, ScrollView} from 'react-native';
import { Picker } from '@react-native-picker/picker';
import Flashcard from '../components/Flashcard';
import { RootStackParamList } from '../types/types';
import { RouteProp, useRoute } from '@react-navigation/native';

type FlashcardRouteProp = RouteProp<RootStackParamList, 'Flashcard'>;

type VocabItem = {
    Word: string;
    Pinyin: string;
    Definition: string;
}

const FlashcardScreen = () => {
    const route = useRoute<FlashcardRouteProp>();
    const {vocab} = route.params;

    const [frontContent, setFrontContent] = useState('Word');
    const [backContent, setBackContent] = useState('Definition');

    return (
        <View style={styles.container}>
            {/* Drop Down selector for front content*/}
            <View style={styles.selectorContainer}>
                <Text style={[styles.label, {marginTop: 30}]}>Front Content:</Text>
                <View style={styles.pickerWrapper}>
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
            </View>

            {/* Drop Down selector for back content*/}
            <View style={styles.selectorContainer}>
                <Text style={styles.label}>Back Content:</Text>
                <View style={styles.pickerWrapper}>
                    <Picker
                        selectedValue={backContent}
                        onValueChange={(value) => setBackContent(value)}
                        style={styles.picker}
                        itemStyle={styles.pickerItem} 
                    >
                        <Picker.Item label="Chinese Character" value="Word" />
                        <Picker.Item label="Pinyin" value="Pinyin" />
                        <Picker.Item label="English Definition" value="Definition" />
                    </Picker>
                </View>
            </View>

            {/*View scrollable flashcards*/}
            <ScrollView contentContainerStyle={styles.flashcardContainer}>
                {vocab.map((item, index) => (
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
    pickerWrapper: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        elevation: 2,
        height: 120,
        justifyContent: 'center',
        textAlign: 'center',
        overflow: 'hidden',
    },
    picker: {
        width: '100%',
        height: '100%',
        justifyContent: 'center',
    },
    pickerItem: {
        fontSize: 20,
        textAlign: 'center',
        color: '#000',
    },
    flashcardContainer: {
        alignItems: 'center',
        paddingVertical: 20,
    },
});

export default FlashcardScreen;