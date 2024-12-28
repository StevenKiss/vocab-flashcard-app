import React, { useEffect, useState} from 'react';
import { View, Text, ActivityIndicator } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import {createStackNavigator} from '@react-navigation/stack';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { onAuthStateChanged } from 'firebase/auth';

import { Ionicons } from '@expo/vector-icons'; // For icons
import { COLORS } from './constants/colors'; // To implement color scheme
import { auth } from './firebase/firebaseConfig';

// Import the screens
import HomeScreen from './screens/HomeScreen/HomeScreen';
import LibraryScreen from './screens/LibraryScreen/LibraryScreen';
import FlashcardScreen from './screens/FlashcardScreen/FlashcardScreen';
import FlashcardSettingsScreen from './screens/FlashcardSettings/FlashcardSettingsScreen';
import AddScreen from './screens/AddScreen/AddScreen';
import CharactersScreen from './screens/CharacterScreen/CharactersScreen';
import ProfileScreen from './screens/ProfileScreen/ProfileScreen';
import LoginScreen from './screens/LoginScreen/LoginScreen';

// Navigators
const Tab = createBottomTabNavigator();
const Stack = createStackNavigator();
const LibraryStack = createStackNavigator();

// Library Stack
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
        name="FlashcardScreen" 
        component={FlashcardScreen}
        options={({route}) => ({title: route.params?.title || 'Flashcard Set'})}
      />

      {/* FlaschcardSettings is the third screen*/}
      <LibraryStack.Screen
        name="FlashcardSettingsScreen"
        component={FlashcardSettingsScreen}
        options={{ title: 'Flashcard Settings' }}
      />
    </LibraryStack.Navigator>
  );
}

// Main Tab navigator
function MainTabs() {
  return (
    <Tab.Navigator screenOptions={({route}) => ({ 
      headerShown: false,
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
  );
}

// Main App Component
const App = () => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      setIsLoggedIn(!!user); // Update login state
      setLoading(false);    // Stop loading
    });
    return () => unsubscribe(); // Cleanup on unmount
  }, []);

  if (loading) {
    // Code for simple spinner
    return (
      <View 
        style={{
          flex: 1,
          justifyContent: 'center',
          alignItems: 'center',
          backgroundColor: COLORS.background,
        }}
      >
        <Text>Loading...</Text>
        <ActivityIndicator size="large" color={COLORS.primary} />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        {isLoggedIn ? (
          // If logged in Show Main Tabs
          <MainTabs />
        ) : (
          // Show Login Screen if not logged in
          <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Login" component={LoginScreen} />
          </Stack.Navigator>
        )}
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

export default App;