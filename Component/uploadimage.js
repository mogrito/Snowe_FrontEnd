import React, { useState } from 'react';
import { View, Text, Button, Image, StyleSheet, TouchableOpacity} from 'react-native';
import ImagePicker from 'react-native-image-picker';
import Axios from 'axios';

const ImageUploadScreen = () => {
  const [selectedImage, setSelectedImage] = useState(null);

  const selectImage = () => {
    ImagePicker.showImagePicker({ title: 'Select an Image' }, (response) => {
      if (response.didCancel) {
        console.log('Image selection canceled');
      } else if (response.error) {
        console.error('ImagePicker Error: ', response.error);
      } else {
        // 이미지가 선택되었을 때 서버로 업로드
        uploadImageToServer(response);
      }
    });
  };

  const uploadImageToServer = (imageData) => {
    const formData = new FormData();
    formData.append('image', {
      uri: imageData.uri,
      type: 'image/jpeg',
      name: 'image.jpg',
    });

    Axios.post('YOUR_API_URL', formData, {
      headers: {
        'Content-Type': 'multipart/form-data',
      },
    })
      .then((response) => {
        console.log('Image uploaded successfully:', response.data);
        setSelectedImage({ uri: imageData.uri });
      })
      .catch((error) => {
        console.error('Image upload failed:', error);
      });
  };

  return (
    <View style={styles.container}>
      <TouchableOpacity title="Select Image" onPress={selectImage} />
      {selectedImage && <Image source={selectedImage} style={styles.image} />}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    width:'100%'
  },
  image: {
    width: 200,
    height: 200,
    marginTop: 20,
  },
});

export default ImageUploadScreen;
