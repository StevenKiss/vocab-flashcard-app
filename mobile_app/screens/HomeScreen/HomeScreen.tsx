import React from 'react';
import { View, Text, StatusBar } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './HomeScreen.styles';

const HomeScreen = () => {
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
        <Text style={styles.greeting}>Welcome to the App!</Text>
      </SafeAreaView>
    </View>
  );
};

export default HomeScreen;