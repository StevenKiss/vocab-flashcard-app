import { RouteProp } from '@react-navigation/native';

export type RootStackParamList = {
    LibraryMain: {
      extractedVocab: { Word: string; Pinyin: string; Definition: string }[];
      fileName: string;
    };
    Flashcard: { setId: string; vocab: any[]; title: string };
    Add: undefined;
  };

// Export the RouteProp for Flashcard 
export type FlashcardRouteProp = RouteProp<RootStackParamList, 'Flashcard'>;
