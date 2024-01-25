import { Text } from '@react-native-material/core';
import React, { useState, useRef } from 'react';
import { View, StyleSheet, ScrollView, Alert,  } from 'react-native';
import { TextInput, Button, RadioButton, Checkbox, Card, Divider, } from 'react-native-paper';
import UploadFile from './UploadFile';
import SignatureCapture from './SignatureCapture';
import { formatDate } from '../utils/GlobalFunctions';
import axios from 'axios';
import { API } from '../utils/controller';
import uuid from 'react-native-uuid';
import { DateInput } from './DateInput';

export const SupplementBForm = ({id, i9id, close}) => {
    const [modalVisible, setModalVisible] = useState(false);
    const [scrollEnabled, setScrollEnabled] = useState(true);
    const [date, setDate] = useState(new Date())
  const [open, setOpen] = useState(false)
  const [openExp, setOpenExp] = useState(false)

    const scrollViewRef = useRef();

    const showModal = () => {
      
        setModalVisible(true);

       

        setTimeout(()=>{   scrollToBottom(scrollViewRef)},100)
        setTimeout(()=>{  setScrollEnabled(false)},1000)
      
      };
    
      const hideModal = () => {
        setModalVisible(false);
      };

      const scrollToBottom = () => {
        if (scrollViewRef.current) {
          scrollViewRef.current.scrollToEnd({ animated: true });
        }
      };
      const saveFormData = async (formData ) => {
        try {
          
          // Make a POST request to the server route '/save-form'
          const response = await axios.post(API +'/i9/save-sup-b', {
            id: id, 
            i9Id: i9id,
            formData: formData,
          });
      
          // Check the response and handle accordingly
          if (response.data.success) {
            // Form data saved successfully
            console.log('Form data saved successfully!');
            console.log(response.data)
            Alert.alert('Worked')
            close();
            // You can navigate to another page or perform additional actions here
          } else if (response.data.notFound) {
            // Form not found
            console.log('Form not found');
          } else if (response.data.sectionOneNotFound) {
            // sectionOne not found
           
          } else {
            // Handle other errors
            console.error('An error occurred:', response.data.error);
          }
        } catch (error) {
          // Handle network or other errors
          console.error('An error occurred:', error.message);
        }
      };

      const handleSubmit = ()=>{
        
        if(newSupplementB.signature === ''|| newSupplementB.document === null || newSupplementB.lastName === '' || newSupplementB.firstName === '' || newSupplementB.documentTitle === '' || newSupplementB.documentNumber === '' || newSupplementB.expirationDate === '' || newSupplementB.employerFirstName === '' || newSupplementB.employerFirstName === '' || newSupplementB.employerLastName === '' ){
       Alert.alert('Please make sure you have completed the form before submitting.')   
       
      } else {
        uploadFile(newSupplementB.document, `${id}/${i9id}/supplement-b/${newSupplementB.id}`)

      }
        console.log(id +` `+i9id)
      }

      async function uploadFile(a, folderText) {
   
        const file = a[0];
        const folder = folderText;
      
        if (!file || !folder) {
          Alert.alert('Please select a file and enter a folder name.');
          return;
        }
      
        const fileFormData = new FormData();
        fileFormData.append('file', {
            uri: file.uri,
            name: file.fileName, // You might need to adjust the file name
            type: file.type, 
           // You might need to adjust the file type
          });
          fileFormData.append('folder', folder);

        
      
        try {
          const response = await axios.post(API+'/file/upload', fileFormData, {
            headers: {
              'Content-Type': 'multipart/form-data', // Important for file uploads
            },
          });
      
          // Ensure the response is successful (status code 2xx)
          if (response.data.ok) {
            // Extract the shared link directly as a string
            const sharedLink = await response.data.sharedLink;
      console.log(sharedLink)
            let modifiedLink = sharedLink.replace("www.dropbox.com", "dl.dropboxusercontent.com");
      

                const updatedData = {
                  ...newSupplementB,
                  document: modifiedLink,
                };
              
                // Use updatedData for any immediate operations
              
                // For example, you can log it here
                console.log(updatedData);
                saveFormData(updatedData)
        setNewSupplementB(updatedData)
            
    
                  
          } else {
            // Handle non-successful response (status code other than 2xx)
            console.error('Error uploading file:', response.statusText);
            Alert.alert('Error uploading file. Please try again.');
            return false
          }
        } catch (error) {
          console.error('Error uploading file:', error);
          Alert.alert('Error uploading file. Please try again.');
          return false
        }
      }



  const [newSupplementB, setNewSupplementB] = useState({
    id: uuid.v4(),
    dateOfRehire: date,
    lastName: '',
    firstName: '',
    middleInitial: '',
    listType: 'listA',
    documentTitle: '',
    documentNumber: '',
    expirationDate: date,
    signature: '',
    signatureDate: date,
    employerLastName: '',
    employerFirstName: '',
    additionalInformation: '',
    alternativeProcedure: false,
    document: null,
  });

  const handleChange = (name, value) => {
    setNewSupplementB((prevData) => ({ ...prevData, [name]: value }));

    console.log(newSupplementB)
  };

  const handleCheckboxChange = () => {
    setNewSupplementB((prevData) => ({ ...prevData, alternativeProcedure: !prevData.alternativeProcedure }));
  };

  

  return (
    <ScrollView ref={scrollViewRef} scrollEnabled={scrollEnabled} style={styles.container}>
      {/* Your form inputs go here */}
      <Card style={{padding:15, borderRadius:5, backgroundColor:'white', marginBottom:10}}>
      <Text variant='button' style={[styles.sectionTitle,{fontSize:18}]}>Supplement B Form</Text>
            <Divider style={{marginVertical:10}}/>
      <Text><Text style={{fontWeight:'bold'}}>Instructions:</Text> This supplement replaces Section 3 on the previous version of Form I-9. Only use this page if your employee requires reverification, is rehired within three years of the date the original Form I-9 was completed, or provides proof of a legal name change. Enter the employee's name in the fields above. Use a new section for each reverification or rehire. Review the Form I-9 instructions before completing this page. Keep this page as part of the employee's Form I-9 record. Additional guidance can be found in the Handbook for Employers: Guidance for Completing Form I-9 (M-274)</Text>
      </Card>
      
      <Card style={{padding:15, borderRadius:5, backgroundColor:'white', marginBottom:10}}>
      <Text variant='button' style={styles.sectionTitle}>Employee Information</Text>
            <Divider style={{marginVertical:10}}/>
      <View>
        <View>
            <Text variant='button'>Date of Rehire</Text>
            <DateInput
      value={formatDate(newSupplementB.dateOfRehire)}
      date={newSupplementB.dateOfRehire}
      onConfirm={(date) => {
        handleChange('dateOfRehire', date)
       
      }}
      />
   
</View>
<View style={{marginVertical:5}}>
            <Text variant='button'>Last Name</Text>
      <TextInput
       
        mode="outlined"
        value={newSupplementB.lastName}
        onChangeText={(text) => handleChange('lastName', text)}
      />
</View>

<View style={{marginVertical:5}}>
            <Text variant='button'>First Name</Text>
<TextInput
   
        mode="outlined"
        value={newSupplementB.firstName}
        onChangeText={(text) => handleChange('firstName', text)}
      />
</View>

<View style={{marginVertical:5}}>
            <Text variant='button'>Middle Initial</Text>
<TextInput
      
        mode="outlined"
        value={newSupplementB.middleInitial}
        onChangeText={(text) => handleChange('middleInitial', text)}
      />
      </View>
      </View>
      </Card>

      {/* ... other form inputs ... */}

      {/* Example of radio button group */}
      <Card style={{padding:15, borderRadius:5, backgroundColor:'white', marginBottom:10}}>
      <Text variant='button' style={styles.sectionTitle}>Document Information</Text>
            <Divider style={{marginVertical:10}}/>
            <View style={{marginVertical:5}}>
            <Text><Text style={{fontWeight:'bold'}}>Reverification:</Text> If the employee requires reverification, your employee can choose to present any acceptable List A or List C documentation to show continued employment authorization. Enter the document information in the spaces below.</Text>
            </View>
            <View style={{marginVertical:5}}>
      <Text style={{fontWeight:'bold', marginVertical:2}}  variant='button'>List Type</Text>
      <RadioButton.Group
       
        onValueChange={(value) => handleChange('listType', value)}
        value={newSupplementB.listType}
      >
        <View>
          <RadioButton.Item style={{borderColor:'grey', borderRadius:5, borderStyle:'solid', borderWidth:2 ,marginVertical:2}} label="List A" value="listA" />
          <RadioButton.Item style={{borderColor:'grey', borderRadius:5, borderStyle:'solid', borderWidth:2, marginVertical:2}} label="List C" value="listC" />
        </View>
      </RadioButton.Group>
      </View>

      <View style={{marginVertical:5}}>
            <Text style={{fontWeight:'bold', marginVertical:2}} variant='button'>Document Title</Text>
<TextInput
   
        mode="outlined"
        value={newSupplementB.documentTitle}
        onChangeText={(text) => handleChange('documentTitle', text)}
      />
      </View>

      <View style={{marginVertical:5}}>
            <Text style={{fontWeight:'bold', marginVertical:2}}  variant='button'>Document Number</Text>
    <TextInput
   
        mode="outlined"
        value={newSupplementB.documentNumber}
        onChangeText={(text) => handleChange('documentNumber', text)}
      />
      </View>

      <View style={{marginVertical:5}}>
            <Text style={{fontWeight:'bold', marginVertical:2}}  variant='button'>Expiration Date (mm/dd/yyyy)</Text>

      <DateInput
      value={formatDate(newSupplementB.expirationDate)}
      date={newSupplementB.expirationDate}
      onConfirm={(date) => {
        handleChange('expirationDate', date)
       
      }}
      />
      
</View>



      <View style={{marginVertical:5}}>
            <Text style={{fontWeight:'bold', marginVertical:2}}  variant='button'>Additional Information</Text>
      <TextInput
          multiline
          mode="outlined"
          numberOfLines={4}
          value={newSupplementB.additionalInformation}
          onChangeText={(text) => handleChange('additionalInformation', text)}
          style={{ marginBottom: 2, width: '100%' }}
        />

<Checkbox.Item
        style={{borderColor:newSupplementB.alternativeProcedure ?'#102372':'grey', borderRadius:5, borderStyle:'solid', borderWidth:2 ,marginVertical:2}}
        label="Press here if you used an alternative procedure authorized by DHS to examine documents."
        status={newSupplementB.alternativeProcedure ? 'checked' : 'unchecked'}
        onPress={handleCheckboxChange}
      />
        </View>
    
 
      </Card>

      <Card style={{padding:15, borderRadius:5, backgroundColor:'white', marginBottom:10}}>
      <Text variant='button' style={styles.sectionTitle}>Upload Document</Text>
            <Divider style={{marginVertical:10}}/>
            <UploadFile
              
              setNewSupplementData={setNewSupplementB}
            />
      </Card>

      <Card style={{padding:15, borderRadius:5, backgroundColor:'white', marginBottom:10}}>
      <Text variant='button' style={styles.sectionTitle}>EMPLOYER OR REPRESENTITIVE INFORMATION AND SIGNATURE</Text>
            <Divider style={{marginVertical:10}}/>
            <View style={{marginVertical:5}}>
            <Text style={{fontWeight:'bold', marginVertical:2}}  variant='button'>Employer or Authorized Representitive Last Name</Text>
    <TextInput
   
        mode="outlined"
        value={newSupplementB.employerLastName}
        onChangeText={(text) => handleChange('employerLastName', text)}
      />
      </View>

      <View style={{marginVertical:5}}>
            <Text style={{fontWeight:'bold', marginVertical:2}}  variant='button'>Employer or Authorized Representitive First Name</Text>
    <TextInput
   
        mode="outlined"
        value={newSupplementB.employerFirstName}
        onChangeText={(text) => handleChange('employerFirstName', text)}
      />
      </View>

            </Card>

      
   
            <Card style={{padding:15, borderRadius:5, backgroundColor:'white', marginBottom:10}}>
             
              <SignatureCapture 
              signatureVar={'signature'}
              setModalVisible={setModalVisible}
              Data={newSupplementB}
              setData={setNewSupplementB}
              setScroll={setScrollEnabled}
              />
      <View style={{marginVertical:5}}>
            <Text style={{fontWeight:'bold', marginVertical:2}}  variant='button'>Today's Date</Text>
    <TextInput
        disabled
        mode="outlined"
        value={formatDate(date)}
       
      />
      </View>


            
            </Card>

      {/* ... other form inputs ... */}

      {/* Example of checkbox */}
      
   
      {/* ... other form inputs ... */}

      <Button style={{borderRadius:5, backgroundColor:'#102372'}} mode="contained" onPress={handleSubmit}>
      <Text variant='button' style={{color:'white', fontWeight:'bold'}}>Submit</Text>
      </Button>    
      <View style={{height:50}}></View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 16,
    width:'100%'
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
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
  },
});

