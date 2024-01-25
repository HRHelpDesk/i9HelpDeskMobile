import React, { useState } from 'react';
import { View, Button, Image } from 'react-native';
import { launchImageLibrary } from 'react-native-image-picker';

const UploadFile = ({ selectedImage, setNewSupplementData }) => {
    const [image, setImage] = useState(null)
  const handleImageUpload = () => {
    launchImageLibrary({ title: 'Select Image' }, response => {
      if (response.didCancel) {
        console.log('User canceled image picker');
      } else if (response.error) {
        console.log('ImagePicker Error: ', response.error);
      } else {
        const uri = response.assets[0].uri;
        const source = { uri };
      console.log(response)

        // Update the state with the selected image
        setNewSupplementData(prevData => ({
          ...prevData,
          document: response.assets,
        }));
        setImage(source)

      }
    });
  };

  return (
    <View>
      <Button onPress={handleImageUpload} title="Select Image" />
      {image !== null && (
        <Image source={image} style={{ width: 200, height: 200 }} />
      )}
    </View>
  );
};

export default UploadFile;
