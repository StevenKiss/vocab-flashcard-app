import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity} from 'react-native';

type FlashcardProps = {
    frontContent: string;
    backContent: string;
};

const Flashcard: React.FC<FlashcardProps>  = ({frontContent, backContent}) => {
    const [isFlipped, setIsFlipped] = useState(false); // Track which side is showing

    const flipCard =() => setIsFlipped(!isFlipped);

    return (
        <TouchableOpacity style={styles.card} onPress={flipCard}>
            <Text style={styles.text}>
                {isFlipped ? backContent : frontContent}
            </Text>
        </TouchableOpacity>
    );
};

const styles = StyleSheet.create({
    card: {
        width: '90%',
        height: 200,
        backgroundColor: '#F7F3F7',
        borderRadius: 10,
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: 10,
        shadowColor: '#000',
        shadowOffset: {width: 0, height: 2},
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 5,
    },
    text: {
        fontSize: 24,
        fontWeight: 'bold',
        textAlign: 'center',
        color: '#6F4E7C'
    },
});

export default Flashcard;