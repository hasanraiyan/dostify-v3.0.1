import React, { useEffect } from 'react';
import { View, Text, StyleSheet, Image } from 'react-native';

const SplashScreen = ({ navigation }) => { // Update parameter to include navigation
  
  useEffect(() => {
    const timer = setTimeout(() => {
      navigation.replace('LoginScreen'); // Navigate to LoginScreen after timeout
    }, 3000); // Display splash for 3 seconds

    return () => clearTimeout(timer); // Cleanup on unmount
  }, [navigation]);

  return ( // Ensure correct placement of the return statement
    <View style={styles.container}>
      <Image 
        source={{ uri: 'https://dostify-climb.vercel.app/icon-removebg-preview.png' }} // Replace with your logo URL
        style={styles.logo}
      />
      <Text style={styles.text}>Welcome to Dostify</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#ffffff', // Change to your preferred background color
  },
  logo: {
    width: 100,
    height: 100,
    marginBottom: 20,
  },
  text: {
    fontSize: 18,
    fontWeight: 'bold',
  },
});

export default SplashScreen;
