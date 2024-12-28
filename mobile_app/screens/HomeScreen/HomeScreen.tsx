import React, { useState, useEffect } from 'react';
import { View, Text, TextInput, TouchableOpacity, statusBar, StatusBar } from 'react-native';
import { onAuthStateChanged, signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './HomeScreen.styles';

const HomeScreen = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLogin, setIsLogin] = useState(true); // Toggle between login and sign-up
  const [user, setUser] = useState(null); // Tracks logged-in user

  // Check if user is logged in on app start
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
        if (currentUser) {
            setUser(currentUser);
        } else {
            setUser(null);
        }
    });

    return () => unsubscribe();
  }, []);

  // Handle login or sign-up
  const handleAuth = async () => {
    try {
      if (isLogin) {
        // Login
        const userCredential = await signInWithEmailAndPassword(auth, email, password);
        console.log('Logged in:', userCredential.user);
      } else {
        // Sign-up
        const userCredential = await createUserWithEmailAndPassword(auth, email, password);
        console.log('Account created:', userCredential.user);
      }
    } catch (error) {
      console.error('Authentication error:', error.message);
    }
  };

  // Render based on auth state
  if (user) {
    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <StatusBar
                    translucent
                    backgroundColor="transparent"
                    barStyle="dark-content"
                />
                <Text style={styles.headerText}>Welcome, {user.email}!</Text>
                <Text style={styles.subHeaderText}>You're now logged in and ready to use the app.</Text>
            </SafeAreaView>
        </View>
    )
  }
  return (
    <View style={styles.container}>
        <SafeAreaView style={styles.safeArea}>
                <StatusBar
                    translucent
                    backgroundColor="transparent"
                    barStyle="dark-content"
                />
                <Text style={styles.headerText}>{isLogin ? 'Login' : ' Sign Up'}</Text>
                <TextInput
                    style={styles.input}
                    placeholder="Email"
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    style={styles.input}
                    placeholder="Password"
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                <TouchableOpacity style={styles.button} onPress={handleAuth}>
                    <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Create Account'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setIsLogin((prev) => !prev)}>
                    <Text style={styles.toggleText}>
                        {isLogin ? "Don't have an account? Sign Up" : "Already have an account? Login"}
                    </Text>
                </TouchableOpacity>
            </SafeAreaView>
    </View>
  );
};

export default HomeScreen;
