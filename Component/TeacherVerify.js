import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  KeyboardAvoidingView,
  ScrollView,
  Platform  
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import * as Font from 'expo-font';
import TransparentCircleButton from './TransparentCircleButton';
import { TextInputMask } from 'react-native-masked-text'
import backgroundImage from '../Images/dr1.png'; 


const TeacherVerifyScreen = () => {
    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [birthday, setBirthday] = useState('');
    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [fontLoaded, setFontLoaded] = useState(false);
    const navigation = useNavigation();
    const URL = 'http://192.168.219.103:8080';
    const onGoBack = () => {
      navigation.pop();
    };
  
    useEffect(() => {
      async function loadCustomFont() {
        await Font.loadAsync({
          DMSerifText1: require('../assets/fonts/DMSerifText1.ttf'),
        });
        setFontLoaded(true);
      }
  
      loadCustomFont();
    }, []);
  
  
  
    const handleRegister = async () => {
      try {

        const response = await fetch(`${URL}/member/members`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            loginId: username,
            password: password,
            name: name,
            birthday: birthday,
            email: email,
            nickname: nickname,
            gender: gender, 
          }),
        });
  
        if (response.ok) {
          // 회원가입 성공
          alert('강사 신청이 완료되었습니다.');
          navigation.navigate('MainView');
        } else {
          // 회원가입 실패
          alert('강사 신청이 실패했습니다.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('강사 정보를 입력해주세요');
      }
  
      // 상태 초기화
      setUsername('');
      setName('');
      setPassword('');
      setBirthday('');
      setNickname('');
      setGender('');
    };
  
  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      style={{ flex: 1 }}
    >
      <View style={styles.backButton}>
        <TransparentCircleButton
          onPress={onGoBack}
          name="left"
          color="#424242"
        />

      </View>
      <Image source={backgroundImage} style={styles.backgroundImage} />
      <ScrollView contentContainerStyle={styles.container}>
        {/* 배경 이미지 설정 */}
        <Text style={fontLoaded ? styles.title : {}}>Sign Up</Text>

        <Text style={styles.textinfo}>소지하고 있는 자격증을 첨부해주세요.</Text>
        <TextInput
          style={styles.input}
          placeholder="자격증 사진 첨부"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />

        <TextInput
          style={styles.input1}
          placeholder="한줄 소개"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />

        <TextInput
          style={styles.input}
          placeholder="약력"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />

        <TextInput
          style={styles.input}
          placeholder="경력"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />

        <TextInput
          style={styles.input}
          placeholder="해당 소속"
          value={email}
          onChangeText={(text) => setEmail(text)}
        />
  
        <Text style={styles.textinfo}>자신을 나태나는 사진을 추가해주세요.</Text>

        <TextInput
          style={styles.input}
          placeholder="사진"
          value={password}
          onChangeText={(text) => setPassword(text)}
        />

        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>신청하기</Text>
        </TouchableOpacity>
      </ScrollView>

    </KeyboardAvoidingView>
  );
};

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
      marginBottom:130,
    },
    backgroundImage: {
      position: 'absolute',
      top: 0,
      left: 0,
      width: '103%',
      height: '100%',
      resizeMode: 'cover',
      zIndex: -1,
    },
    title: {
      fontSize: 50,
      fontWeight: 'bold',
      marginBottom: 20,
      marginTop: 90,
      color: 'black', 
      fontFamily: 'DMSerifText1',
    },
    input: {
      width: '100%',
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 12,
      paddingHorizontal: 8,
      backgroundColor: 'rgba(255, 255, 255, 0.8)', 
    },
    inputContainer: {
      flexDirection: 'row',
      alignItems: 'center',
      width: '100%',
      marginBottom: 0,
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

    backButton: {
    marginTop:50,
    marginLeft:20,
    },
    
    textinfo: {
      marginRight:135,
      marginBottom:5,

    },
    input1:{
      width: '100%',
      height: 100,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 12,
      paddingHorizontal: 8,
      backgroundColor: 'rgba(255, 255, 255, 0.8)', 
    },
    
  
  });
  

export default TeacherVerifyScreen;



