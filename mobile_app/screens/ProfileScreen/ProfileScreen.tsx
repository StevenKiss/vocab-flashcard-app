import React from 'react';
import { View, Text, TouchableOpacity, Alert, StatusBar } from 'react-native';
import { signOut } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig';
import { SafeAreaView } from 'react-native-safe-area-context';

import styles from './ProfileScreen.styles'
const ProfileScreen = () => {
  const handleLogout = async () => {
    try {
      await signOut(auth);

      Alert.alert('Logged out', 'You have successfully logged out.');
    } catch (error) {
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };
  
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <Text style={styles.headerText}>Profile</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Email: {auth.currentUser.email}</Text>
        </View>
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export default ProfileScreen;