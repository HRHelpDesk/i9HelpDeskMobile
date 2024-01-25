import React, { useState } from 'react';
import { View, Image, ActivityIndicator } from 'react-native';

const ModalImage = ({ imageUrl }) => {
  const [loading, setLoading] = useState(true);

  const onLoadEnd = () => {
    setLoading(false);
  };

  return (
    <View>
      {loading && <ActivityIndicator size="large" color="#0000ff" />}
      <Image onLoadEnd={onLoadEnd} 
      source={{ uri: imageUrl }} 
      style={{
    width: '80%',
    height: 300,
    resizeMode: 'contain',
  }} />
    </View>
  );
};

export default ModalImage;
