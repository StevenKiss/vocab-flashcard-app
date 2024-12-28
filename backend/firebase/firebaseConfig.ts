import { initializeApp } from "firebase/app";
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyC09aWi_VwywpCapXMRUln2KVWGUBtUM9c",
    authDomain: "chineseapp-7f543.firebaseapp.com",
    projectId: "chineseapp-7f543",
    storageBucket: "chineseapp-7f543.firebasestorage.app",
    messagingSenderId: "640248646162",
    appId: "1:640248646162:web:d25270f9e59177e09726cb",
    measurementId: "G-RG4PZLR9R8"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Export services for usage in app
export const auth = getAuth(app);
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;