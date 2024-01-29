import React, { useState } from 'react';
import { View,  Modal, TouchableOpacity } from 'react-native';
import {Picker} from '@react-native-picker/picker'
import { statesArray } from '../utils/GlobalFunctions';
import { TextInput } from 'react-native-paper';
import { Text } from '@react-native-material/core';


const StatePicker = ({ formData, handleInputChange }) => {
  const [modalVisible, setModalVisible] = useState(false);

  const handlePickerChange = (value) => {
    setModalVisible(false);
    handleInputChange('employerState', value);
  };

  return (
    <View>

      <Text style={{fontWeight:'bold', marginVertical:2}} variant='button'>{'State'}</Text>
      <TextInput
                mode="outlined"
                value={statesArray[formData.employerState]}
                onPressIn={() => setModalVisible(true)}
                />


      <Modal
        animationType="slide"
        transparent={true}
        visible={modalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View style={{ flex: 1, justifyContent: 'center', alignItems: 'center' }}>
          <View style={{ width: 200, height: 200, backgroundColor: 'white', padding: 10 }}>
            <Picker
              selectedValue={formData.employerState}
              onValueChange={handlePickerChange}
              style={{ flex: 1 }}
            >
              {statesArray.map((state, index) => (
                <Picker.Item key={index} label={state} value={index} />
              ))}
            </Picker>
          </View>
        </View>
      </Modal>
    </View>
  );
};

export default StatePicker;
