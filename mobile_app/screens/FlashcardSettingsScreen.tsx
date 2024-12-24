import React, {useState} from 'react';
import {View, Text, StyleSheet, TouchableOpacity, StatusBar} from 'react-native';
import {Picker} from '@react-native-picker/picker';
import {SafeAreaView} from 'react-native-safe-area-context';

const FlashcardSettingsScreen = ({route, navigation}) => {
    const{frontContent, backContent, setFrontContent, setBackContent} = route.params;

    const [localFrontContent, setLocalFrontContent] = useState(frontContent);
    const [localBackContent, setLocalBackContent] = useState(backContent);

    const handleSave = () => {
        setFrontContent(localFrontContent);
        setBackContent(localBackContent);
        navigation.goBack();
    };

    return (
        <View style={styles.appContainer}>
            <SafeAreaView style={styles.safeArea}>
                <StatusBar
                    translucent
                    backgroundColor="transparent"
                    barStyle="dark-content"
                />
                <View style={styles.container}>
                    <Text style={styles.header}>Flashcard Settings</Text>

                    <View style={styles.settingsContainer}>
                        <Text style={styles.label}>Front Content:</Text>
                        <Picker
                            selectedValue={localFrontContent}
                            onValueChange={(value) => setLocalFrontContent(value)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Chinese Word" value="Word" />
                            <Picker.Item label="Pinyin" value="Pinyin" />
                            <Picker.Item label="English Definition" value="Definition" />
                        </Picker>
                        <Text style={styles.label}>Back Content: </Text>
                        <Picker
                            selectedValue={localBackContent}
                            onValueChange={(value) => setLocalBackContent(value)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Chinese Word" value="Word" />
                            <Picker.Item label="Pinyin" value="Pinyin" />
                            <Picker.Item label="English Definition" value="Definition" />
                        </Picker>
                    </View>
                    <TouchableOpacity style={styles.saveButton} onPress={handleSave}>
                        <Text style={styles.saveButtonText}>Save</Text>
                    </TouchableOpacity>
                </View>
            </SafeAreaView>
        </View>
    );
};

const styles = StyleSheet.create({
    appContainer: {
        flex: 1,
        backgroundColor: '#EFE7EC',
    },
    safeArea: {
        flex: 1,
        backgroundColor: '#EFE7EC',
    },
    container: {
        flex: 1,
        padding: 20,
    },
    header: {
        fontSize: 24,
        fontWeight: 'bold',
        marginBottom: 20,
        textAlign: 'center',
        color: '#6F4E7C',
    },
    settingsContainer: {
        marginBottom: 30,
    },
    label: {
        fontSize: 16,
        fontWeight: 'bold',
        marginBottom: 10,
        color: '#6F4E7C',
    },
    picker: {
        backgroundColor: '#FFFFFF',
        borderRadius: 10,
        marginBottom: 10,
        elevation: 3,
    },
    saveButton: {
        backgroundColor: '#6F4E7C',
        padding: 15,
        borderRadius: 10,
        alignItems: 'center',
        marginVertical: 0,
    },
    saveButtonText: {
        color: '#FFFFFF',
        fontSize: 18,
        fontWeight: 'bold',
    },
});

export default FlashcardSettingsScreen;