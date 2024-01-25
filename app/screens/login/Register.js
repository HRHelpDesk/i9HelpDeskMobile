// RegistrationScreen.js
import React, { useState } from 'react';
import { View, TextInput, Button, Alert } from 'react-native';
import axios from 'axios';
import { API } from '../../utils/controller';

const Register = ({ navigation }) => {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  const handleRegister = async () => {
    // Add validation for required fields, password match, etc.
    if (!firstName || !lastName || !email || !password || password !== confirmPassword) {
      Alert.alert('Invalid Input', 'Please provide valid information.');
      return;
    }

    try {
      // Make a POST request to the server's registration endpoint
      const response = await axios.post(API + '/auth/register', {
        firstName,
        lastName,
        email,
        password,
      });

      // Display a success message or handle the response as needed
      Alert.alert('Registration Successful', 'User registered successfully');

      // Navigate to the Home screen or any other desired screen
      navigation.navigate('Home');
    } catch (error) {
      // Display an error message or handle the error as needed
      Alert.alert('Registration Failed', 'Error registering user');
    }
  };

  return (
    <View>
      <TextInput placeholder="First Name" onChangeText={setFirstName} />
      <TextInput placeholder="Last Name" onChangeText={setLastName} />
      <TextInput placeholder="Email" onChangeText={setEmail} />
      <TextInput placeholder="Password" secureTextEntry={true} onChangeText={setPassword} />
      <TextInput
        placeholder="Confirm Password"
        secureTextEntry={true}
        onChangeText={setConfirmPassword}
      />
      <Button title="Register" onPress={handleRegister} />
    </View>
  );
};

export default Register;
