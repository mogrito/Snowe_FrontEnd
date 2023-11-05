import React, { useState } from 'react';
import { Image, View} from 'react-native';
import * as ImagePicker from 'expo-image-picker';
import { MaterialIcons } from '@expo/vector-icons';
import { TouchableOpacity } from 'react-native';

function ImagePicker2() {
  const [image, setImage] = useState(null);

  const pickImage = async () => {
  
    let result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });

    console.log(result);

    if (!result.canceled) {
      setImage(result.assets[0].uri);
    }
  };

  return (
    <View style={{ flex: 1, alignItems: 'left', justifyContent: 'center' }}>
      <TouchableOpacity onPress={pickImage}>
        <MaterialIcons name='add-a-photo' size={30} color="black" />
      </TouchableOpacity>
      {image && <Image source={{ uri: image }} style={{ width: 200, height: 200 }} />}
    </View>
  );
}

export default ImagePicker2;