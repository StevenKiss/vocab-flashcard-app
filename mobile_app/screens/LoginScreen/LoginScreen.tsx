import React, { useState } from 'react';
import { View, Text, TextInput, TouchableOpacity, StatusBar } from 'react-native';
import { signInWithEmailAndPassword, createUserWithEmailAndPassword } from 'firebase/auth';
import { auth } from '../../firebase/firebaseConfig';
import { SafeAreaView } from 'react-native-safe-area-context';
import styles from './LoginScreen.styles';
import { query, where, collection, getDocs, setDoc, doc } from 'firebase/firestore';
import { db } from '../../firebase/firebaseConfig';


const LoginScreen = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [username, setUsername] = useState('');
    const [isLogin, setIsLogin] = useState(true); // Login vs. Sign-up
    const [errorMessage, setErrorMessage] = useState('');

    const handleAuth = async () => {
        try {
            if (isLogin) {
                if (email.includes("@")) {
                    // Login with email and password
                    const userCredential = await signInWithEmailAndPassword(auth, email, password);
                    console.log('Logged in:', userCredential.user);
                } else {
                    // Login with username and email
                    console.log("Login with username");
                    const usersRef = collection(db, "users");
                    const q = query(usersRef, where("username", "==", email));
                    const querySnapshot = await getDocs(q);

                    if (!querySnapshot.empty) {
                        const userDoc = querySnapshot.docs[0];
                        const userEmail = userDoc.data().email;

                        const userCredential = await signInWithEmailAndPassword(auth, userEmail, password);
                        console.log("Logged in with username:", userCredential.user);
                    } else {
                        setErrorMessage("Username not found");
                        throw new Error("Username not found");
                    }
                }
            } else {
                const userCredential = await createUserWithEmailAndPassword(auth, email, password);
                const uid = userCredential.user.uid;

                // Save username in Firestore
                const userRef = doc(db, "users", uid);
                await setDoc(userRef, {
                    username,
                    email,
                });

                //Create vocabests
                await setDoc(doc(db, `users/${uid}/vocabsets`, "_metadata"), {
                    createdAt: new Date(),
                    description: "Metadata for vocabsets collection",
                });

                console.log('Account created:', userCredential.user);
            }
        } catch (error) {
            console.log('Authentication error:', error.message);

            // Update error message based on error code
            switch (error.code) {
                case 'auth/invalid-email':
                    setErrorMessage('Invalid email address format.');
                    break;
                case 'auth/user-disabled':
                    setErrorMessage('This account has been disabled.');
                    break;
                case 'auth/user-not-found':
                    setErrorMessage('No account found with this email.');
                    break;
                case 'auth/wrong-password':
                    setErrorMessage('Incorrect password. Please try again.');
                    break;
                case 'auth/email-already-in-use':
                    setErrorMessage('Email is already in use. Please use a differnt one.');
                    break;
                case 'auth/weak-password':
                    setErrorMessage('Password is too weak. Use a stronger password.');
                    break;
                default:
                    setErrorMessage('An unexpected error occured. Please try again');
                    break;
            }
        }
    };

    return (
        <View style={styles.container}>
            <SafeAreaView style={styles.safeArea}>
                <StatusBar
                    translucent
                    backgroundColor="transparent"
                    barStyle={"dark-content"}
                />
                <Text style={styles.headerText}>{isLogin ? 'Login' : 'Sign Up'}</Text>

                <TextInput
                    style={styles.input}
                    placeholder={isLogin ? 'Email/Username' : 'Email'}
                    value={email}
                    onChangeText={setEmail}
                />
                <TextInput
                    style={styles.input}
                    placeholder='Password'
                    secureTextEntry
                    value={password}
                    onChangeText={setPassword}
                />
                {isLogin ? null : (
                <TextInput
                style={styles.input}
                placeholder='Username'
                value={username}
                onChangeText={setUsername}
                /> 
                )}

                {errorMessage ? (
                    <Text style={styles.errorText}>{errorMessage}</Text>
                ) : null }
                <TouchableOpacity style={styles.button} onPress={handleAuth}>
                    <Text style={styles.buttonText}>{isLogin ? 'Login' : 'Create Account'}</Text>
                </TouchableOpacity>
                <TouchableOpacity onPress={() => setIsLogin((prev) => !prev)}>
                    <Text style={styles.toggleText}>
                        {isLogin ? "Don't have an account? Sign Up" : 'Already have an account? Login'}
                    </Text>
                </TouchableOpacity>
            </SafeAreaView>
        </View>
    );
};

export default LoginScreen;