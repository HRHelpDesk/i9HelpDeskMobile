import React, { useState, useEffect } from 'react';
import { Image, View, StyleSheet, Dimensions } from 'react-native';

const AutoHeightImage = ({ source }) => {
  const [containerHeight, setContainerHeight] = useState(0);

  useEffect(() => {
    // Fetch the dimensions of the image
    Image.getSize(
      source.uri,
      (width, height) => {
        // Calculate the aspect ratio
        const aspectRatio = width / height;

        // Calculate the container height based on the device width and aspect ratio
        const { width: deviceWidth } = Dimensions.get('window');
        const newContainerHeight = deviceWidth / aspectRatio;

        // Set the container height
        setContainerHeight(newContainerHeight);
      },
      (error) => {
        console.error('Error getting image size:', error);
      }
    );
  }, [source.uri]);

  return (
    <View style={[styles.container, { height: containerHeight }]}>
      <Image source={source} style={styles.image} resizeMode="contain" />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    // Add any additional styling for the container if needed
  },
  image: {
    flex: 1,
    width: '100%',
    height: '100%',
  },
});

export default AutoHeightImage;
