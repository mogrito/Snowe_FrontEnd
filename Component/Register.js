import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Alert,
  KeyboardAvoidingView,
  ScrollView,
  Platform  
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import * as Font from 'expo-font';
import TransparentCircleButton from './TransparentCircleButton';
import { TextInputMask } from 'react-native-masked-text'

// 이미지를 import 합니다.
import backgroundImage from '../Images/snowe.png'; 
import { SafeAreaView } from 'react-native-safe-area-context';

const RegisterScreen = () => {
  const [username, setUsername] = useState('');
  const [name, setName] = useState('');
  const [password, setPassword] = useState('');
  const [birthday, setBirthday] = useState('');
  const [email, setEmail] = useState('');
  const [nickname, setNickname] = useState('');
  const [gender, setGender] = useState(''); 
  const [fontLoaded, setFontLoaded] = useState(false);
  const [isUsernameValid, setIsUsernameValid] = useState(false); // 아이디 중복 확인 상태
  const [isNicknameValid, setIsNicknameValid] = useState(false);  // 닉네임 중복 확인 상태
  const navigation = useNavigation();

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

  // 아이디 중복 변수
  const handleCheckUsername = async () => {
    try {
        const response = await fetch('http://192.168.25.202:8080/member-count?loginId=' + username, {
            method: 'GET',
            headers: {
                'Accept': 'text/plain', // 텍스트 형식을 받도록 설정
            },
        });

        if (response.ok) {
            const result = await response.text(); 
            if (result === "duplicate") {
                alert('이미 존재하는 아이디입니다.');
                setIsUsernameValid(false);
            } else {
                alert('사용 가능한 아이디입니다.');
                setIsUsernameValid(true);
            }
        } else {
            alert('중복 확인에 실패했습니다.');
            setIsUsernameValid(false);
        }
    } catch (error) {
        console.error('Error:', error);
        alert('아이디를 입력해주세요');
        setIsUsernameValid(false);
    }
};

    //닉네임 중복 변수 
  const handleCheckNickname = async () => {
    try {
      const response = await fetch('http://192.168.25.202:8080/member-nickname?nickname=' + nickname, {
        method: 'GET',
        headers: {
            'Accept': 'text/plain', // 텍스트 형식을 받도록 설정
        },
      });

        if (response.ok) {
          const result = await response.text(); // 문자열로 파싱
          if (result === "duplicate") {
              alert('이미 존재하는 닉네임입니다.');
              setIsNicknameValid(false);
          } else {
              alert('사용 가능한 닉네임입니다.');
              setIsNicknameValid(true);
          }
      } else {
          alert('중복 확인에 실패했습니다.');
          setIsNicknameValid(false);
      }
  } catch (error) {
      console.error('Error:', error);
      alert('닉네임를 입력해주세요');
      setIsNicknameValid(false);
  }
  };


  const handleRegister = async () => {
    try {
      if (!isUsernameValid) {
        alert('아이디 중복 확인을 해주세요.');
        return;
      }

      if (!isNicknameValid) {
        alert('닉네임 중복 확인을 해주세요.');
        return;
      }
      if (!gender) {
        alert('성별을 선택해주세요.');
        return;
      }

      const response = await fetch('http://192.168.25.202:8080/members', {
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
        alert('회원가입을 축하드립니다.');
        navigation.navigate('MainView');
      } else {
        // 회원가입 실패
        alert('회원가입을 실패했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('회원 정보를 입력해주세요');
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
     <Image source={backgroundImage} style={styles.backgroundImage} />
     <SafeAreaView>
      <TransparentCircleButton
          onPress={onGoBack}
          name="arrow-back"
          color="#424242"
      />    
      </SafeAreaView>
      <ScrollView contentContainerStyle={styles.container}>
  {/* 배경 이미지 설정 */}
  <Text style={fontLoaded ? styles.title : {}}>Sign Up</Text>

  <TextInput
    style={styles.input}
    placeholder="이메일"
    value={email}
    onChangeText={(text) => setEmail(text)}
  />

  <View style={styles.inputContainer}>
    <TextInput
      style={styles.input1}
      placeholder="아이디"
      value={username}
      onChangeText={(text) => setUsername(text)}
    />
    <TouchableOpacity style={styles.registerCheckButton} onPress={handleCheckUsername}>
      <Text style={styles.registerButtonText}>중복체크</Text>
    </TouchableOpacity>
  </View>

  <View style={styles.inputContainer}>
    <TextInput
      style={styles.input1}
      placeholder="닉네임"
      value={nickname}
      onChangeText={(text) => setNickname(text)}
    />
    <TouchableOpacity style={styles.registerCheckButton} onPress={handleCheckNickname}>
      <Text style={styles.registerButtonText}>중복체크</Text>
    </TouchableOpacity>
  </View>

  <View style={styles.inputContainer}>
    <TextInput
      style={styles.input2}
      placeholder="이름"
      value={name}
      onChangeText={(text) => setName(text)}
    />
    <TouchableOpacity
      style={gender === '남자' ? styles.genderButtonSelected : styles.genderButton}
      onPress={() => setGender('남자')}
    >
      <Text style={styles.genderButtonText}>남</Text>
    </TouchableOpacity>
    <TouchableOpacity
      style={gender === '여자' ? styles.genderButtonSelected1 : styles.genderButton}
      onPress={() => setGender('여자')}
    >
      <Text style={styles.genderButtonText}>여</Text>
    </TouchableOpacity>
  </View>

  <TextInput
    style={styles.input}
    placeholder="비밀번호"
    secureTextEntry={true}
    value={password}
    onChangeText={(text) => setPassword(text)}
  />

  <TextInputMask
    style={styles.input}
    type={'datetime'}
    placeholder="생년월일 (YYYY-MM-DD)"
    options={{
      format: 'YYYY-MM-DD'
    }}
    value={birthday}
    onChangeText={(text) => setBirthday(text)}
  />

  <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
    <Text style={styles.registerButtonText}>가입하기</Text>
  </TouchableOpacity>

  <TouchableOpacity
    style={[styles.button, { marginLeft: 'auto' }]}
    onPress={() => navigation.navigate('Login')}
  >
    <Text style={styles.areadysignup}>이미 가입된 회원이신가요?</Text>
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
  checkButton: {
    backgroundColor: 'lightblue',
    borderRadius: 5,
    marginLeft: 8,
    padding: 8,
  },
  checkButtonText: {
    color: 'black',
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
  },
  registerCheckButton: {
    width: '20%',
    height: 40,
    marginBottom: 16,
    marginLeft: 15,
    backgroundColor: 'skyblue',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  input1: {
    width: '75%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
  },
  genderButton: {
    width: 40, 
    height: 40,
    marginBottom: 16,
    marginLeft: 15,
    backgroundColor: 'transparent',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  genderButtonSelected: {
    width: 40, 
    height: 40,
    marginBottom: 16,
    marginLeft: 15,
    backgroundColor: 'skyblue',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

  genderButtonSelected1: {
    width: 40, 
    height: 40,
    marginBottom: 16,
    marginLeft: 15,
    backgroundColor: 'pink',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  
  genderButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },

  input2: {
    width: '68%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
  },
  backButton: {
    position: 'absolute',
    top: 100, // 원하는 위치로 조정하세요
    left: 100, // 원하는 위치로 조정하세요
  },
  

});

export default RegisterScreen;



