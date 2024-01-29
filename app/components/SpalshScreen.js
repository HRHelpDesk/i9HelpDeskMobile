import React, { useEffect } from 'react';
import { View, Image, StyleSheet } from 'react-native';
import { ActivityIndicator } from 'react-native-paper';

const SplashScreen = () => {
  

  return (
    <View style={styles.container}>
      <Image source={require('../assets/images/i9HelpDesk.png')} style={styles.logo} />
      <ActivityIndicator size="large" color="#ffffff" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: '#102372', // Set the background color
  },
  logo: {
    width: 225, // Adjust the width of the logo as needed
    height: 50, // Adjust the height of the logo as needed
    marginBottom: 20,
  },
});

export default SplashScreen;
