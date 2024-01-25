// LoginScreen.js
import React, { useState } from 'react';
import { View, Image, Alert } from 'react-native';
import { TextInput, Button, Text, Card, Switch } from 'react-native-paper';
import axios from 'axios';
import AsyncStorage from '@react-native-async-storage/async-storage';
import logo from '../../assets/images/i9HelpDesk.png';
import { API } from '../../utils/controller';

const Login = ({ navigation }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [rememberMe, setRememberMe] = useState(false);
  const [loginLoader, setLoginLoader] = useState(false);
  const handleLogin = async () => {
    try {
      setLoginLoader(true)
      const response = await axios.post(API + '/auth/login', { email, password, keepLoggedIn: rememberMe });
      const { token, user } = response.data;

      // Store the token and user data securely using AsyncStorage
      await AsyncStorage.setItem('token', token);
      await AsyncStorage.setItem('user', JSON.stringify(user));
      // Display a success message or handle the response as needed
      Alert.alert('Login Successful', `Welcome back, ${user.firstName} ${user.lastName}!`);
      setLoginLoader(false)
      // Navigate to the authenticated screen (e.g., HomeScreen)
      navigation.navigate('Home');
    } catch (error) {
      setLoginLoader(false)
      // Display an error message or handle the error as needed
      Alert.alert('Login Failed', 'Invalid credentials');
    }
  };

  const navigateToRegistration = () => {
    navigation.navigate('Registration');
  };

  return (
    <View style={{ flex: 1, padding: 16, backgroundColor: '#102372', paddingTop: 150, paddingLeft: 20, paddingRight: 20 }}>
      {/* Placeholder for Logo */}
      <Image
        source={logo} // Replace with your actual logo path
        style={{ width: '100%', height: 100, marginBottom: 20 }}
        resizeMode="contain"
      />
      <Card style={{ paddingTop: 16, paddingLeft: 16, paddingRight: 16, width: '100%', backgroundColor: 'white', elevation: 4, borderRadius: 5 }}>
        <TextInput
          label="Email"
          value={email}
          mode='outlined'
          underlineColor='white'
          activeUnderlineColor='#102372'
          onChangeText={(text) => setEmail(text)}
          style={{ marginBottom: 16, backgroundColor: 'white' }}
        />
        <TextInput
          label="Password"
          underlineColor='white'
          mode='outlined'
          activeUnderlineColor='#102372'
          value={password}
          secureTextEntry
          onChangeText={(text) => setPassword(text)}
          style={{ marginBottom: 16, backgroundColor: 'white', marginTop: 5 }}
        />

        {/* Remember Me Switch */}
        <View style={{ flexDirection: 'row', alignItems: 'center', marginBottom: 16 }}>
          <Switch
            value={rememberMe}
            onValueChange={() => setRememberMe(!rememberMe)}
            color="#B0BFC6"
          />
          <Text style={{ marginLeft: 10, color: '#102372' }}>Remember Me</Text>
        </View>

        <Button loading={loginLoader} mode="contained" onPress={handleLogin} style={{ marginBottom: 16, borderRadius: 10, backgroundColor: '#B0BFC6', marginTop: 15 }}>
          <Text style={{ fontWeight: 'bold', color: 'white' }}>LOGIN</Text>
        </Button>
      </Card>

      <Button textColor='white' style={{ marginTop: 15, color: 'white' }}>
        <Text style={{ fontWeight: 'bold', color: 'white' }}>FORGOT PASSWORD?</Text>
      </Button>
    </View>
  );
};

export default Login;
