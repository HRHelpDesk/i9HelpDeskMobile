import React, { useEffect, useState, useRef } from 'react';
import { View, ScrollView, Modal, Image, StyleSheet, Alert } from 'react-native';
import { ActivityIndicator, Appbar, Button, Card, Checkbox, Divider, Menu, TextInput } from 'react-native-paper';
import { Titlebar } from '../../components/Titlebar';
import { SvgIconHolder } from '../../components/SvgIconHolder';
import Svg, { Path } from 'react-native-svg';
import { Text } from '@react-native-material/core';
import { formatDate } from '../../utils/GlobalFunctions';
import axios from 'axios';
import { API } from '../../utils/controller';
import { DateInput } from '../../components/DateInput';
import SignatureCapture from '../../components/SignatureCapture';

const SectionTwoForm = ({ route, navigation }) => {
  const [loading, setLoading] = useState(true);
  const [sectionOne, setSectionOne] = useState(null);
  const [sectionTwo, setSectionTwo] = useState(null);
  const [imgModal, setImgModal] = useState(false);
  const [scrollEnabled, setScrollEnabled] = useState(true);
  const [sending, setSending] = useState(false);
  const [img, setImg] = useState('');
  const [loadingImg, setLoadingImg] = useState(true);
 const date = new Date();
  const [formData, setFormData] = useState({
    listA:{
    documentTitle: '',
    issuingAuthority: '',
    documentNumber: '',
    expirationDate: date,

    },
    listB: {
    documentTitle: '',
    issuingAuthority: '',
    documentNumber: '',
    expirationDate: date,

    },
    listC:{
    documentTitle: '',
    issuingAuthority: '',
    documentNumber: '',
    expirationDate: date,

    },
    alternativeProcedure: false,
    firstDayOfEmployment: date,
    additionalInformation:'',
    employerLastName: '',
    employerFirstName: '',
    employerTitle: '',
    employerSignature: '',
    todayDate: '',
    employerBusinessName: '',
    employerAddress: '',
    employerCity: '',
    employerState: '',
    employerZipCode: '',
    supplementB:[],
    submitted: true
  });
  const employerAddressArr =
  [ 
    {
      value: formData.employerBusinessName,
    name:"Employer's Business or Organization Name",
   change:'employerBusinessName'
  }, 
    {
      value: formData.employerAddress,
      name:"Employer's Business or Organization Address",
     change:'employerAddress'
    }, 
    {
      value: formData.employerCity,
      name:"City or Town",
     change:'employerCity'
    }, 
    {
      value: formData.employerState,
      name:"State",
     change:'employerState'
    }, 
    {
      value: formData.employerZipCode,
      name:"ZIP Code",
     change:'employerZipCode'
    }
  ]

  const scrollViewRef = useRef();
  const [modalVisible, setModalVisible] = useState(false);

  const showModal = () => {
    
      setModalVisible(true);

     

      setTimeout(()=>{   scrollToBottom(scrollViewRef)},100)
      setTimeout(()=>{  setScrollEnabled(false)},1000)
    
    };
  
    const hideModal = () => {
      setModalVisible(false);
    };


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
        console.log(route.params.id)
    const resp = await axios.post(API + '/i9/check-form', { id: route.params.id, i9Id: route.params.i9Id });
        
        console.log(resp.data.sectionOne)
        if (resp.data.notFound) {
          // Handle error or redirect
          return;
        }

        setSectionOne(resp.data.sectionOne);
        setSectionTwo(resp.data.sectionTwo);
        setLoading(false);
      
    };

    fetchData();
  }, []);

  const handleOpenModal = (image) => {
    setImg(image);
    setImgModal(true);
  };

  const handleCloseModal = () => {
    setImg('');
    setImgModal(false);
  };

  const handleChangeListA = (property, text) => {
    setFormData((prevData) => ({
      ...prevData,
      listA: {
        ...prevData.listA,
        [property]: text,
      },
    }));
  };

  const handleChangeListB = (property, text) => {
    setFormData((prevData) => ({
      ...prevData,
      listB: {
        ...prevData.listB,
        [property]: text,
      },
    }));
  };

  const handleChangeListC = (property, text) => {
    setFormData((prevData) => ({
      ...prevData,
      listC: {
        ...prevData.listC,
        [property]: text,
      },
    }));
  };

  const handleCheckboxChange = () => {
    setFormData((prevData) => ({ ...prevData, alternativeProcedure: !prevData.alternativeProcedure }));
  };

  const handleChange = (name, value) => {
    setFormData((prevData) => ({ ...prevData, [name]: value }));

    console.log(formData)
  };

  const isStepOneValid = () => {
    if(sectionOne.listType === 'listA'){
      
    const requiredFields = ['documentTitle', 'issuingAuthority', 'documentNumber', 'expirationDate'];
    return requiredFields.every(field => !!formData.listA[field]);

  } else {
    const requiredFields = ['documentTitle', 'issuingAuthority', 'documentNumber', 'expirationDate'];
    return requiredFields.every(field => !!formData.listB[field]) && requiredFields.every(field => !!formData.listC[field]);

  }
  };

  const isStepTwoValid = () => {
    const requiredFields = ['firstDayOfEmployment', 'employerLastName', 'employerFirstName', 'employerTitle', 'employerBusinessName', 'employerAddress', 'employerCity', 'employerState', 'employerZipCode', 'todayDate', 'employerSignature'];
   let newFilter = [];
   let filter = requiredFields.filter(o=> formData[o] === '');
   console.log(filter)
    return requiredFields.every(field => !!formData[field]);
  };

  const handleSubmit = async ()=>{
    setSending(true)
    if(isStepOneValid() && isStepTwoValid){
      let resp = await axios.post(API + '/i9/save-section-2', {id: route.params.id, i9Id:route.params.i9Id, formData:formData})
      if(resp.data.success){
        Alert.alert('The information has been saved to the I-9.')
        setSending(true)

        navigation.goBack();
      } else {
        setSending(true)

        Alert.alert('Something went wrong. Please try again.')
      }

    } else {
      Alert.alert('Make sure you have filled out all the information.')
    }

    console.log(formData)
  }


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

        <ScrollView ref={scrollViewRef} scrollEnabled={scrollEnabled} style={styles.container}>
            <View style={{marginHorizontal:10, marginBottom:10}}>
        <Text><Text style={{fontWeight:'bold'}}>Section 2.</Text> Employer Review and Verification: Employers or their authorized representative must complete and sign Section 2 within three business days after the employee's first day of employment, and must physically examine, or examine consistent with an alternative procedure authorized by the Secretary of DHS, documentation from List A OR a combination of documentation from List B and List C. Enter any additional documentation in the Additional Information box; see Instructions.</Text>
        </View>
          {/* Render section two data using Card, Text, etc. components */}
        <Card style={{padding:15, borderRadius:5, backgroundColor:'white', marginBottom:10}}>
        <Text variant='button' style={styles.sectionTitle}>Employer Review</Text>
            <Divider style={{marginVertical:10}}/>
          
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
           <Text style={{fontSize:16, fontWeight:'bold'}} variant='button'>DOCUMENT Information</Text>
           </View>
          
         
            <View style={styles.gridItem100}>
            <Text style={{fontWeight:'bold', marginVertical:2}} variant='button'>Document Title *</Text>
            <TextInput
            name="listA"
            id="documentTitle"
            mode="outlined"
            value={formData.listA.documentTitle}
            onChangeText={(text) => handleChangeListA('documentTitle', text)}

            />
            </View>

            <View style={styles.gridItem100}>
            <Text style={{fontWeight:'bold', marginVertical:2}} variant='button'>Issuing Authority *</Text>
            <TextInput
            mode="outlined"
            value={formData.listA.issuingAuthority}
            onChangeText={(text) => handleChangeListA('issuingAuthority', text)}
            />
            </View>

            <View style={styles.gridItem100}>
            <Text style={{fontWeight:'bold', marginVertical:2}} variant='button'>Document Number *</Text>
            <TextInput
            mode="outlined"
            value={formData.listA.documentNumber}
            onChangeText={(text) => handleChangeListA('documentNumber', text)}
            />
            </View>

            <View style={styles.gridItem100}>
            <Text style={{fontWeight:'bold', marginVertical:2}} variant='button'>Expiration Date *</Text>
            <DateInput
            value={formatDate(formData.listA.expirationDate)}
            date={formData.listA.expirationDate}
            onConfirm={(date) => handleChangeListA('expirationDate', date)}

              />
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
           
           <View style={styles.gridItem100}>
            <Text style={{fontWeight:'bold', marginVertical:2}} variant='button'>Document Title *</Text>
            <TextInput
           
            mode="outlined"
            value={formData.listB.documentTitle}
            onChangeText={(text) => handleChangeListB('documentTitle', text)}
            />
            </View>

            <View style={styles.gridItem100}>
            <Text style={{fontWeight:'bold', marginVertical:2}} variant='button'>Issuing Authority *</Text>
            <TextInput
            mode="outlined"
            value={formData.listB.issuingAuthority}
            onChangeText={(text) => handleChangeListB('issuingAuthority', text)}
            />
            </View>

            <View style={styles.gridItem100}>
            <Text style={{fontWeight:'bold', marginVertical:2}} variant='button'>Document Number *</Text>
            <TextInput
            mode="outlined"
            value={formData.listB.documentNumber}
            onChangeText={(text) => handleChangeListB('documentNumber', text)}
            />
            </View>

            <View style={styles.gridItem100}>
            <Text style={{fontWeight:'bold', marginVertical:2}} variant='button'>Expiration Date *</Text>
            <DateInput
            value={formatDate(formData.listB.expirationDate)}
            date={formData.listB.expirationDate}
            onConfirm={(date) => handleChangeListB('expirationDate', date)}

              />
              </View>

           <View style={styles.gridItem100}>
           <Text style={{fontSize:16, fontWeight:'bold'}} variant='button'>List C Document</Text>
           </View>
           
           <View style={styles.gridItem100}>
            <Text style={{fontWeight:'bold', marginVertical:2}} variant='button'>Document Title *</Text>
            <TextInput
            mode="outlined"
            value={formData.listC.documentTitle}
            onChangeText={(text) => handleChangeListC('documentTitle', text)}            
            />
            </View>

            <View style={styles.gridItem100}>
            <Text style={{fontWeight:'bold', marginVertical:2}} variant='button'>Issuing Authority *</Text>
            <TextInput
            mode="outlined"
            value={formData.listC.issuingAuthority}
            onChangeText={(text) => handleChangeListC('issuingAuthority', text)}           
             />

            </View>

            <View style={styles.gridItem100}>
            <Text style={{fontWeight:'bold', marginVertical:2}} variant='button'>Document Number *</Text>
            <TextInput
            mode="outlined"
            value={formData.listC.documentNumber}
            onChangeText={(text) => handleChangeListC('documentNumber', text)}           
            />
            </View>

            <View style={styles.gridItem100}>
            <Text style={{fontWeight:'bold', marginVertical:2}} variant='button'>Expiration Date *</Text>
            <DateInput
            value={formatDate(formData.listC.expirationDate)}
            date={formData.listC.expirationDate}
            onConfirm={(date) => {
              handleChangeListC('expirationDate', date)
       
              }}
              />
              </View>



            </View>
            <View style={{marginVertical:5}}>
            <Text style={{fontWeight:'bold', marginVertical:2}}  variant='button'>Additional Information</Text>
      <TextInput
          multiline
          mode="outlined"
          numberOfLines={4}

          value={formData.additionalInformation}
          onChangeText={(text) => handleChange('additionalInformation', text)}
          style={{ marginBottom: 2, width: '100%', height:150 }}
        />
        </View>


        <Checkbox.Item
        style={{borderColor:formData.alternativeProcedure ?'#102372':'grey', borderRadius:5, borderStyle:'solid', borderWidth:2 ,marginVertical:2}}
        label="Press here if you used an alternative procedure authorized by DHS to examine documents."
        status={formData.alternativeProcedure ? 'checked' : 'unchecked'}
        onPress={handleCheckboxChange}
      />


            {/* Render other relevant information */}
          </Card>
          <Card style={{padding:15, borderRadius:5, backgroundColor:'white', marginBottom:10}}>
          <Text variant='button' style={styles.sectionTitle}>Verification</Text>
            <Divider style={{marginVertical:10}}/>
          
            <View>
            <Text variant='button'>First Day of Employment (mm/dd/yyyy)</Text>
            <DateInput
            value={formatDate(formData.firstDayOfEmployment)}
            date={formData.firstDayOfEmployment}
            onConfirm={(date) => {
              handleChange('firstDayOfEmployment', date)
            
            }}
            />
   
          </View>
          <Divider style={{marginVertical:10}}/>
          <View style={[styles.gridItem100, {marginVertical:10}]}>
           <Text style={{fontSize:16, fontWeight:'bold'}} variant='button'>EMPLOYER INFORMATION</Text>
           </View>
           <Divider style={{marginVertical:10}}/>
     
           <View style={styles.gridItem100}>
            <Text style={{fontWeight:'bold', marginVertical:2}} variant='button'>Last Name of Employer or Authorized Representitive</Text>
            <TextInput
            mode="outlined"
            value={formData.listB.employerLastName}
            onChangeText={(text) => handleChange('employerLastName', text)}
            />
            </View>

            <View style={styles.gridItem100}>
            <Text style={{fontWeight:'bold', marginVertical:2}} variant='button'>First Name of Employer or Authorized Representitive</Text>
            <TextInput
            mode="outlined"
            value={formData.listB.employerFirstName}
            onChangeText={(text) => handleChange('employerFirstName', text)}
            />
            </View>

            <View style={styles.gridItem100}>
            <Text style={{fontWeight:'bold', marginVertical:2}} variant='button'>Title of Employer or Authorized Representitive</Text>
            <TextInput
            mode="outlined"
            value={formData.listB.employerTitle}
            onChangeText={(text) => handleChange('employerTitle', text)}
            />
            </View>
            <Divider style={{marginVertical:5}}/>
            <View style={[styles.gridItem100, {marginVertical:10}]}>
           <Text style={{fontSize:16, fontWeight:'bold'}} variant='button'>EMPLOYER ADDRESS</Text>
           </View>
           <Divider style={{marginVertical:5}}/>

           {
            employerAddressArr.map(o=>{
              return (
                <View style={styles.gridItem100}>
                <Text style={{fontWeight:'bold', marginVertical:2}} variant='button'>{o.name}</Text>
                <TextInput
                mode="outlined"
                value={o.value}
                onChangeText={(text) => handleChange(`${o.change}`, text)}
                />
                </View>
              )
            })
           }

          <Divider style={{marginVertical:5}}/>
          <View style={[styles.gridItem100, {marginVertical:10}]}>
           <Text style={{fontSize:16, fontWeight:'bold'}} variant='button'>EMPLOYER SIGNATURE</Text>
           </View>
           <Divider style={{marginVertical:5}}/>
           <Text><Text style={{fontWeight:'bold'}}>Certification:</Text> I attest, under penalty of perjury, that (1) I have examined the documentation presented by the above-named
            employee, (2) the above-listed documentation appears to be genuine and to relate to the employee named, and (3) to the
            best of my knowledge, the employee is authorized to work in the United States.</Text>
           <SignatureCapture 
            signatureVar={'employerSignature'}
            setModalVisible={setModalVisible}
            Data={formData}
            setData={setFormData}
            setScroll={setScrollEnabled}
            />


          </Card>
          <Button onPress={handleSubmit} style={{borderRadius:5}} mode='contained'><Text variant='button' color='white' style={{fontWeight:'bold'}}>Submit <ActivityIndicator style={{display:sending ?'flex':'none'}} color='white'/></Text></Button>
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

export default SectionTwoForm;
