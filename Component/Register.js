import React, { useState , useEffect} from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import * as Font from 'expo-font';

// 이미지를 import 합니다.
import backgroundImage from '../Images/snowe.png'; // 이미지 경로를 실제 이미지 파일 경로로 바꾸세요.

const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fontLoaded, setFontLoaded] = useState(false);
  const navigation = useNavigation();

  const handleRegister = () => {
    // You can add your registration logic here
    // For example, send the registration data to an API

    // Clear the input fields after registration
    setUsername('');
    setEmail('');
    setPassword('');
  };

  useEffect(() => {
    // Load the custom font asynchronously
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
      {/* 배경 이미지 설정 */}
      <Image source={backgroundImage} style={styles.backgroundImage} />

      <Text style={fontLoaded ? styles.title : {}}>Sign up</Text>

      <TextInput
        style={styles.input}
        placeholder="아이디"
        value={username}
        onChangeText={(text) => setUsername(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="이메일"
        value={email}
        onChangeText={(text) => setEmail(text)}
      />

      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setPassword(text)}
      />

      <TouchableOpacity style={styles.registerButton} onPress={()=> navigation.navigate('MainView')}>
        <Text style={styles.registerButtonText}>가입하기</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.button, { marginLeft: 'auto' }]} onPress={()=> navigation.navigate('Login')}>
        <Text style={styles.areadysignup}>이미 가입된 회원이신가요?</Text>
      </TouchableOpacity>

    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 10,
    
  },
  backgroundImage: {
    position: 'absolute',
    top: 0,
    left: 0,
    width: '113%',
    height: '110%',
    resizeMode: 'cover',
    zIndex: -1,
  },
  title: {
    fontSize: 50,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 90,
    color: 'black', // 텍스트 색상을 설정합니다.
    fontFamily:'DMSerifText1',
  },
  input: {
    width: '100%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', // 입력 필드의 배경색을 설정합니다.
  },
  registerButton: {
    width: '100%',
    height: 40,
    backgroundColor: 'skyblue',
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  registerButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },

  areadysignup: {
    marginTop: 10,
    marginBottom: -3,
    color: 'black',
    textDecorationLine: 'underline',
    textAlign: 'right',

  }
});

export default RegisterScreen;


