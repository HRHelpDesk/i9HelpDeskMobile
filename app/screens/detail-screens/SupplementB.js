import { Text } from "@react-native-material/core";
import React, { useState, useEffect } from "react";
import { View, StyleSheet, ScrollView, Alert, Image, Dimensions } from "react-native";
import { Appbar, Menu, Button, PaperProvider, Card, Divider, ActivityIndicator, Modal, Portal,} from "react-native-paper";
import { SvgIconHolder } from "../../components/SvgIconHolder";
import { Path, Svg } from "react-native-svg";
import { SupplementBForm } from "../../components/SupplementBForm";
import Icon from 'react-native-vector-icons/MaterialCommunityIcons';
import { formatDate } from "../../utils/GlobalFunctions";
import AutoImage from "../../components/AutoImage";
import { TouchableOpacity } from "react-native-gesture-handler";
import axios from "axios";
import { API } from "../../utils/controller";
import SplashScreen from "../../components/SpalshScreen";




const EmployeeInfoCard = ({ employeeInfo }) => {
  return (
    <Card style={{ padding: 15, borderRadius: 5, backgroundColor: 'white', marginBottom: 10 }}>
     <Text variant='button' style={styles.sectionTitle}>Employee Information</Text>
            <Divider style={{marginVertical:10}}/>
            <View style={styles.gridContainer}>
            <View style={styles.gridItem100}>
  <Text style={styles.sectionHeader}>Date of Rehire</Text>
  <Text style={styles.sectionP}>{formatDate(employeeInfo.dateOfRehire)}</Text>
  </View>

  <View style={styles.gridItem30}>
  <Text style={styles.sectionHeader}>Last Name *</Text>
  <Text style={styles.sectionP}>{employeeInfo.lastName}</Text>
  </View>

  <View style={styles.gridItem30}>
  <Text style={styles.sectionHeader}>First Name *</Text>
  <Text style={styles.sectionP}>{employeeInfo.firstName}</Text>
</View>
<View style={styles.gridItem30}>
  <Text style={styles.sectionHeader}>Middle Initial</Text>
  <Text style={styles.sectionP}>{employeeInfo.middleInitial}</Text>
  </View>
  
      </View>
    </Card>
  );
};

const DocumentInfoCard = ({ documentInfo }) => {
  return (
    <Card style={{ padding: 15, borderRadius: 5, backgroundColor: 'white', marginBottom: 10 }}>
      <Text variant='button' style={styles.sectionTitle}>Document Information</Text>
            <Divider style={{marginVertical:5}}/>
            <View style={styles.gridContainer}>
            <View style={styles.gridItem50}>
  <Text style={styles.sectionHeader}>Document Type</Text>
  <Text style={styles.sectionP}>{documentInfo.documentTitle}</Text>
  </View>
            <View style={styles.gridItem50}>
  <Text style={styles.sectionHeader}>Document Title</Text>
  <Text style={styles.sectionP}>{documentInfo.documentTitle}</Text>
  </View>

  <View style={styles.gridItem50}>
  <Text style={styles.sectionHeader}>Document Number</Text>
  <Text style={styles.sectionP}>{documentInfo.documentNumber}</Text>
  </View>

  <View style={styles.gridItem50}>
  <Text style={styles.sectionHeader}>Expiration Date</Text>
  <Text style={styles.sectionP}>{formatDate(documentInfo.expirationDate)}</Text>
</View>
<View style={styles.gridItem100}>
  <Text style={styles.sectionHeader}>Did you use an alternative procedure authorized by DHS to examine documents?</Text>
  <Text style={styles.sectionP}>{documentInfo.alternativeProcedure ? 'Yes' : 'No'}</Text>
</View>
<View style={styles.gridItem100}>
  <Text style={styles.sectionHeader}>Document</Text>
  <AutoImage
          source={{ uri: documentInfo.document}}
       
        />
  </View>
  </View>
    </Card>
  );
};

const EmployerInfoCard = ({ employerInfo }) => {
  return (
    <Card style={{ padding: 15, borderRadius: 5, backgroundColor: 'white', marginBottom: 10 }}>
      <Text variant='button' style={styles.sectionTitle}>
        Employer Information
      </Text>
      <Divider style={{ marginVertical: 5 }} />
      <View style={styles.gridContainer}>
            <View style={styles.gridItem100}>
  <Text style={styles.sectionHeader}>Employer or Authorized Representitive Last Name</Text>
  <Text style={styles.sectionP}>{employerInfo.employerLastName}</Text>
  </View>
            <View style={styles.gridItem100}>
  <Text style={styles.sectionHeader}>Employer or Authorized Representitive First Name</Text>
  <Text style={styles.sectionP}>{employerInfo.employerFirstName}</Text>
  </View>

  <View style={styles.gridItem100}>
  <Text style={styles.sectionHeader}>Employer or Authorized Representitive Signature</Text>
  <AutoImage
          source={{ uri: employerInfo.signature}}
       
        />
  </View>

  <View style={styles.gridItem100}>
  <Text style={styles.sectionHeader}>Date Signed</Text>
  <Text style={styles.sectionP}>{formatDate(employerInfo.signatureDate)}</Text>
</View>

  </View>
    </Card>
  );
};

export const SupplementB = ({navigation, route})=>{
    const [visible, setVisible] = useState(false);
    const [modalVisible, setModalVisible] = useState(false);
    const [update, setUpdate] = useState(true);
    const [loading, setLoading] = useState(true);
    const [sectionOne, setSectionOne] = useState(null);
    const [sectionTwo, setSectionTwo] = useState(null);
    const openMenu = () => setVisible(true);
    const closeMenu = () => setVisible(false);
    const [infoModalVisible, setInfoModalVisible] = useState(false);
    const [selectedItem, setSelectedItem] = useState(null);
    const [id, setId] = useState('')
    const showInfoModal = (item) => {
      setSelectedItem(item);
      setId(item.id)
      setInfoModalVisible(true);
    };
  
    const hideInfoModal = () => {
      setSelectedItem(null);
      setId('')
      setInfoModalVisible(false);
    };

    const deleteItem = async (id, i9id, supBId)=>{
       const conf = Alert.alert('Delete', 'Are you sure you would like to delete this? It cannot be recovered once deleted.',[
        {
          text: "No",
          onPress: () => {return false;}
        },
        {
          text: "Yes",
          onPress: async () => {  
            let resp = await axios.post(API +'/i9/deleteSupplementB', {userId: id, i9Id: i9id, supBId: supBId});
    
          console.log(resp)
         if(resp.data.message === 'Supplement-B item deleted successfully'){
          setUpdate(!update)
          hideInfoModal();
        
         } else {
        Alert.alert('Something went wrong. Please try again.')
         }},
          style: "cancel"
        }
      ],
      { cancelable: false })
     
     if(conf){
      
       console.log(id)
    
      console.log(i9id)
    
      console.log(supBId)
     

    }
    }
    
    
    const handleLogout = async () => {
        // Clear the stored token and user data
        await AsyncStorage.removeItem('token');
        await AsyncStorage.removeItem('user');
    
        // Navigate back to the login screen
        navigation.navigate('Login');
        closeMenu()
      };

      const showModal = () => {
        setModalVisible(true);
      };
    
      const hideModal = () => {
        setUpdate(!update)
        setModalVisible(false);
      };


  useEffect(() => {
    const checkData = async () => {
      try {
        const resp = await axios.post(API + '/i9/check-form', { id: route.params.a, i9Id: route.params.b });
        
        console.log(resp.data.sectionOne)
        if (resp.data.notFound) {
          // Handle error or redirect
          return;
        }

        setSectionOne(resp.data.sectionOne);
        setSectionTwo(resp.data.sectionTwo);
        setLoading(false);
      

        // Add similar blocks for other citizenshipStatus values
      } catch (error) {
        console.error('Error fetching data:', error.message);
      }
    };
    checkData()
  }, [update]);

if(loading){
    return <SplashScreen/>
} else {
    
    return (
        <PaperProvider>
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
    
    title={<Text variant="button" style={{color: 'white', fontWeight: 'bold', fontSize:16 }}>Supplement B</Text>}
  />


  <Menu
    visible={visible}
    onDismiss={closeMenu}
    anchor={
      <Button
      size={20}
      onPress={() => openMenu()}
      >
    
     <SvgIconHolder
     d="M13 5c0-2.76-2.24-5-5-5S3 2.24 3 5c0 1.52.678 2.882 1.75 3.8C2.52 9.97 1 12.306 1 15c0 .552.448 1 1 1s1-.448 1-1c0-2.76 2.24-5 5-5s5 2.24 5 5c0 .552.448 1 1 1s1-.448 1-1c0-2.693-1.52-5.03-3.75-6.2C12.323 7.88 13 6.52 13 5zM8 8C6.343 8 5 6.657 5 5s1.343-3 3-3 3 1.343 3 3-1.343 3-3 3z"
      fill="white" // Set the desired color here
     />
 
   </Button>
 
    }
  >
    <Menu.Item onPress={() => { /* Add functionality for Account Settings */ }} title="Account Settings" />

    <Menu.Item onPress={handleLogout} title="Logout" />
  </Menu>
</Appbar.Header> 
<ScrollView style={styles.container}>
<Card style={{padding:15, borderRadius:5, backgroundColor:'white', marginBottom:10}}>
          <Text variant='button' style={styles.sectionTitle}>Employer Information</Text>
            <Divider style={{marginVertical:10}}/>
            <View style={styles.gridContainer}>
            <View style={styles.gridItem30}>
          <Text style={styles.sectionHeader}>Last Name</Text>
          <Text style={styles.sectionP}>{sectionOne.lastName}</Text>         
           </View>

           <View style={styles.gridItem30}>
          <Text style={styles.sectionHeader}>First Name</Text>
          <Text style={styles.sectionP}>{sectionOne.firstName}</Text>         
           </View>

           <View style={styles.gridItem30}>
          <Text style={styles.sectionHeader}>Middle Initial</Text>
          <Text style={styles.sectionP}>{sectionOne.middleInitial}</Text>         
           </View>
                </View>

          
</Card>

<Card style={{padding:15, borderRadius:5, backgroundColor:'white', marginBottom:10}}>
    <Button
   
    onPress={showModal}
    >Add New +</Button>
</Card>
<Text variant='button' style={styles.sectionTitle}>Supplement B List</Text>
<Text  style={styles.sectionP}>Click to show details</Text>

{sectionTwo.supplementB.map((item) => (

<TouchableOpacity
      
      key={item.id}
      onPress={() => showInfoModal(item)}
      style={liStyles.listItemContainer}
    >
      <View>
        <Text><Text style={{fontWeight:'bold'}}>Date of Rehire: </Text>{formatDate(item.dateOfRehire)}</Text>
        <Text><Text style={{fontWeight:'bold'}}>Date Created: </Text>{formatDate(item.signatureDate)}</Text>
        <Text><Text style={{fontWeight:'bold'}}>Name: </Text>{item.firstName} {item.lastName}</Text>
      </View>
    </TouchableOpacity>

  // <Card key={item.id} style={ListStyles.listItem}>
  //   <View style={ListStyles.listItemContent}>
  //     <View style={ListStyles.listItemLeft}>
  //       <Text style={ListStyles.dateLabel}>Date of Rehire</Text>
  //       <Text style={ListStyles.dateValue}>{formatDate(item.dateOfRehire)}</Text>
  //     </View>
  //     <View style={ListStyles.listItemRight}>
  //       <Text style={ListStyles.employeeName}>{item.firstName}</Text>
  //       <Button onPress={() => showInfoModal(item)}>Show Details</Button>
  //     </View>
  //   </View>
  // </Card>
))}

<Portal>
          
<Modal contentContainerStyle={styles.modalContainer} visible={infoModalVisible} onDismiss={hideInfoModal} animationType="slide">
  <ScrollView>
          <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
            {selectedItem && (
              <>
                <EmployeeInfoCard employeeInfo={selectedItem} />
                <DocumentInfoCard documentInfo={selectedItem} />
                <EmployerInfoCard employerInfo={selectedItem} />
              </>
            )}
          </View>
          </ScrollView>
          <Button mode="contained" style={{marginHorizontal:5, marginVertical:5, width:'95%', borderRadius:5, backgroundColor:'#102372'}} onPress={hideInfoModal}><Text variant="button" style={{fontWeight:'bold', color:'white'}}>Close</Text></Button>
          <Button mode="contained" style={{marginHorizontal:5, marginVertical:5, width:'95%', borderRadius:5, backgroundColor:'tomato'}} onPress={()=>deleteItem(route.params.a, route.params.b, id)}><Text variant="button" style={{fontWeight:'bold', color:'white'}}>Delete</Text></Button>

        </Modal>
</Portal>

<Portal>
              <Modal visible={modalVisible} onDismiss={hideModal} contentContainerStyle={styles.modalContainer}>
                {/* Add your modal content here */}
                <SupplementBForm
                id={route.params.a}
                i9id={route.params.b}
                close={hideModal}
                />
                <Button onPress={hideModal}>Close</Button>
              </Modal>
            </Portal>

</ScrollView>
        </View>
        </PaperProvider>
    )
}

}

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
      height:400,
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
  const liStyles = StyleSheet.create({
    listItemContainer: {
      padding: 10,
      marginVertical: 5,
      backgroundColor: 'white',
      borderRadius: 5,
    },
  });