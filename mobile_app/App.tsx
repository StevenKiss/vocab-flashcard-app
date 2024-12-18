import React from 'react';
import {NavigationContainer} from '@react-navigation/native';
import {createBottomTabNavigator} from '@react-navigation/bottom-tabs';
import {View, Text} from 'react-native';
import {Ionicons} from '@expo/vector-icons'; // For icons

// Screens
const HomeScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Text> Home Screen </Text>
  </View>
);

const LibraryScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Text> Libarary Screen</Text>
  </View>
);

const AddScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Text> Add Screen </Text>
  </View>
);

const CharactersScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Text> Characters Screen</Text>
  </View>
);

const ProfileScreen = () => (
  <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center'}}>
    <Text> Profile Screen</Text>
  </View>
);


// Creating the Tab Navigator
const Tab = createBottomTabNavigator();

export default function App() {
  return (
    <NavigationContainer>
      <Tab.Navigator screenOptions={({route}) => ({ 
        headerShown: false, // Hides the screen header making it look nice
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
        tabBarActiveTintColor: '#007AFF', // Tab color when in use
        tabBarInactiveTintColor: 'gray', // Tab color when not in use
        })}
      >
        <Tab.Screen name= "Home" component={HomeScreen} />
        <Tab.Screen name= "Library" component={LibraryScreen} />
        <Tab.Screen name= "Add" component={AddScreen} />
        <Tab.Screen name= "Characters" component={CharactersScreen} />
        <Tab.Screen name= "Profile" component={ProfileScreen} />
      </Tab.Navigator>
    </NavigationContainer>
  );
}