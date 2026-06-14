import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import HomeScreen from '../screens/HomeScreen';
import DetailScreen from '../screens/DetailScreen';
import LoginScreen from '../screens/LoginScreen';
import SignUpScreen from '../screens/SignUpScreen';

const Stack = createNativeStackNavigator();

export default function AppNavigator() {
  return (
    <NavigationContainer>
      <Stack.Navigator
        screenOptions={{
          headerShown: false,
          cardStyle: { backgroundColor: '#000' },
          animationEnabled: true,
          animationTypeForReplace: 'default',
        }}
      >
        <Stack.Screen name="Home" component={HomeScreen} />
        <Stack.Screen
          name="Detail"
          component={DetailScreen}
          options={{
            cardStyle: { backgroundColor: '#000' },
          }}
        />
        <Stack.Screen
          name="Login"
          component={LoginScreen}
          options={{
            cardStyle: { backgroundColor: '#000' },
          }}
        />
        <Stack.Screen
          name="SignUp"
          component={SignUpScreen}
          options={{
            cardStyle: { backgroundColor: '#000' },
          }}
        />
      </Stack.Navigator>
    </NavigationContainer>
  );
}
