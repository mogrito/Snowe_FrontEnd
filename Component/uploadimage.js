import React, { useEffect, useState } from 'react';
import { View, Image, Text, StyleSheet } from 'react-native';
import axios from 'axios';

const URL = 'http://192.168.25.204:8080';

const YourComponent = () => {
  const [imagePath, setImagePath] = useState(null);

  useEffect((boardId) => {
    // 서버의 이미지 API 엔드포인트로 요청을 보냄
    axios.get(`${URL}/board/view/${boardId}`)
      .then(response => {
        // 응답에서 이미지 경로를 가져와 상태 업데이트
        const imageData = response.data;
        setImagePath(imageData.imagePath);
      })
      .catch(error => {
        console.error('Error fetching image:', error);
      });
  }, []);

  return (
    <View style={styles.container}>
      {imagePath ? (
        <Image
          source={{ uri: imagePath }}
          style={styles.image}
        />
      ) : (
        <Text>Loading image...</Text>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  image: {
    width: 200,
    height: 200,
  },
});

export default YourComponent;