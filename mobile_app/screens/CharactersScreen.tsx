import React from 'react';
import { View, Text, StyleSheet } from 'react-native';

const CharactersScreen = () => (
  <View style={styles.container}>
    <Text>Characters Screen</Text>
  </View>
);

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});

export default CharactersScreen;