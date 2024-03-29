import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, Dimensions, Image } from 'react-native';
import { Asset } from 'expo-asset';
import * as Font from 'expo-font';

//웹에서 실행 시 FirstView 화면 실행 안함

const FirstScreen = () => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [fontLoaded, setFontLoaded] = useState(false);

  useEffect(() => {
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
        BalooRegular: require('../assets/fonts/BalooRegular.ttf'),
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
            style={styles.backgroundImage}
          />
          <Text style={fontLoaded ? styles.title : {}}>
            Snowe
          </Text>
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
  },
  title: {
    fontSize: 50,
    fontStyle: 'italic',
    color: 'black',
    fontFamily: 'BalooRegular',
    marginBottom:100,
    marginLeft:10,
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: Dimensions.get('window').width,
    height: Dimensions.get('window').height,
    resizeMode: 'cover',
    zIndex: -1,
  },
});


export default FirstScreen;
