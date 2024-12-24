import React from 'react';
import {View, Text, StyleSheet, Button} from 'react-native';
import {Picker} from '@react-native-picker/picker';

const FlashcardSettingsScreen = ({route, navigation}) => {
    const{frontContent, backContent, setFrontContent, setBackContent} = route.params;

    return (
        <View style={styles.container}>
            <Text style={styles.label}>Front Content:</Text>
            <Picker
                selectedValue={frontContent}
                onValueChange={(value) => setFrontContent(value)}
            >
                <Picker.Item label="Chinese Word" value="Word" />
                <Picker.Item label="Pinyin" value="Pinyin" />
                <Picker.Item label="English Definition" value="Definition" />
            </Picker>
            <Text style={styles.label}>Back Content: </Text>
            <Picker
                selectedValue={backContent}
                onValueChange={(value) => setBackContent(value)}
            >
                <Picker.Item label="Chinese Word" value="Word" />
                <Picker.Item label="Pinyin" value="Pinyin" />
                <Picker.Item label="English Definition" value="Definition" />
            </Picker>
            <Button title="Save" onPress={() => navigation.goBack()} />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        padding: 20,
    },
    label: {
        fontSize: 16,
        marginVertical: 10,
    },
});

export default FlashcardSettingsScreen;