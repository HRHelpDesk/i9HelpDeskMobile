import React, { useEffect, useState } from 'react';
import { View, ScrollView, StyleSheet, RefreshControl, Alert } from 'react-native';
import { TextInput, Button, DataTable, IconButton, Appbar, Menu, Divider } from 'react-native-paper';
import { useNavigation, useFocusEffect } from '@react-navigation/native';
import axios from 'axios';
import { API } from '../utils/controller';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { TouchableOpacity } from 'react-native-gesture-handler';
import { Path, Svg } from 'react-native-svg';
import { Text } from '@react-native-material/core';
import { SvgIconHolder } from '../components/SvgIconHolder';
import { formatDate } from '../utils/GlobalFunctions';

export const PendingI9s = ({navigation}) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  // const navigation = useNavigation();
  const [searchInput, setSearchInput] = useState('');
  const [filteredData, setFilteredData] = useState([]);
  const [update, setUpdate] = useState(true);
  const [visible, setVisible] = useState(false);

  const openMenu = () => setVisible(true);
  const closeMenu = () => setVisible(false);

  const fetchUserData = async () => {
    const storedUser = await AsyncStorage.getItem('user');
    const storedToken = await AsyncStorage.getItem('token');

  try {
    const response = await axios.post(API + '/auth/refresh-user', { token: storedToken });
    const refreshedUser = response.data.user;

    setUser(refreshedUser);
    setLoading(false);
  } catch (error) {
    console.error('Error fetching user data:', error.message);

  }

};
  useFocusEffect(
  
    React.useCallback(() => {
      console.log('2')
  
  fetchUserData();
}, [update])


)
 
const [refreshing, setRefreshing] = useState(false);

const onRefresh = React.useCallback(() => {
  setRefreshing(true);
  fetchUserData()
  setTimeout(() => {
    setRefreshing(false);
  }, 2000);
}, []);

  const copyLink = async (a, b) => {
    // Implement the copy link functionality for React Native
    // ...
  };

  const deleteI9 = async (a, b) => {
    // Implement the delete I9 functionality for React Native
    // ...
  };

  const handleLogout = async () => {
    // Clear the stored token and user data
    await AsyncStorage.removeItem('token');
    await AsyncStorage.removeItem('user');

    // Navigate back to the login screen
    navigation.navigate('Login');
    closeMenu()
  };

  if (loading) {
    return <Text>Loading</Text>;
  } else {
    return (
        <View style={{height:'100%'}}>
        
            <Appbar.Header style={{ backgroundColor: '#102372' }}>
            <Button style={{}} onPress={()=>navigation.goBack()}>
  <SvgIconHolder
  d="M3.443 9.062C3.158 8.777 3 8.402 3 8.002c0-.403.158-.78.443-1.062L10.276.293c.395-.39 1.033-.39 1.428 0s.395 1.024 0 1.413L5.228 8.002l6.476 6.294c.395.39.395 1.024 0 1.415-.395.39-1.033.39-1.428-.002L3.443 9.063z"
  fill="white"
  />
  <SvgIconHolder
  d="M12.005 13.997c0-.008-8 0-8 0 .007 0 0-5 0-5 0-.552-.448-1-1-1s-1 .448-1 1v5c0 1.105.895 2 2 2h8c1.102-.003 1.994-.897 1.994-2v-5c0-.552-.45-1-1-1-.553 0-1 .448-1 1l.005 5zm2.372-6.23c.202.173.467.255.73.228.266-.028.508-.163.67-.374.348-.445.287-1.085-.14-1.457L8.692.263c-.41-.35-1.012-.35-1.42 0L.365 6.135c-.427.372-.49 1.012-.14 1.458.16.21.403.346.668.373.264.028.528-.054.73-.227l6.37-5.39 6.376 5.422.007-.005zm-6.354 3.22c1.1-.003 1.99-.897 1.988-1.998 0-1.1-.895-1.992-1.995-1.99-1.1 0-1.992.893-1.992 1.993.003 1.103.898 1.994 2 1.994z"
  fill="white"
  />
  </Button>
          <Appbar.Content
            title={
              <Text variant="button" style={{color: 'white', fontWeight: 'bold', fontSize:16 }}>
              Pending I9s</Text>
       
            }
          />
          <Menu
            visible={visible}
            onDismiss={closeMenu}
            anchor={
              <Button
              size={20}
              onPress={() => openMenu()}
              >
              <Svg width={16} height={16} viewBox="0 0 16 16">
             <Path
             d="M13 5c0-2.76-2.24-5-5-5S3 2.24 3 5c0 1.52.678 2.882 1.75 3.8C2.52 9.97 1 12.306 1 15c0 .552.448 1 1 1s1-.448 1-1c0-2.76 2.24-5 5-5s5 2.24 5 5c0 .552.448 1 1 1s1-.448 1-1c0-2.693-1.52-5.03-3.75-6.2C12.323 7.88 13 6.52 13 5zM8 8C6.343 8 5 6.657 5 5s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z"
              fill="white" // Set the desired color here
             />
           </Svg>
           </Button>
         
            }
          >
            <Menu.Item onPress={() => { /* Add functionality for Account Settings */ }} title="Account Settings" />
            <Divider />
            <Menu.Item onPress={handleLogout} title="Logout" />
          </Menu>
        </Appbar.Header>
           
        {/* Implement the NavBar component for React Native */}
        {/* Implement the TitleBar component for React Native */}
        <View style={{paddingHorizontal:10, paddingVertical:5}}>
        <TextInput
          label="SEARCH BY EMPLOYEE NAME"
          mode='outlined'
          underlineColor='white'
          activeUnderlineColor='#102372'
          value={searchInput}
          onChangeText={(text) => setSearchInput(text)}
          style={{ marginBottom: 16, backgroundColor: 'white' }}

        />
      </View>

      <ScrollView refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />} style={styles.container}>

     
          {user.data.i9
  .filter(
    (i) =>
      (i.sectionOne?.firstName ? i.sectionOne?.firstName : i.firstName)
        .toLowerCase()
        .includes(searchInput.toLowerCase()) ||
      (i.sectionOne?.lastName ? i.sectionOne?.lastName : i.lastName)
        .toLowerCase()
        .includes(searchInput.toLowerCase())
  )
  .map((i) => (
    <TouchableOpacity
      key={i.id}
      onPress={() =>{ 
        if(i.sectionOne?.submitted){
          
        navigation.navigate('I9Details', { a: user._id, b: i.id })
      
      } else{
        Alert.alert('No Data','There is no data for this I9 currently. The employee still needs to complete Section One.')
      }
      }}
      style={liStyles.listItemContainer}
    >
      <View>
        <Text><Text style={{fontWeight:'bold'}}>Name: </Text>{i.sectionOne?.firstName ? i.sectionOne?.firstName : i.firstName} {i.sectionOne?.lastName ? i.sectionOne?.lastName : i.lastName}</Text>
        <Text><Text style={{fontWeight:'bold'}}>Date: </Text>{formatDate(i.date)}</Text>
        <Text style={{ color: i.sectionOne?.submitted && i.sectionTwo?.submitted ? 'green' : i.sectionOne?.submitted && i.sectionTwo?.submitted === false ? 'orange' : 'orange', fontWeight: 'bold' }}>
        <Text style={{fontWeight:'bold'}}>Status: </Text>  {i.sectionOne?.submitted && i.sectionTwo?.submitted ? 'Completed' : !i.sectionOne?.submitted && !i.sectionTwo?.submitted ? 'Section 1 Completed, Section 2 Ready' : 'Sent to Employee'}
        </Text>
      </View>
    </TouchableOpacity>
  ))}
  

      </ScrollView>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F4F4F4',
    paddingVertical: 0,
    paddingHorizontal: 10,
  },
});


const liStyles = StyleSheet.create({
    listItemContainer: {
      padding: 10,
      marginVertical: 5,
      backgroundColor: 'white',
      borderRadius: 5,
    },
  });
  