import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
 
} from 'react-native';
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';
import backgroundImage from '../Images/snowe.png';
import TransparentCircleButton from './TransparentCircleButton';

const ForgotIdScreen = () => {
  const [email, setEmail] = useState('');  // 이메일 변수 
  const [fontLoaded, setFontLoaded] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    
    async function loadCustomFont() {
      await Font.loadAsync({
        DMSerifText1: require('../assets/fonts/DMSerifText1.ttf'),
      });
      setFontLoaded(true);
    }

    loadCustomFont();
  }, []);

  const handleResetPassword = async () => {
    try {
        const response = await fetch('//주소입력', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/x-www-form-urlencoded', //
        },
        body: `email=${email}`, //
      });

      if (response.ok) {
        // 이메일 발송완료
        alert('이메일이 발송되었습니다. 아이디를 확인하세요');
        
      } else {
        // 이메일 발송실패
        alert('유효하지 않은 이메일입니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('이메일을 입력해주세요!');
  
      
    }
  };

  const onGoBack = () => {
    navigation.pop();
  };

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image source={backgroundImage} style={styles.backgroundImage} />

      <View style={styles.topBar}>
        <TransparentCircleButton
          onPress={onGoBack}
          name="arrow-back"
          color="#424242"
        />
      </View>


      {/* Title */}
      <Text style={fontLoaded ? styles.title : {}}>Change Password</Text>

      {/* Email Input */}
      <TextInput
        style={styles.input}
        placeholder="이메일"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />

      {/* Reset Password Button */}
      <TouchableOpacity style={styles.resetButton} onPress={handleResetPassword}>
        <Text style={styles.resetText}>이메일 전송</Text>
      </TouchableOpacity>

      {/* Links */}
      <View style={styles.linkContainer}>
        <TouchableOpacity
          onPress={() => navigation.navigate('Login')}
          style={styles.button}
        >
          <Text style={styles.backToLogin}>로그인 화면으로 돌아가기</Text>
        </TouchableOpacity>
      </View>
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
    marginTop: 75,
    marginBottom: 15,
    fontStyle: 'normal',
    color: 'black',
    fontFamily: 'DMSerifText1',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'white',
    backgroundColor: 'white',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
    paddingHorizontal: 8,
  },
  resetButton: {
    width: '100%',
    height: 40,
    backgroundColor: 'skyblue',
    borderRadius: 5,
    marginBottom: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  resetText: {
    color: 'black',
  },
  backToLogin: {
    marginTop: 16,
    marginBottom: 15,
    color: 'black',
    textDecorationLine: 'underline',
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '134%',
    height: '120%',
    resizeMode: 'cover',
    zIndex: -1,
  },
  linkContainer: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
  },
  topBar: {
    position: 'absolute',
    top: 50,
    left: 20,
  },

});

export default ForgotIdScreen;
