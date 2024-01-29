import React, { useEffect, useState } from 'react';
import { View, StyleSheet, Alert } from 'react-native';
import NavBar from '../../components/NavBar';
import SplashScreen from '../../components/SpalshScreen';
import { Button, Card, Divider, TextInput } from 'react-native-paper';
import { Text } from '@react-native-material/core';
import { ScrollView } from 'react-native-gesture-handler';
import axios from 'axios';
import { API } from '../../utils/controller';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { formatSSN } from '../../utils/GlobalFunctions';

const EverifySubmit = ({navigation, route}) => {
  const [loading, setLoading] = useState(true);
  const [userData, setUser] = useState(null);
  const [everifyData, setEverifyData] = useState({});
  const [caseData, setCaseData] = useState({ssn:''});

  const [clientId,setClientId] = useState(null)
  const [results, setResults] = useState([]);
  const [showResults, setShowResults] = useState(false);
  const [i9Data, setI9Data] = useState({})
useEffect(()=>{
    const fetchUserData = async () => {
      const storedToken = await AsyncStorage.getItem('token');
    
      try {
        console.log(route.params.a)
        console.log(route.params.b)
        
        const response = await axios.post(API + '/auth/refresh-user', { token: storedToken });
        const refreshedUser = response.data.user;
        console.log(refreshedUser)
         setUser({
          name:`${refreshedUser.firstName} ${refreshedUser.lastName}`,
          emailAddress: refreshedUser.email,
          phoneNumber: refreshedUser?.phone ? refreshedUser.phone : '1231234567'
         })
        const resp = await axios.post(API + '/i9/check-form', { id: route.params.a, i9Id: route.params.b });

        setClientId(refreshedUser.companyId);
        
        console.log(resp.data)

        if(resp.data.everify?.case_number){
          console.log('that')
          setCaseData(resp.data.everify)
        
          setShowResults(true)
        } else {
          console.log('this')
          setEverifyData({
            lastName:resp.data.sectionOne.lastName,
            firstName:resp.data.sectionOne.firstName,
            listType: resp.data.sectionOne.listType,
            listADocumentCode: resp.data.sectionOne.listADocumentCode,
            listBDocumentCode: resp.data.sectionOne.listBDocumentCode,
            listCDocumentCode: resp.data.sectionOne.listCDocumentCode,
            ssn: resp.data.sectionOne.socialSecurityNumber,
            citizenshipStatus:resp.data.sectionOne.citizenshipStatus

          })
          setI9Data(resp.data)
        }
        setLoading(false);
      } catch (error) {
        console.error('Error fetching user data:', error.message);
    
      }
    
    };
   fetchUserData()
     
},[] )
 
const handleSubmit = async ()=>{
  console.log(everifyData.listType === 'listA' ?'document_a_type_code' : 'document_b_type_code')
  const resp = await axios.post(API + '/everify/authentication/check-duplicates', 
  {
    ssn:everifyData.ssn, 
    clientId: clientId,
    docType: everifyData.listType === 'listA' ?'document_a_type_code' : 'document_b_type_code',
    document:everifyData.listType === 'listA' ? everifyData.listADocumentCode: everifyData.listBDocumentCode,
    citizenshipStatus:everifyData.citizenshipStatus === 'citizen' ? "US_CITIZEN" : everifyData.citizenshipStatus === 'noncitizenNational' ? 'NONCITIZEN' : everifyData.citizenshipStatus === 'lawfulPermanentResident' ? 'LAWFUL_PERMANENT_RESIDENT' : everifyData.citizenshipStatus === 'noncitizenAuthorizedToWork' ? 'NONCITIZEN_AUTHORIZED_TO_WORK' :''
  })
  // console.log(resp)
  if(resp.data){

    let filter = resp.data.filter((i)=>{
      return i.required === true
    })
   
    
    const transformedObject = filter.reduce((result, item) => {
      // Extract the field_name
      const { field_name } = item;
    
      // Add a new property to the result object with the field_name as the key and an empty value
      if(field_name.includes('client_software_version')){
        result[field_name] = "1";
      }
      else if(field_name.includes('last_name')){
        result[field_name] = everifyData.lastName;
      }
      else if(field_name.includes('first_name')){
        result[field_name] = everifyData.firstName;
      }

      else if(field_name.includes('ssn')){
        result[field_name] = formatSSN(everifyData.ssn);
      } 
      else if(field_name.includes('date_of_birth')){
        result[field_name] = i9Data.sectionOne.dateOfBirth.split('T')[0];
      } 
      else if(field_name.includes('date_of_hire')){
        result[field_name] = i9Data.sectionTwo.firstDayOfEmployment.split('T')[0];
      } 
      else if(field_name.includes('document_a_type_code')){
        result[field_name] = i9Data.sectionTwo.listA.documentCode;
      } 
      else if(field_name.includes('expiration_date')){
        result[field_name] = everifyData.listType === 'listA'?  i9Data.sectionTwo.listA.expirationDate.split('T')[0] : i9Data.sectionTwo.listB.expirationDate.split('T')[0];
      } 
      else if(field_name.includes('client_company_id')){
        result[field_name] = Number(clientId);
      } 
      else if(field_name.includes('us_passport_number')){
        result[field_name] = i9Data.sectionTwo.listA.documentNumber
      } 
      else if(field_name.includes('citizenship_status_code')){
        result[field_name] = everifyData.citizenshipStatus === 'citizen' ? "US_CITIZEN" : everifyData.citizenshipStatus === 'noncitizenNational' ? 'NONCITIZEN' : everifyData.citizenshipStatus === 'lawfulPermanentResident' ? 'LAWFUL_PERMANENT_RESIDENT' : everifyData.citizenshipStatus === 'noncitizenAuthorizedToWork' ? 'NONCITIZEN_AUTHORIZED_TO_WORK' :''
      } 
      else if(field_name.includes('case_creator_name')){
        result[field_name] = userData.name
      } 
      else if(field_name.includes('case_creator_phone_number')){
        result[field_name] = userData.phoneNumber
      } 
      else if(field_name.includes('case_creator_email_address')){
        result[field_name] = userData.emailAddress
      } 
      else {
        result[field_name] = '';
      }
      
    
      return result;
    }, {});

    console.log(transformedObject);
 
    setResults(transformedObject)
    setShowResults(true)

    const resp2 = await axios.post(API+'/everify/authentication/create-case', {caseObject: transformedObject, id:route.params.a, i9Id:route.params.b})
 
    if(resp2.success){
      Alert.alert("SAVED Case Created")
    } else{
      Alert.alert("Case not created")
    }
  } else {
    setResults(resp.data.results[0])
    
  }
}


if(loading){
    return <SplashScreen/>
} else {
     return (
      <View>
        <NavBar 
        onPressBack={()=>navigation.goBack()}
        Title="E-verify"
        />

        <ScrollView style={{padding:10}}>
        <Text style={{marginVertical:10, fontSize:18, fontWeight:'bold'}} variant='button'>Start E-verify</Text>
         <View>
          <Card style={{padding:10, borderRadius:5}}>
          <Text variant='button' style={styles.sectionTitle}>Employee Information</Text>
            <Divider style={{marginVertical:10}}/>
          <View style={styles.gridContainer}>
            <View style={styles.gridItem50}>
          <Text style={styles.sectionHeader}>Last Name</Text>
          <Text style={styles.sectionP}>{everifyData.lastName}</Text>         
           </View>

           <View style={styles.gridItem50}>
          <Text style={styles.sectionHeader}>First Name</Text>
          <Text style={styles.sectionP}>{everifyData.firstName}</Text>         
           </View>

           <View style={styles.gridItem100}>
          <Text style={styles.sectionHeader}>Social Security Number</Text>
          {/* <Text style={styles.sectionP}>{formatSSN(everifyData.ssn)}</Text>          */}
           </View>

           </View>
          </Card>
          <Button
          style={{marginVertical:10, borderRadius:5}} 
          onPress={()=>handleSubmit()}
          mode='contained'>Start E-Verify Case</Button>
          </View>

          <Card style={{display: showResults ? 'flex':'none', padding:10}}>
             {/* {results.map((i,index)=>{
              return (
                <View style={styles.gridItem100}>
            <Text style={{fontWeight:'bold', marginVertical:2}} variant='button'>{i.field_name}</Text>
            <TextInput
            mode="outlined"
          //  value={}
            // onChangeText={(text) => handleChangeListA('documentNumber', text)}
            />
            </View>
              )
             })} */}

             { Object.entries(caseData).map(([key, value], index) => {
              return (<Text>{key +': '+value}</Text>)
             })
            }
          </Card>
          </ScrollView>
      </View>
    );

}
   
  
};

export default EverifySubmit;

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