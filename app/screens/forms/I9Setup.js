import React, { useEffect, useState } from 'react';
import { View, ScrollView, TextInput } from 'react-native';
import { Appbar, Menu, Divider, ToggleButton, Text, Button, IconButton } from 'react-native-paper';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import uuid from 'react-native-uuid';
import { API } from '../../utils/controller';

const I9Setup = ({ navigation }) => {
  const [sent, setSent] = useState(false);
  const [formData, setFormData] = useState({
    id: uuid.v4(),
    firstName: '',
    lastName: '',
    email: '',
    phoneNumber: '',
    date: '',
    communicationMethod: '',
    sectionOne:{},
    sectionTwo:{},
    everifyData:{}
  });

  useEffect(() => {
    console.log(formData);
    console.log(user)
  }, [formData]);

  // Function to handle form field changes
  const handleInputChange = (fieldName, value) => {
    setFormData((prevData) => ({
      ...prevData,
      [fieldName]: value,
    }));
  };

  const handleSubmit = async () => {
    try {
      // Do something with the form data, e.g., send it to a server
      console.log('Form Data:', formData);

      const resp = await axios.post(API + '/i9/start-i9',  { id: user._id, data: formData });

      if (resp.data.success) {
        window.alert(
          'I-9 Setup was successful. Please reach out to the candidate and make sure they click the link to complete the I9 form.'
        );
        setSent(true);
      } else {
        window.alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form data:', error);
      window.alert('An error occurred. Please try again.');
    }
  };

  const [user, setUser] = useState(null);
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const handleLogout = async () => {
    // Clear the stored token and user data
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');

    // Navigate back to the login screen
    navigation.navigate('Login');
    closeMenu()
  };

  useEffect(() => {
    // Fetch user data from AsyncStorage when the component mounts
    const fetchUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const storedToken = await AsyncStorage.getItem('token');

        if (storedUser && storedToken) {
          // If the user data and token are present in AsyncStorage,
          // use the token to refresh user data from the server
          const response = await axios.post(API + '/auth/refresh-user', { token: storedToken });
          const refreshedUser = response.data.user;

          // Update the user data in AsyncStorage
          await AsyncStorage.setItem('user', JSON.stringify(refreshedUser));

          setUser(refreshedUser);
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
        navigation.navigate('Login');
      }
    };

    fetchUserData();
  }, [navigation]);

  return (
    <View style={{ flex: 1, backgroundColor: '#FFFFFF' }}>
     <Appbar.Header style={{ backgroundColor: '#102372' }}>
        <Appbar.Content
          title={
            user ? (
              <Text style={{ textAlign: 'left', color: 'white', fontWeight: 'bold' }}>
                Welcome, {user.firstName} {user.lastName}!
              </Text>
            ) : (
              <Text>Loading user data...</Text>
            )
          }
        />
        <Menu
          visible={visible}
          onDismiss={closeMenu}
          anchor={
            <IconButton
              icon="dots-vertical"
              color="white"
              size={20}
              onPress={() => openMenu()}
              style={{ marginRight: 10 }}
            />
          }
        >
          <Menu.Item onPress={() => { /* Add functionality for Account Settings */ }} title="Account Settings" />
          <Divider />
          <Menu.Item onPress={handleLogout} title="Logout" />
        </Menu>
      </Appbar.Header>

      <ScrollView style={{ padding: 20 }}>
        <Text>Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description Description</Text>
        <Text style={{ fontSize: 18, marginTop: 10, fontWeight: 'bold' }}>Candidate Information</Text>
        <TextInput
          label="First Name"
          placeholder="First Name"
          value={formData.firstName}
          onChangeText={(text) => handleInputChange('firstName', text)}
          style={{ marginBottom: 10, padding: 10, borderColor: 'gray', borderWidth: 1 }}
        />
        <TextInput
          label="Last Name"
          placeholder="Last Name"
          value={formData.lastName}
          onChangeText={(text) => handleInputChange('lastName', text)}
          style={{ marginBottom: 10, padding: 10, borderColor: 'gray', borderWidth: 1 }}
        />

        <View>
          <Text style={{ fontSize: 14, marginBottom: 1 }}>How would you like to send the I-9 form for the candidate to fill out?</Text>
        </View>
        <ToggleButton.Row
          value={formData.communicationMethod}
          onValueChange={(value) => handleInputChange('communicationMethod', value)}
        >
          <ToggleButton icon="email" value="email">
            Email
          </ToggleButton>
          <ToggleButton icon="message-text" value="text">
            Text
          </ToggleButton>
        </ToggleButton.Row>


        {formData.communicationMethod === 'email' && (
          <View>
          <Text style={{marginTop:10, marginBottom:10}}>Please enter the cantidates email address:</Text>

          <TextInput
            label="Email"
            placeholder="Email"
            value={formData.email}
            onChangeText={(text) => handleInputChange('email', text)}
            style={{ marginBottom: 10, padding: 10, borderColor: 'gray', borderWidth: 1 }}
          />
          </View>
        )}

        {formData.communicationMethod === 'text' && (
            <View>
            <Text style={{marginTop:10, marginBottom:10}}>Please enter the cantidates phone number:</Text>
  
          <TextInput
            label="Phone Number"
            placeholder="Phone Number"
            value={formData.phoneNumber}
            onChangeText={(text) => handleInputChange('phoneNumber', text)}
            style={{ marginBottom: 10, padding: 10, borderColor: 'gray', borderWidth: 1 }}
          />
          </View>
        )}

        <Button
          variant="contained"
          onPress={handleSubmit}
          disabled={!formData.communicationMethod || sent}
          style={{ alignSelf: 'flex-end', marginTop: 5, backgroundColor: '#FCBD2A' }}
          textColor='white'
        >Submit</Button>
      </ScrollView>

      {sent && (
        <View style={{ padding: 20 }}>
          <Text>
            The I9 form has been sent!
          </Text>
          <Button onPress={() => navigation.navigate('Home')} >Go Home</Button>
          <Button onPress={() => navigation.reset({ index: 0, routes: [{ name: 'I9Setup' }] })} >Start Over</Button>
        </View>
      )}
    </View>
  );
};

export default I9Setup;
