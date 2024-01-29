// App.js
import React, { useEffect, useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createStackNavigator } from '@react-navigation/stack';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Login from './app/screens/login/Login';
import { View, Text, Button } from 'react-native';

import Register from './app/screens/login/Register';
import Home from './app/screens/Home';
import I9Setup from './app/screens/forms/I9Setup';
import { PendingI9s } from './app/screens/PendingI9s';
import SectionOne from './app/screens/detail-screens/SectionOne';
import SectionTwo from './app/screens/detail-screens/SectionTwo';
import { SupplementB } from './app/screens/detail-screens/SupplementB';
import SectionTwoForm from './app/screens/forms/SectionTwoForm';
import EverifySubmit from './app/screens/forms/EverifySubmit';
import SplashScreen from './app/components/SpalshScreen';

const Stack = createStackNavigator();

const App = () => {
  const [initialRoute, setInitialRoute] = useState('Login');
  const [isLoading, setIsLoading] = useState(true)
  useEffect(() => {
    // Check if the token is present in AsyncStorage
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem('token');
        console.log('Stored token:', token); // Add this line for debugging

        if (token) {
          console.log('Home')
          // If the token is present, consider the user as authenticated
          setInitialRoute('Home');
          setIsLoading(false)
        } else {
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Error checking token:', error.message);
      }
    };

    checkToken();
  }, []);
if(isLoading === true){
  return (<SplashScreen/>)
} else {
  
  return (
    <NavigationContainer>
      <Stack.Navigator initialRouteName={initialRoute}>
        <Stack.Screen
        options={{ headerShown: false }}
        name="Login" component={Login} />
        <Stack.Screen
        name="Registration" component={Register} />
        <Stack.Screen
        options={{ headerShown: false }}
        name="Home" component={Home} />

        <Stack.Screen
        options={{ headerShown: false }}
        name="I9Setup" component={I9Setup} />

<Stack.Screen
        options={{ headerShown: false }}
        name="I9s" component={PendingI9s} />

<Stack.Screen
        options={{ headerShown: false }}
        name="I9Details" component={SectionOne} />

<Stack.Screen
        options={{ headerShown: false }}
        name="section-two" component={SectionTwo} />

<Stack.Screen
        options={{ headerShown: false }}
        name="supplement-b" component={SupplementB} />

      <Stack.Screen
        options={{ headerShown: false }}
        name="section-two-form" component={SectionTwoForm} />

      <Stack.Screen
        options={{ headerShown: false }}
        name="submit-everify" component={EverifySubmit} />

        

      </Stack.Navigator>

      
    </NavigationContainer>
  );
}
  
};

export default App;
