import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';

const FirstScreen = () => {
  const [imageLoaded, setImageLoaded] = useState(false); // 이미지 로딩 상태
  const screenHeight = Dimensions.get('window').height;
  const [fontLoaded, setFontLoaded] = useState(false);
  useEffect(() => {
    // Expo Asset를 사용하여 이미지 로딩
    const loadImage = async () => {
      const imageAsset = Asset.fromModule(require('../Images/Snowboard.jpg'));
      await imageAsset.downloadAsync();
      setImageLoaded(true);
    };

    loadImage();
  }, []);


  useEffect(() => {
   
    async function loadCustomFont() {
      await Font.loadAsync({
        DMSerifText1: require('../assets/fonts/DMSerifText1.ttf'), // 폰트 경로를 업데이트하세요
      });
      setFontLoaded(true);
    }
  
    loadCustomFont();
  }, []);

  return (
    <View style={styles.container}>
      {imageLoaded && (
        <>
          <Image
            source={require('../Images/SnoweFirst.jpg')}
            style={[styles.backgroundImage, { height: screenHeight }]}
          />
          <Text style={fontLoaded ? styles.title : {}}>Snowe</Text>
      
        </>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 50,
  },
  title: {
    fontSize: 50,
    marginTop: 0,
    marginBottom: 0,
    fontStyle: 'italic',
    color: 'black',
    fontFamily:'DMSerifText1',
    marginLeft: 10,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,

    width: '130%',
    height: '100%',
    resizeMode: 'cover',
    zIndex: -1,
  },
});

export default FirstScreen;




