import React, { useState , useEffect } from 'react';
import AsyncStorage from "@react-native-async-storage/async-storage";
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
import { getTokens } from './TokenUtils';
import TransparentCircleButton from './TransparentCircleButton';
import backgroundImage from '../Images/dr1.png'; 



const LoginScreen = () => {
  const [loginId, setLoginid] = useState('');
  const [password, setPassword] = useState('');
  const [fontLoaded, setFontLoaded] = useState(false);
  const navigation = useNavigation();
  const URL = 'http://192.168.25.204:8080';
  const requestData = {
    loginId: loginId,
    password: password,
  };

  useEffect(() => {
    
    async function loadCustomFont() {
      await Font.loadAsync({
        BalooRegular: require('../assets/fonts/BalooRegular.ttf'), // 폰트 경로를 업데이트하세요
      });
      setFontLoaded(true);
    }
  
    loadCustomFont();
  }, []);
  

  const handleLogin = async () => {
    getTokens(requestData,navigation);
  };


  const onGoBack = () => {
    navigation.navigate('MainView');
  };

  
  return (
    <View style={styles.container}>

      <View style={styles.topBar}>
        <TransparentCircleButton onPress={onGoBack} name="left" color="#424242" />
      </View>
      <Image source={backgroundImage} style={styles.backgroundImage}/>
      

      <Text style={fontLoaded ? styles.title : {}}>Snowe</Text>
      

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
      

      <TouchableOpacity
        style={styles.loginButton}
        onPress={handleLogin}
      >
        <Text style={styles.loginText}>로그인</Text>
      </TouchableOpacity>


      <View style={styles.linkContainer}>
        <TouchableOpacity onPress={() => navigation.navigate('Register')} style={styles.button}>
          <Text style={styles.sign}>회원가입</Text>
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
    marginBottom:40,
    
  },
  title: {
    fontSize: 50,
    marginTop: 75,
    marginBottom: 15,
    fontStyle: 'normal',
    color: '#8BC1EF',
    fontFamily:'BalooRegular',
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
  topBar: {
    position: 'absolute',
    top: 0,
    left: 0,
    marginTop:60,
    marginLeft:1,
    zIndex: 1,
  },
});

export default LoginScreen;
