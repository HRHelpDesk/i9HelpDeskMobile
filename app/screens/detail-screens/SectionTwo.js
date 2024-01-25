import React, { useEffect, useState } from 'react';
import { View, ScrollView, Modal, Image, StyleSheet } from 'react-native';
import { ActivityIndicator, Appbar, Button, Card, Divider, Menu } from 'react-native-paper';
import { Titlebar } from '../../components/Titlebar';
import { SvgIconHolder } from '../../components/SvgIconHolder';
import Svg, { Path } from 'react-native-svg';
import { Text } from '@react-native-material/core';
import { formatDate } from '../../utils/GlobalFunctions';

const SectionTwo = ({ route, navigation }) => {
  const [loading, setLoading] = useState(true);
  const [sectionOne, setSectionOne] = useState(null);
  const [sectionTwo, setSectionTwo] = useState(null);
  const [imgModal, setImgModal] = useState(false);
  const [img, setImg] = useState('');
  const [loadingImg, setLoadingImg] = useState(true);

  const onLoadEnd = () => {
    setLoadingImg(false);
  };

  const [qmVisible, setQmVisible] = useState(false);

  const openQmMenu = () => setQmVisible(true);
  const closeQmMenu = () => setQmVisible(false);

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
    // Fetch section one and section two data
    const fetchData = async () => {
      // Fetch section one and section two data based on route.params
      // ...
    console.log(route.params.a)
      // Set the state with the fetched data
      setSectionOne(route.params.sectionOne);
      setSectionTwo(route.params.sectionTwo);
      setLoading(false);
    };

    fetchData();
  }, [route.params]);

  const handleOpenModal = (image) => {
    setImg(image);
    setImgModal(true);
  };

  const handleCloseModal = () => {
    setImg('');
    setImgModal(false);
  };

  if (loading) {
    return <Text>Loading...</Text>;
  } else {
    return (
      <View style={{ flex: 1 }}>
        <Appbar.Header style={{ backgroundColor: '#102372' }}>
      <Button style={{}} onPress={()=>navigation.goBack()}>
  <SvgIconHolder
  d="M3.443 9.062C3.158 8.777 3 8.402 3 8.002c0-.403.158-.78.443-1.062L10.276.293c.395-.39 1.033-.39 1.428 0s.395 1.024 0 1.413L5.228 8.002l6.476 6.294c.395.39.395 1.024 0 1.415-.395.39-1.033.39-1.428-.002L3.443 9.063z"
  fill="white"
  />
 
  </Button>
  <Appbar.Content
    titleStyle={{textAlign:'left'}}
    
    title={
   
        <Text variant="button" style={{color: 'white', fontWeight: 'bold', fontSize:16 }}>
          Section Two
        </Text>
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

    <Menu.Item onPress={handleLogout} title="Logout" />
  </Menu>
</Appbar.Header>

        <ScrollView style={styles.container}>
          {/* Render section two data using Card, Text, etc. components */}
        <Card style={{padding:15, borderRadius:5, backgroundColor:'white', marginBottom:10}}>
            <Text variant='button' style={styles.sectionTitle}>List Type and Documents</Text>
            <Divider style={{marginVertical:10}}/>
         
           <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                marginBottom: 5,
                display: sectionOne.listType === 'listA' ? 'flex':'none'
            }}>
            <View style={styles.gridItem50}>
          <Text style={styles.sectionHeader}>List Type</Text>
            <Text style={styles.sectionP}>{'List A'}</Text>
            </View>

            <View style={styles.gridItem50}>
          <Text style={styles.sectionHeader}>List A Document</Text>
          <Text onPress={()=>handleOpenModal(sectionOne.listADocument)} style={styles.link}>View Document</Text>         
           </View>
          <View style={styles.gridItem100}>
           <Text style={{fontSize:16, fontWeight:'bold'}} variant='button'>DOCUMENT</Text>
           </View>
           <View style={styles.gridItem50}>
          <Text style={styles.sectionHeader}>Document Title</Text>
          <Text style={styles.sectionP}>{sectionTwo.listA.documentTitle}</Text>         
           </View>

           <View style={styles.gridItem50}>
          <Text style={styles.sectionHeader}>Issuing Authority</Text>
          <Text style={styles.sectionP}>{sectionTwo.listA.issuingAuthority}</Text>         
           </View>

           <View style={styles.gridItem50}>
          <Text style={styles.sectionHeader}>Document Number</Text>
          <Text style={styles.sectionP}>{sectionTwo.listA.documentNumber}</Text>         
           </View>

           <View style={styles.gridItem50}>
          <Text style={styles.sectionHeader}>Expiration Date</Text>
          <Text style={styles.sectionP}>{formatDate(sectionTwo.listA.expirationDate)}</Text>         
           </View>


            </View>

            <View style={{
                flexDirection: 'row',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                marginBottom: 5,
                display: sectionOne.listType === 'listA' ? 'none':'flex'
            }}>
            <View style={styles.gridItem30}>
          <Text style={styles.sectionHeader}>List Type</Text>
            <Text style={styles.sectionP}>{'List B/C'}</Text>
            </View>

            <View style={styles.gridItem30}>
          <Text style={styles.sectionHeader}>List B Document</Text>
          <Text onPress={()=>handleOpenModal(sectionOne.listBDocument)} style={styles.link}>View Document</Text>         
           </View>

           <View style={styles.gridItem30}>
          <Text style={styles.sectionHeader}>List C Document</Text>
          <Text onPress={()=>handleOpenModal(sectionOne.listCDocument)} style={styles.link}>View Document</Text>         
           </View>
           <View style={styles.gridItem100}>
           <Text style={{fontSize:16, fontWeight:'bold'}} variant='button'>List B Document</Text>
           </View>
           
           <View style={styles.gridItem50}>
          <Text style={styles.sectionHeader}>Document Title</Text>
          <Text style={styles.sectionP}>{sectionTwo.listB.documentTitle}</Text>         
           </View>

           <View style={styles.gridItem50}>
          <Text style={styles.sectionHeader}>Issuing Authority</Text>
          <Text style={styles.sectionP}>{sectionTwo.listB.issuingAuthority}</Text>         
           </View>

           <View style={styles.gridItem50}>
          <Text style={styles.sectionHeader}>Document Number</Text>
          <Text style={styles.sectionP}>{sectionTwo.listB.documentNumber}</Text>         
           </View>

           <View style={styles.gridItem50}>
          <Text style={styles.sectionHeader}>Expiration Date</Text>
          <Text style={styles.sectionP}>{formatDate(sectionTwo.listB.expirationDate)}</Text>         
           </View>

           <View style={styles.gridItem100}>
           <Text style={{fontSize:16, fontWeight:'bold'}} variant='button'>List C Document</Text>
           </View>
           
           <View style={styles.gridItem50}>
          <Text style={styles.sectionHeader}>Document Title</Text>
          <Text style={styles.sectionP}>{sectionTwo.listC.documentTitle}</Text>         
           </View>

           <View style={styles.gridItem50}>
          <Text style={styles.sectionHeader}>Issuing Authority</Text>
          <Text style={styles.sectionP}>{sectionTwo.listC.issuingAuthority}</Text>         
           </View>

           <View style={styles.gridItem50}>
          <Text style={styles.sectionHeader}>Document Number</Text>
          <Text style={styles.sectionP}>{sectionTwo.listC.documentNumber}</Text>         
           </View>

           <View style={styles.gridItem50}>
          <Text style={styles.sectionHeader}>Expiration Date</Text>
          <Text style={styles.sectionP}>{formatDate(sectionTwo.listC.expirationDate)}</Text>         
           </View>

           <View style={styles.gridItem100}>
          <Text style={styles.sectionHeader}>First Day of Employment (mm/dd/yyyy)</Text>
          <Text style={styles.sectionP}>{formatDate(sectionTwo.firstDayOfEmployment)}</Text>         
           </View>



            </View>

           
            {/* Render other relevant information */}
          </Card>
          <Card style={{padding:15, borderRadius:5, backgroundColor:'white', marginBottom:10}}>
          <Text variant='button' style={styles.sectionTitle}>Employer Information</Text>
            <Divider style={{marginVertical:10}}/>
          
            <View style={styles.gridContainer}>
            <View style={styles.gridItem100}>
          <Text style={styles.sectionHeader}>Last Name of Employer or Authorized Representitive</Text>
          <Text style={styles.sectionP}>{sectionTwo.employerLastName}</Text>         
           </View>

           <View style={styles.gridItem100}>
          <Text style={styles.sectionHeader}>First Name of Employer or Authorized Representitive</Text>
          <Text style={styles.sectionP}>{sectionTwo.employerFirstName}</Text>         
           </View>

           <View style={styles.gridItem100}>
          <Text style={styles.sectionHeader}>Title of Employer or Authorized Representitive</Text>
          <Text style={styles.sectionP}>{sectionTwo.employerTitle}</Text>         
           </View>

           <View style={styles.gridItem100}>
          <Text style={styles.sectionHeader}>Employer's Business or Organization Name</Text>
          <Text style={styles.sectionP}>{sectionTwo.employerBusinessName}</Text>         
           </View>

           <View style={styles.gridItem100}>
          <Text style={styles.sectionHeader}>Employer's Business or Organization Address</Text>
          <Text style={styles.sectionP}>{sectionTwo.employerAddress}</Text>         
           </View>

           <View style={styles.gridItem30}>
          <Text style={styles.sectionHeader}>City or Town</Text>
          <Text style={styles.sectionP}>{sectionTwo.employerCity}</Text>         
           </View>

           <View style={styles.gridItem30}>
          <Text style={styles.sectionHeader}>State</Text>
          <Text style={styles.sectionP}>{sectionTwo.employerState}</Text>         
           </View>

           <View style={styles.gridItem30}>
          <Text style={styles.sectionHeader}>ZIP Code</Text>
          <Text style={styles.sectionP}>{sectionTwo.employerZipCode}</Text>         
           </View>
          </View>



          </Card>
          <View style={styles.section}>
          <Text style={styles.sectionTitle}></Text>
          <Text style={styles.sectionHeader}></Text>
            <Text style={styles.sectionP}></Text>
         
        </View>


          {/* Add similar blocks for other sections and data */}

          {/* Modal for displaying images */}
          <Modal visible={imgModal} transparent={true} animationType="slide">
            <View style={styles.modalContainer}>
            {loadingImg && <ActivityIndicator size="large" color="#0000ff" />}
            <Image
            source={{ uri: img }} 
            style={styles.modalImage}
            onLoadEnd={onLoadEnd}
            />
            <Button onPress={handleCloseModal}>Close</Button>       
            </View>
          </Modal>
        </ScrollView>
      </View>
    );
  }
};

const styles = StyleSheet.create({
  container: {
    padding: 10,
  },
  section: {
    marginBottom: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  link:{
    textDecorationLine:'underline',
    textDecorationColor:'blue',
    color:'blue'
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    marginBottom: 5,
  },
  gridItem30: {
    width: '30%', // Adjust the width to leave some space for margins
    marginBottom: 5,
  },
  gridItem50: {
    width: '50%', // Adjust the width to leave some space for margins
    marginBottom: 5,
  },
  gridItem100: {
    width: '100%', // Adjust the width to leave some space for margins
    marginBottom: 5,
  },
  sectionHeader: {
    fontSize: 16,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  sectionP: {
    fontSize: 16,
 
    marginBottom: 10,
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
  modalImage: {
    width: '80%',
    height: 300,
    resizeMode: 'contain',
  },
});

export default SectionTwo;
