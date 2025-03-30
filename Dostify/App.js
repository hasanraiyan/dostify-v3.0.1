import React from 'react';
import { StatusBar } from 'expo-status-bar';
import { StyleSheet } from 'react-native';
import { config } from './src/constants/constant';
import { AuthProvider } from './src/context/authContext';
import Navigation from './src/navigations/Navigation'; // Import the Navigation component
import { NavigationContainer } from '@react-navigation/native';
export default function App() {
  return (
    <AuthProvider>
       <NavigationContainer>
          <Navigation />
        </NavigationContainer>
      <StatusBar style="auto" />
    </AuthProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 20,
  },
  text: {
    fontSize: 16,
    color: 'green',
  },
});
