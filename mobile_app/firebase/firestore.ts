import { getFirestore, collection, addDoc, getDocs, deleteDoc, doc } from 'firebase/firestore';
import app from './firebaseConfig';

const db = getFirestore(app);

// Collection reference
const flashcardCollection = collection(db, 'flashcards');

// Add a new flashcard
export const addFlashcard = async (flashcard) => {
    try {
        await addDoc(flashcardCollection, {
            character: flashcard.character,
            pinyin: flashcard.pinyin,
            definition: flashcard.definition,
        });
        console.log('Flashcard added successfully!');
    } catch (error) {
        console.error('Error adding flashcard to Firestore:', error);
        throw error;
    }
}

// Get all flashcards
export const getAllFlashcards = async () => {
    const snapshot = await getDocs(flashcardCollection);
    return snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
};

// Delete flashcard
export const deleteFlashcard = async(id: string) => {
    try {
        await deleteDoc(doc(db, 'flashcards', id));
        console.log(`Flashcard with id ${id} deleted successfully!`);
    } catch (error) {
        console.error('Error deleting flashcard:', error);
        throw error;
    }
};