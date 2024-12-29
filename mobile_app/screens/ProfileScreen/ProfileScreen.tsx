import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StatusBar, TextInput, Modal } from 'react-native';
import { signOut, updateEmail, updatePassword } from 'firebase/auth';
import { getDoc, updateDoc, doc } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebaseConfig';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './ProfileScreen.styles'

const ProfileScreen = () => {
  const [username, setUsername] = useState('');
  const [isEditingEmail, setIsEditingEmail] = useState(false);
  const [isEditingUsername, setIseditingUsername] = useState(false);
  const [isEditingPassword, setIsEditingPassword] = useState(false);
  const [newEmail, setNewEmail] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [newPassword, setNewPassword] = useState('');

  // Get the username
  useEffect(() => {
    const fetchUsername = async () => {
      try {
        const userDoc = doc(db, 'users', auth.currentUser.uid);
        const docSnapshot = await getDoc(userDoc);
        if (docSnapshot.exists()) {
          setUsername(docSnapshot.data().username);
        } else {
          console.log('No user data found!');
        }
      } catch (error) {
        console.error('Error fetching username: ', error.message);
      }
    }

    fetchUsername();
  }, []);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      Alert.alert('Logged out', 'You have successfully logged out.');
    } catch (error) {
      Alert.alert('Error', 'Failed to log out. Please try again.');
    }
  };

  const handleUpdateEmail = async () => {
    try {
      await updateEmail(auth.currentUser, newEmail);
      Alert.alert('Success', 'Email updated Successfully.');
      setIsEditingEmail(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update email. Please try again.');
    }
  };

  const handleUpdateUsername = async () => {
    try {
      const userDoc = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userDoc, { username: newUsername });
      Alert.alert('Success', 'Username updated successfully.');
      setIseditingUsername(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update username. Please try again.');
    }
  };

  const handleUpdatePassword = async () => {
    try {
      await updatePassword(auth.currentUser, newPassword);
      Alert.alert('Success', 'Password updated successfully.');
      setIsEditingPassword(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update password. Please try again.');
    }
  };
  
  return (
    <View style={styles.container}>
      <SafeAreaView style={styles.safeArea}>
        <StatusBar translucent backgroundColor="transparent" barStyle="dark-content" />
        <Text style={styles.headerText}>Profile</Text>
        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>Email: {auth.currentUser?.email}</Text>
          <Text style={styles.infoText}>Username: {username || 'Fetching...'}</Text>
        </View>

        {/* Edit Email Modal */}
        <Modal visible={isEditingEmail} transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Update Email</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter new email"
                value={newEmail}
                onChangeText={setNewEmail}
              />
              <TouchableOpacity style={styles.button} onPress={handleUpdateEmail}>
                <Text style={styles.buttonText}>Update Email</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditingEmail(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Edit Username Modal */}
        <Modal visible={isEditingUsername} transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Update Username</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter new username"
                value={newUsername}
                onChangeText={setNewUsername}
              />
              <TouchableOpacity style={styles.button} onPress={handleUpdateUsername}>
                <Text style={styles.buttonText}>Update Username</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setIseditingUsername(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Edit Password Modal */}
        <Modal visible={isEditingPassword} transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Update Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter new password"
                secureTextEntry
                value={newPassword}
                onChangeText={setNewPassword}
              />
              <TouchableOpacity style={styles.button} onPress={handleUpdatePassword}>
                <Text style={styles.buttonText}>Update Password</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setIsEditingPassword(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Update Info Buttons */}
        <TouchableOpacity style={styles.button} onPress={() => setIsEditingEmail(true)}>
          <Text style={styles.buttonText}>Change Email</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setIseditingUsername(true)}>
          <Text style={styles.buttonText}>Change Username</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setIsEditingPassword(true)}>
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>

        {/* Log out button */}
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export default ProfileScreen;