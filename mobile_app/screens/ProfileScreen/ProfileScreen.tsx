import React, { useState, useEffect } from 'react';
import { View, Text, TouchableOpacity, Alert, StatusBar, TextInput, Modal } from 'react-native';
import { 
  signOut, 
  sendPasswordResetEmail, 
  sendEmailVerification, 
  deleteUser, 
  reauthenticateWithCredential, 
  EmailAuthProvider } from 'firebase/auth';
import { getDoc, updateDoc, doc, deleteDoc } from 'firebase/firestore';
import { auth, db } from '../../firebase/firebaseConfig';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './ProfileScreen.styles'
import { useNavigation } from '@react-navigation/native';

const ProfileScreen = () => {
  const [username, setUsername] = useState('');
  const [isEditingUsername, setIseditingUsername] = useState(false);
  const [newUsername, setNewUsername] = useState('');
  const [isReauthenticating, setIsReauthenticating] = useState(false);
  const [password, setPassword] = useState('');

  const navigation = useNavigation();

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

  const handleUpdateUsername = async () => {
    try {
      const userDoc = doc(db, 'users', auth.currentUser.uid);
      await updateDoc(userDoc, { username: newUsername });
      setUsername(newUsername);

      Alert.alert('Success', 'Username updated successfully.');

      setIseditingUsername(false);
    } catch (error) {
      Alert.alert('Error', 'Failed to update username. Please try again.');
    }
  };

  const handlePasswordReset = async () => {
    try {
      console.log("Running password reset");
      await sendPasswordResetEmail(auth, auth.currentUser.email);
      Alert.alert('Password Reset', 'A password reset email has been sent to your registered email address');
    } catch (error) {
      Alert.alert('Error', 'Failed to update password. Please try again.');
    }
  };

  const handleEmailChangeRequest = async () => {
    try {
      await sendEmailVerification(auth.currentUser);
      Alert.alert('Email Change','A verification email has been sent to your current email address. Please follow the instruction to update your email.');
    } catch (error) {
      Alert.alert('Error', 'Failed to send email verification. Please try again.');
    }
  };

  const handleReauthentication = async () => {
    try {
      const credential = EmailAuthProvider.credential(auth.currentUser?.email, password);
      await reauthenticateWithCredential(auth.currentUser, credential);
      
      // Account Deletion
      await deleteUserData();
      await deleteUser(auth.currentUser);

      Alert.alert('Account Deleted', 'Your account has been successfully deleted.');
      setIsReauthenticating(false);
    } catch (error) {
      console.error('Reauthentication failed:', error.message);
      if (error.code === 'auth/wrong-password') {
        Alert.alert('Error', 'Incorrect password. Please try again.');
      } else {
        Alert.alert('Error', 'Failed to reauthenticate. Please try again.');
      }
    }
  };

  const handleDeleteAccount = async () => {
    Alert.alert(
      'Confirm Delete',
      'Are you sure you want to delete your account? This action cannot be undone.',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              setIsReauthenticating(true);
            } catch (error) {
              console.error('Delete account failed:', error.message);
              Alert.alert('Error', 'Failed to delete account. Please try again.');
            }
          },
        },
      ]
    );
  };

  const deleteUserData = async () => {
    const userDoc = doc(db, 'users', auth.currentUser?.uid);
    await deleteDoc(userDoc);
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

        {/* Reauthentication Modal */}
        <Modal visible={isReauthenticating} transparent>
          <View style={styles.modalContainer}>
            <View style={styles.modalContent}>
              <Text style={styles.modalHeader}>Re-enter Password</Text>
              <TextInput
                style={styles.input}
                placeholder="Enter your password"
                secureTextEntry
                value={password}
                onChangeText={setPassword}
              />
              <TouchableOpacity style={styles.button} onPress={handleReauthentication}>
                <Text style={styles.buttonText}>Confirm</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.cancelButton} onPress={() => setIsReauthenticating(false)}>
                <Text style={styles.cancelButtonText}>Cancel</Text>
              </TouchableOpacity>
            </View>
          </View>
        </Modal>

        {/* Update Info Buttons */}
        <TouchableOpacity style={styles.button} onPress={handleEmailChangeRequest}>
          <Text style={styles.buttonText}>Change Email</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={() => setIseditingUsername(true)}>
          <Text style={styles.buttonText}>Change Username</Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.button} onPress={handlePasswordReset}>
          <Text style={styles.buttonText}>Change Password</Text>
        </TouchableOpacity>

        {/* Log out button */}
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Log Out</Text>
        </TouchableOpacity>

        {/* Delete Account Button */}
        <TouchableOpacity style={[styles.button, { backgroundColor: 'red' }]} onPress={handleDeleteAccount}>
          <Text style={styles.buttonText}>Delete Account</Text>
        </TouchableOpacity>
      </SafeAreaView>
    </View>
  );
};

export default ProfileScreen;