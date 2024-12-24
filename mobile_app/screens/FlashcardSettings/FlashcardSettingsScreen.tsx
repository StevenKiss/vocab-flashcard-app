import React, { useState } from 'react';
import { View, Text, TouchableOpacity, StatusBar } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './FlashcardSettings.styles';

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

export default FlashcardSettingsScreen;