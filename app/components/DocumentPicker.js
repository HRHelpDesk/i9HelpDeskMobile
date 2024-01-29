import React, { useState } from 'react';
import { View,  Modal, TouchableOpacity } from 'react-native';
import {Picker} from '@react-native-picker/picker'
import { statesArray } from '../utils/GlobalFunctions';
import { TextInput } from 'react-native-paper';
import { Text } from '@react-native-material/core';


const DocumentPicker = ({ formData, handleInputChange,handleInputCodeChange, docType, docName }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handlePickerChange = (value, label) => {
    setModalVisible(false);
    handleInputChange('documentTitle', docType[label].sectionTwoName);
    handleInputCodeChange('documentCode', value);
    console.log(docType[label].documentName + ' ' + value)
  };

  return (
    <View>

      <Text style={{fontWeight:'bold', marginVertical:2}} variant='button'>{'Document Title'}</Text>
      <TextInput
      mode="outlined"
      value={docName}
      onPressIn={() => setModalVisible(true)}
      
      />


      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: '100%', height: 200, backgroundColor: 'white', padding: 10 }}>
            <Picker
              selectedValue={docName}
              onValueChange={handlePickerChange}
              style={{ flex: 1 }}
            >
              {docType.map((i, index) => (
                <Picker.Item key={index} label={i.sectionTwoName} value={i.code} />
              ))}
            </Picker>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default DocumentPicker;
