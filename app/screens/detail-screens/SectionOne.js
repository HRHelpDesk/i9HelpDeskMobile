import React, { useCallback, useEffect, useState } from 'react';
import { View, ScrollView, Modal, StyleSheet, Image } from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import axios from 'axios';
import { API } from '../../utils/controller';
import { Appbar, IconButton, Menu, Button, PaperProvider,Divider, Card, ActivityIndicator, Icon } from 'react-native-paper';
import { Text } from '@react-native-material/core';
import { formatDate } from '../../utils/GlobalFunctions';
import { Titlebar } from '../../components/Titlebar';
import Svg, { Path } from 'react-native-svg';
import { SvgIconHolder } from '../../components/SvgIconHolder';
import { useFocusEffect } from '@react-navigation/native';


const SectionOne = ({ route, navigation }) => {
  const [data, setData] = useState(null);
  const [sectionTwo, setSectionTwo] = useState(null);
  const [imgModal, setImgModal] = useState(false);
  const [img, setImg] = useState('');
  const [loading, setLoading] = useState(true);
  const [additionalInfoType, setAdditionalInfoType] = useState('');
  const { a, b } = route.params;
  const [citizenshipStatus, setCitizenshipStatus] = useState('');
  const [showSSN, setShowSSN] = useState(false);
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

  const [loadingImg, setLoadingImg] = useState(true);

  const onLoadEnd = () => {
    setLoadingImg(false);
  };

  useFocusEffect(
    useCallback(() => {
    
      const checkData = async () => {
        try {
          const resp = await axios.post(API + '/i9/check-form', { id: a, i9Id: b });
          
          console.log(resp.data.sectionOne)
          if (resp.data.notFound) {
            // Handle error or redirect
            return;
          }
  
          setData({ sectionOne: resp.data.sectionOne });
          setSectionTwo(resp.data.sectionTwo);
          if(resp.data.sectionOne.additionalInfoType === 'uscisANumber'){
              setAdditionalInfoType('USCIS A-Number')
           
            }
    
            if(resp.data.sectionOne.additionalInfoType === 'i94AdmissionNumber'){
              setAdditionalInfoType('Form I-94 Admission Number')
           
            }
    
            if(resp.data.sectionOne.additionalInfoType === 'foreignPassport'){
              setAdditionalInfoType('Foreign Passport Number and Country of Issuance')
           
            }
    
    
            if(resp.data.sectionOne.citizenshipStatus === 'citizen'){
              setCitizenshipStatus('A citizen of the United States')
              setLoading(false)
            }
    
            if(resp.data.sectionOne.citizenshipStatus === 'noncitizenNational'){
              setCitizenshipStatus('A noncitizen national of the United States')
              setLoading(false)
            }
    
            if(resp.data.sectionOne.citizenshipStatus === 'lawfulPermanentResident'){
              setCitizenshipStatus('A lawful permanent resident (Enter USCIS or A-Number.)')
              setLoading(false)
            }
    
            if(resp.data.sectionOne.citizenshipStatus === 'noncitizenAuthorizedToWork'){
              setCitizenshipStatus('A noncitizen (other than Item Numbers 2. and 3. above) authorized to work until (exp. date, if any)')
              setLoading(false)
            }
  
          // Add similar blocks for other citizenshipStatus values
        } catch (error) {
          console.error('Error fetching data:', error.message);
        }
      };
  
      checkData();
    }, [a, b])
  )

  const handleOpenModal = (image) => {
    setImg(image);
    setImgModal(true);
  };

  const handleCloseModal = () => {
    setImg('');
    setImgModal(false);
  };

  const handleToggleSSN = () => {
    setShowSSN(!showSSN);
  };

  const [qmVisible, setQmVisible] = useState(false);

  const openQmMenu = () => setQmVisible(true);
  const closeQmMenu = () => setQmVisible(false);


  if (loading) {
    return <Text>Loading...</Text>;
  } else {
    
  return (
    <PaperProvider>
    <View style={{height:'100%'}}>
    
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
          Section One
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

<View>

<View style={{display: sectionTwo?.submitted ? 'none' : 'flex', paddingHorizontal:10}}>
<Button onPress={()=>navigation.navigate('section-two-form',{id:a, i9Id: b})} style={{display: sectionTwo?.submitted ? 'none' : 'flex', marginVertical:15, backgroundColor:'#102372', width:'100%', borderRadius:5}} mode='contained'><Text variant='button' style={{color:'white', fontWeight:'bold'}}>Start Section Two</Text></Button>
</View>
<View style={{ alignItems: 'flex-end' }}>
<Menu
style={{display: sectionTwo?.submitted ? 'flex' : 'none',}}
              visible={qmVisible}
              onDismiss={closeQmMenu}
              anchor={
                <Button
                mode='contained'
                onPress={openQmMenu}
                style={{display: sectionTwo?.submitted ? 'flex' : 'none', marginTop:10,  marginBottom: 10, borderRadius:5, backgroundColor:'#102372', marginRight:10 }}
                textColor='white'
              >
          View Documents
              </Button>
           }
            >
              <Menu.Item onPress={() => { closeQmMenu(); navigation.navigate('section-two', { a: a, b: b, sectionTwo: sectionTwo, sectionOne: data.sectionOne });}} title="Section Two" />
             <Divider/>
              <Menu.Item style={{display: data.sectionOne.supplementA[0].lastName === '' ? 'none' :'flex'}} title="Supplement A" />
              <Divider/>
              <Menu.Item onPress={() => { closeQmMenu(); navigation.navigate('supplement-b', { a: a, b: b, sectionTwo: sectionTwo, sectionOne: data.sectionOne })}} title="Supplement B" />
            </Menu>
            </View>
<ScrollView>
      <View style={styles.container}>
        <Card style={{padding:15, borderRadius:5, backgroundColor:'white', marginBottom:10}}>
      <View style={styles.section}>
  <Text variant='button' style={styles.sectionTitle}>Personal Information</Text>
  <Divider style={{marginVertical:10}}/>

  <View style={styles.gridContainer}>

  <View style={styles.gridItem30}>
  <Text style={styles.sectionHeader}>Last Name *</Text>
  <Text style={styles.sectionP}>{data.sectionOne.lastName}</Text>
  </View>

  <View style={styles.gridItem30}>
  <Text style={styles.sectionHeader}>First Name *</Text>
  <Text style={styles.sectionP}>{data.sectionOne.firstName}</Text>
</View>
<View style={styles.gridItem30}>
  <Text style={styles.sectionHeader}>Middle Initial</Text>
  <Text style={styles.sectionP}>{data.sectionOne.middleInitial}</Text>
  </View>
  </View>

  
  <View >
  <Text style={styles.sectionHeader}>Other Names Used</Text>
  <Text style={styles.sectionP}>{data.sectionOne.otherLastNames === '' ? 'NA' : data.sectionOne.otherLastNames}</Text>
  </View> 
  <View style={styles.gridContainer}>
  <View style={styles.gridItem50}>
  <Text style={styles.sectionHeader}>Date of Birth *</Text>
  <Text style={styles.sectionP}>{data.sectionOne.dateOfBirth}</Text>
  </View>

  <View style={styles.gridItem50}>
  <Text style={styles.sectionHeader}>SSN *</Text>
  <View style={{flexDirection:'row'}}>
 <Text style={{color:'green'}} onPress={() => setShowSSN(!showSSN)}>
  <Icon
    source="eye"
    color='#102372'
   style={{padding:0, color:'green'}}
    size={20}
 
  /></Text> 
   <Text style={[styles.sectionP,{display:showSSN ? 'flex':'none'}]}>{' '}{data.sectionOne.socialSecurityNumber}</Text></View>
</View>
<View style={styles.gridItem50}>
  <Text style={styles.sectionHeader}>Email Address</Text>
  <Text style={styles.sectionP}>{data.sectionOne.emailAddress === '' ? 'NA' : data.sectionOne.emailAddress}</Text>
  </View>

  <View style={styles.gridItem50}>
  <Text style={styles.sectionHeader}>Phone Number</Text>
  <Text style={styles.sectionP}>{data.sectionOne.telephoneNumber === '' ? 'NA' : data.sectionOne.telephoneNumber}</Text>
  </View>
  </View>
  {/* Add similar JSX components for other fields in Personal Information */}
</View>
</Card>



<Card style={{padding:15, borderRadius:5, backgroundColor:'white', marginBottom:10}}>
        <View style={styles.section}>
          <Text variant='button' style={styles.sectionTitle}>Address</Text>
          <Divider style={{marginVertical:10}}/>
         <View style={styles.gridContainer}>

          <View style={styles.gridItem50}>
          <Text style={styles.sectionHeader}>Street Address *</Text>
            <Text style={styles.sectionP}>{data.sectionOne.address}</Text>
            </View>

            <View style={styles.gridItem50}>
            <Text style={styles.sectionHeader}>Apt. Number</Text>
            <Text style={styles.sectionP}>{data.sectionOne.aptNumber}</Text>
            </View>

            <View style={styles.gridItem30}>
            <Text style={styles.sectionHeader}>City *</Text>
            <Text style={styles.sectionP}>{data.sectionOne.city}</Text>
            </View>

            <View style={styles.gridItem30}>
            <Text style={styles.sectionHeader}>State *</Text>
            <Text style={styles.sectionP}>{data.sectionOne.state}</Text>
            </View>
            <View style={styles.gridItem30}>
            <Text style={styles.sectionHeader}>Zip Code *</Text>
            <Text style={styles.sectionP}>{data.sectionOne.zipCode}</Text>
            </View>
            <View style={styles.gridItem30}>
            </View>
           
            </View>
        </View>
</Card>

<Card style={{padding:15, borderRadius:5, backgroundColor:'white', marginBottom:10}}>

        <View style={styles.section}>
          <Text variant='button' style={styles.sectionTitle}>Citizenship Status</Text>
          <Divider style={{marginVertical:10}}/>

          <Text style={styles.sectionHeader}>Check one of the following boxes to attest to your citizenship or immigration status (See page 2 and 3 of the instructions.): *</Text>
            <Text style={styles.sectionP}>{citizenshipStatus}</Text>
    
        </View>
       </Card>     
        <Card style={{padding:15, borderRadius:5, backgroundColor:'white', marginBottom:10}}>

        <View style={styles.section}>
        <Text variant='button' style={styles.sectionTitle}>List Type and Documents</Text>
        <Divider style={{marginVertical:10}}/>

        <View style={styles.gridContainer}>
        <View style={styles.gridItem50}>
          <Text style={styles.sectionHeader}>List Type *</Text>
            <Text style={styles.sectionP}>{data.sectionOne.listType === 'listA' ? 'List A': 'List B/C'}</Text>
            </View>
            <View style={styles.gridItem50}>
            <View style={{display: data.sectionOne.listType === 'listA' ? 'flex' : 'none'}}>
            <Text style={styles.sectionHeader}>List A Document</Text>
            <Text onPress={()=>handleOpenModal(data.sectionOne.listADocument)} style={styles.link}>View Document</Text>
             </View>
             </View>

             <View style={styles.gridItem50}>
             <View style={{display: data.sectionOne.listType === 'listA' ? 'none' : 'flex'}}>
             <Text style={styles.sectionHeader}>List B Document</Text>
              <Text onPress={()=>handleOpenModal(data.sectionOne.listBDocument)} style={styles.link}>View Document</Text>
             </View>
             </View>
             
             <View style={styles.gridItem50}>
             <View style={{display: data.sectionOne.listType === 'listA' ? 'none' : 'flex'}}>
             <Text style={styles.sectionHeader}>List C Document</Text>
             <Text onPress={()=>handleOpenModal(data.sectionOne.listCDocument)} style={styles.link}>View Document</Text>
             </View>
             </View>
             </View>

        </View>
        </Card>
       
        <Card style={{padding:15, borderRadius:5, backgroundColor:'white', marginBottom:10}}>

        <View style={styles.section}>
          <Text variant='button' style={styles.sectionTitle}>Signature</Text>
          <Divider style={{marginVertical:10}}/>
          <Text style={styles.sectionHeader}>Zip Code *</Text>
          <Image source={{ uri: data.sectionOne.signature }} style={{width:300, height:50}} />

          <Text style={styles.sectionHeader}>Signature Date</Text>
            <Text style={styles.sectionP}>{formatDate(data.sectionOne.signatureDate)}</Text>
        </View>
        </Card>

    
        <Card style={{padding:15, borderRadius:5, backgroundColor:'white', marginBottom:10}}>

        <View style={styles.section}>
          <Text variant='button' style={styles.sectionTitle}>Preparer or Translator</Text>
          <Divider style={{marginVertical:10}}/>

          <Text style={styles.sectionHeader}>Did you use a preparer or translator?</Text>
            <Text style={styles.sectionP}>{data.sectionOne.usedPreparer}</Text>
         
        </View>
        </Card>

        <View style={styles.section}>
          <Text style={styles.sectionTitle}></Text>
          <Text style={styles.sectionHeader}></Text>
            <Text style={styles.sectionP}></Text>
         
        </View>
        
      </View>

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
      <View style={{paddingBottom:100}}></View>
    </ScrollView>
    </View>
    </View> 
    </PaperProvider>

  );
};

}


const styles = StyleSheet.create({
  container: {
    paddingHorizontal: 10,
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
    backgroundColor:'white'
  },
  modalImage: {
    width: '80%',
    height: 300,
    resizeMode: 'contain',
  },
});

export default SectionOne;
