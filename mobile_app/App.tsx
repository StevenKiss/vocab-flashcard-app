import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import { RootStackParamList } from './types/types'; // Import the navigation types
import { SafeAreaProvider } from 'react-native-safe-area-context';


import {Ionicons} from '@expo/vector-icons'; // For icons
import {COLORS} from './constants/colors'; // To implement color scheme

// Import the screens
import HomeScreen from './screens/HomeScreen';
import LibraryScreen from './screens/LibraryScreen';
import FlashcardScreen from './screens/FlashcardScreen';
import FlashcardSettingsScreen from './screens/FlashcardSettingsScreen';
import AddScreen from './screens/AddScreen';
import CharactersScreen from './screens/CharactersScreen';
import ProfileScreen from './screens/ProfileScreen';

// Creating the Tab Navigator
const Tab = createBottomTabNavigator();

// Creating a Stack Navigator for the Library
const LibraryStack = createStackNavigator();

function LibraryStackScreen() {
  return(
    <LibraryStack.Navigator screenOptions={{headerShown: false}}>

      {/* LibraryScreen is the default screen*/}
      <LibraryStack.Screen 
        name="LibraryMain"
        component={LibraryScreen} 
        options={{headerShown: false}}
      />

      {/* Flashcard is the secondary screen */}
      <LibraryStack.Screen 
        name="Flashcard" 
        component={FlashcardScreen}
        options={({route}) => ({title: route.params?.title || 'Flashcard Set'})}
      />

      {/* FlaschcardSettings is the third screen*/}
      <LibraryStack.Screen
        name="FlashcardSettings"
        component={FlashcardSettingsScreen}
        options={{ title: 'Flashcard Settings' }}
      />
    </LibraryStack.Navigator>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Tab.Navigator screenOptions={({route}) => ({ 
          headerShown: false, // Hides the screen header making it look nice
          tabBarStyle: {
            backgroundColor: COLORS.background,
            borderTopColor: COLORS.border,
          },
          tabBarIcon: ({focused, color, size}) => {
            let iconName;

            // Give icons for each route
            if (route.name == 'Home') {
              iconName = focused ? 'home' : 'home-outline';
            } else if (route.name == 'Library') {
              iconName = focused ? 'book' : 'book-outline';
            } else if (route.name == 'Add') {
              iconName = focused ? 'add-circle' : 'add-circle-outline';
            } else if (route.name == 'Characters') {
              iconName = focused ? 'grid' : 'grid-outline';
            } else if (route.name == 'Profile') {
              iconName = focused ? 'person' : 'person-outline';
            }
          
          return <Ionicons name={iconName} size={size} color={color} />;
          },
          tabBarActiveTintColor: COLORS.primary, // Tab color when in use
          tabBarInactiveTintColor: COLORS.textSecondary, // Tab color when not in use
          })}
        >
          <Tab.Screen name= "Home" component={HomeScreen} />
          <Tab.Screen name= "Library" component={LibraryStackScreen} />
          <Tab.Screen name= "Add" component={AddScreen} />
          <Tab.Screen name= "Characters" component={CharactersScreen} />
          <Tab.Screen name= "Profile" component={ProfileScreen} />
        </Tab.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}