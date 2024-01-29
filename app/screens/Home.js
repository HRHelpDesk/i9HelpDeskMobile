// HomeScreen.js
import React, { useEffect, useState } from 'react';
import { Text, Button, Appbar, Menu, Divider, IconButton, PaperProvider, Icon } from 'react-native-paper';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';

import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { ScrollView } from 'react-native-gesture-handler';
import { View } from 'react-native';
import { API } from '../utils/controller';
import { SvgIconHolder } from '../components/SvgIconHolder';
import SplashScreen from '../components/SpalshScreen';

const Home = ({ navigation }) => {
  const [user, setUser] = useState(null);
  const [isLoading, setIsLoading] = useState(true)
  const data = [
    { title: "Pending I9s", number: user === null ?'': user.data.i9.length, description: 'See the status of the I9s you have started.', onClick: ()=>{navigation.navigate('I9s')} },
    { title: "E-Verifys", number: '02', description: 'Description 2' },
    { title: 'Title 3', number: '03', description: 'Description 3' },
    { title: 'Title 4', number: '04', description: 'Description 4' },
  ];
  useEffect(() => {
    // Fetch user data from AsyncStorage when the component mounts
    const fetchUserData = async () => {
      try {
        const storedUser = await AsyncStorage.getItem('user');
        const storedToken = await AsyncStorage.getItem('token');

        if (storedUser && storedToken) {
          // If the user data and token are present in AsyncStorage,
          // use the token to refresh user data from the server
          const response = await axios.post(API+'/auth/refresh-user', { token: storedToken });
          const refreshedUser = response.data.user;

          // Update the user data in AsyncStorage
          await AsyncStorage.setItem('user', JSON.stringify(refreshedUser));

          setUser(refreshedUser);
          setIsLoading(false)
        }
      } catch (error) {
        console.error('Error fetching user data:', error.message);
        navigation.navigate('Login');
      }
    };

    fetchUserData();
  }, []);

  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const [qmVisible, setQmVisible] = useState(false);

  const openQmMenu = () => setQmVisible(true);
  const closeQmMenu = () => setQmVisible(false);


  const handleLogout = async () => {
    // Clear the stored token and user data
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');

    // Navigate back to the login screen
    navigation.navigate('Login');
    closeMenu()
  };
  if(isLoading) {
  return <SplashScreen/>
  } else {

  return (
    <PaperProvider>
      <View style={{ flex: 1, backgroundColor: '#F4F4F4' }}>
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
              <Button
              onPress={() => openMenu()}
              >  
                <SvgIconHolder
              d="M13 5c0-2.76-2.24-5-5-5S3 2.24 3 5c0 1.52.678 2.882 1.75 3.8C2.52 9.97 1 12.306 1 15c0 .552.448 1 1 1s1-.448 1-1c0-2.76 2.24-5 5-5s5 2.24 5 5c0 .552.448 1 1 1s1-.448 1-1c0-2.693-1.52-5.03-3.75-6.2C12.323 7.88 13 6.52 13 5zM8 8C6.343 8 5 6.657 5 5s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z"
              fill="white"
              /></Button>
              
            }
          >
            <Menu.Item onPress={() => { /* Add functionality for Account Settings */ }} title="Account Settings" />
            <Divider />
            <Menu.Item onPress={handleLogout} title="Logout" />
          </Menu>
        </Appbar.Header>
        <ScrollView>
          <View style={{ alignItems: 'flex-end', marginRight: 10 }}>
            <Menu
              visible={qmVisible}
              onDismiss={closeQmMenu}
              anchor={<Button onPress={openQmMenu}>Quick Menu</Button>}
            >
              <Menu.Item onPress={() => { navigation.navigate('I9Setup'); }} title="New I9" />
              <Divider />
              <Menu.Item onPress={() => { /* Add functionality for New Everify */ }} title="New Everify" />
            </Menu>
          </View>
          {data.map((item, index) => (
            <View key={index} style={{ margin: 10, padding: 10, backgroundColor: 'white', borderRadius: 10 }}>
              <Text style={{ fontSize: 18, fontWeight: 'bold' }}>{item.title}</Text>
              <Text style={{ fontSize: 24, color: '#FCBD2A' }}>{item.number}</Text>
              <Text style={{ fontSize: 14, color: 'gray' }}>{item.description}</Text>
              <Button
                onPress={item.onClick}
                style={{ alignSelf: 'flex-end', marginTop: 5, backgroundColor: '#FCBD2A' }}
                textColor='white'
              >
                <Text style={{ fontWeight: 'bold', color: 'white' }}>View</Text>
              </Button>
            </View>
          ))}
          <Button title="Logout" onPress={handleLogout} />
        </ScrollView>
      </View>
    </PaperProvider>
  );
 }
};


export default Home;
