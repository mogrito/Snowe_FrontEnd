import React, { useState , useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
import {
  View,
  Text,
  TextInput,
  Button,
  TouchableOpacity,
  StyleSheet,
  Image
} from 'react-native';
import { useNavigation } from '@react-navigation/native'; 
import * as Font from 'expo-font';
import backgroundImage from '../Images/snowe.png';


const LoginScreen = () => {
  const [loginId, setLoginid] = useState('');
  const [password, setPassword] = useState('');
  const [fontLoaded, setFontLoaded] = useState(false);
  const navigation = useNavigation();

  useEffect(() => {
    
    async function loadCustomFont() {
      await Font.loadAsync({
        DMSerifText1: require('../assets/fonts/DMSerifText1.ttf'), // 폰트 경로를 업데이트하세요
      });
      setFontLoaded(true);
    }
  
    loadCustomFont();
  }, []);
  
  
const showToast = (text) =>{
  Toast.show({
      type: 'error',
      position: 'bottom',
      text1: text,
    });
};

const handleLogin = async() => {
  const userData = {
    loginId: loginId,
    password: password,
  };

  try {
    const response = await fetch('http://192.168.25.202:8080/member/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(userData),
    });

    if (response.status === 200) {
      const accessToken = response.headers.get('Authorization');

      // accessToken 로컬에 저장
      await AsyncStorage.setItem('Tokens', JSON.stringify({
        'accessToken': accessToken,
        'loginId': loginId,
        
      }));
      console.log(AsyncStorage.getItem(accessToken))
      navigation.navigate('MainView');
    } else {
      // 다른 오류 발생시 작성할 예정
    }
  } catch (error) {
    if(error.response.status === 401){
      showToast("아이디 또는 비밀번호가 존재하지 않습니다.")
    }
    else{
        showToast("알수없는 오류")
    } 
    }
};

  return (
    <View style={styles.container}>
      {/* Background Image */}
      <Image source={backgroundImage} style={styles.backgroundImage}/>
      
      {/* Title */}
      <Text style={fontLoaded ? styles.title : {}}>Snowe</Text>
      
      {/* LoginId Input */}
      <TextInput
        style={styles.input}
        placeholder="아이디"
        value={loginId}
        onChangeText={(text) => setLoginid(text)}
  
      />

      <TextInput
        style={styles.input}
        placeholder="비밀번호"
        secureTextEntry={true}
        value={password}
        onChangeText={(text) => setPassword(text)}
        keyboardType="default" 
        autoCapitalize="none" 
      />
      
      {/* Login Button */}
      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
      >
        <Text style={styles.loginText}>로그인</Text>
      </TouchableOpacity>

      {/* Links */}
      <View style={styles.linkContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.button}>
          <Text style={styles.sign}>회원이 아니신가요?</Text>
        </TouchableOpacity>
        <View style={{ width: 10 }} />
        <TouchableOpacity  onPress={() => navigation.navigate('ForgetId')} style={styles.button}>
          <Text style={styles.forgotPassword}>아이디 찾기</Text>
        </TouchableOpacity>
        <View style={{ width: 10 }} />
        <TouchableOpacity  onPress={() => navigation.navigate('ForgetPassword')} style={styles.button}>
          <Text style={styles.forgotId}>비밀번호 찾기</Text>
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
    fontFamily:'DMSerifText1',
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
  forgotPassword: {
    marginTop: 15,
    marginBottom: 15,
    color: 'black',
    textDecorationLine: 'underline',
  },
  forgotId: {
    marginTop: 15,
    marginBottom: 15,
    color: 'black',
    textDecorationLine: 'underline',
  },
  sign: {
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
  loginButton: {
    width: '100%',
    height: 40,
    backgroundColor: 'skyblue',
    borderRadius: 5,
    marginBottom: 16,
    paddingHorizontal: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  loginText: {
    color: 'black',
  },
});

export default LoginScreen;

