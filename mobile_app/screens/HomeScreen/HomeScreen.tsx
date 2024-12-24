import React from 'react'
import { View, Text, TouchableOpacity } from 'react-native';
import styles from './HomeScreen.styles';

const HomeScreen = () => {
    return (
        <View style={styles.container}>
            {/* Greeting Section */}
            <Text style={styles.greeting}>Welcome Back!</Text>

            {/* Streak Section */}
            <View style={styles.streakContainer}>
                <Text style={styles.streakNumber}>33 Day</Text>
                <Text style={styles.streakLabel}>Practice Streak</Text>
            </View>

            {/* Buttons */}
            <View style={styles.buttonContainer}>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>Start Practicing</Text>
                </TouchableOpacity>
                <TouchableOpacity style={styles.button}>
                    <Text style={styles.buttonText}>View Library</Text>
                </TouchableOpacity>
            </View>
        </View>

        
    );
};

export default HomeScreen;