// mobile_app/firebase/firebaseConfig.ts
import { initializeApp } from "firebase/app";
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';
import { firebaseSecrets } from './firebaseSecrets';

// Firebase configuration
const firebaseConfig = {
    ...firebaseSecrets
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Auth
const auth = getAuth(app);

// Export services
export { auth };
export const db = getFirestore(app);
export const storage = getStorage(app);

export default app;
