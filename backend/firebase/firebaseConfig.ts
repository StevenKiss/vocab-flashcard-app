import { initializeApp } from "firebase/app";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC09aWi_VwywpCapXMRUln2KVWGUBtUM9c",
  authDomain: "chineseapp-7f543.firebaseapp.com",
  projectId: "chineseapp-7f543",
  storageBucket: "chineseapp-7f543.firebasestorage.app",
  messagingSenderId: "640248646162",
  appId: "1:640248646162:web:d25270f9e59177e09726cb",
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

export default app;