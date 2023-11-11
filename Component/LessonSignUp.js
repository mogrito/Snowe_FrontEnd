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
  Platform,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import * as Font from 'expo-font';
import TransparentCircleButton from './TransparentCircleButton';
import { TextInputMask } from 'react-native-masked-text'

// 이미지를 import 합니다.
import backgroundImage from '../Images/dr1.png'; 
import { SafeAreaView } from 'react-native-safe-area-context';


const LessonSignUpScreen = () => {

  const [lessonname, setLessonname] = useState('');
  const [startday, setStartday] = useState('');
  const [endday, setEndday] = useState('');
  const [level, setLevel] = useState('');
  const [startlessontime, setStartLessontime] = useState('');
  const [endlessontime, setEndLessontime] = useState('');
  const [ampm,setAmPm] = useState('');
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
      const response = await fetch(`${URL}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          lessonname: lessonname,
          startday: startday,
          endday: endday,
          level:level,
          startlessontime: startlessontime,
          endlessontime: endlessontime, 
          ampm:ampm,
        }),
      });

      if (response.ok) {
        // 등록 성공
        alert('강습 등록이 완료되었습니다.');
        navigation.navigate('MainView');
      } else {
        // 등록 실패
        alert('강습 등록이 실패했습니다.');
      }
    } catch (error) {
      console.error('Error:', error);
      alert('강습 정보를 입력해주세요');
    }
  };

  return (
    <KeyboardAvoidingView
      behavior={Platform.OS === 'ios' ? 'padding' : null}
      style={{ flex: 1 }}
    >
      <Image source={backgroundImage} style={styles.backgroundImage} />
      <View style={styles.topBar}>
        <TransparentCircleButton onPress={onGoBack} name="left" color="#424242" />
      </View>
      <ScrollView contentContainerStyle={styles.container}>
        {/* 배경 이미지 설정 */}
        <Text style={fontLoaded ? styles.title : {}}>강습 등록</Text>
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input2}
            placeholder="강습명"
            value={lessonname}
            onChangeText={(text) => setLessonname(text)}
          />
          <View style={styles.inputContainer1}>
            <TouchableOpacity
              style={level === '초급' ? styles.levelButtonSelected : styles.selectedButton}
              onPress={() => setLevel('초급')}
            >
              <Text style={styles. levelButtonText}>초급</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={level === '중급' ? styles.levelButtonSelected : styles.selectedButton}
              onPress={() => setLevel('중급')}
            >
              <Text style={styles. levelButtonText}>중급</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={level === '고급' ? styles.levelButtonSelected : styles.selectedButton}
              onPress={() => setLevel('고급')}
            >
              <Text style={styles. levelButtonText}>고급</Text>
            </TouchableOpacity>
          </View>
        </View>

        <View style={styles.inputContainer2}>
          <TextInputMask
            style={styles.dateinput}
            type={'datetime'}
            placeholder="시작일 (YYYY-MM-DD)"
            options={{
              format: 'YYYY-MM-DD'
            }}
            value={startday}
            onChangeText={(text) => setStartday(text)}
          />
             <Text style={styles.mulfont}>~</Text>
          <TextInputMask
            style={styles.dateinput1}
            type={'datetime'}
            placeholder="종료일 (YYYY-MM-DD)"
            options={{
              format: 'YYYY-MM-DD'
            }}
            value={endday}
            onChangeText={(text) => setEndday(text)}
          />
        </View>

        <View style={styles.inputContainer}>
        <TextInputMask
            style={styles.inputlesson}
            type={'datetime'}
            placeholder="시작 시간"
            value={startlessontime}
            options={{
              format: 'HH:MM'
            }}
            onChangeText={(text) => setStartLessontime(text)}
          />
          <Text style={styles.mulfont1}>~</Text>
          <TextInputMask
            style={styles.inputlesson1}
            type={'datetime'}
            placeholder="종료 시간"
            value={endlessontime}
            options={{
              format: 'HH:MM'
            }}
            onChangeText={(text) => setEndLessontime(text)}
          />

          <View style={styles.inputContainer1}>
            <TouchableOpacity
              style={ampm === '오전' ? styles.levelButtonSelected : styles.selectedButton}
              onPress={() => setAmPm('오전')}
            >
              <Text style={styles. levelButtonText}>오전</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={ampm === '오후' ? styles.levelButtonSelected : styles.selectedButton}
              onPress={() => setAmPm('오후')}
            >
              <Text style={styles. levelButtonText}>오후</Text>
            </TouchableOpacity>
          </View>
        </View>


        <TouchableOpacity style={styles.registerButton} onPress={handleRegister}>
          <Text style={styles.registerButtonText}>등록하기</Text>
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
    marginBottom:150,
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
    fontSize: 25,
    fontWeight: 'bold',
    marginBottom: 20,
    marginTop: 90,
    color: 'black', 
    fontFamily: 'DMSerifText1',
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
  selectedButton: {
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
  
  levelButtonSelected: {
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

  levelButtonText: {
    color: 'black',
    fontWeight: 'bold',
  },

  input2: {
    width: '52%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
  },

  dateinput: {
    width: '45%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
  },
  dateinput1: {
    width: '45%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
    marginLeft:6,
  },
  inputContainer1: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '48%',
    marginBottom: 0,
  },
  inputContainer2: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 0,
  },
  lessontimeContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '100%',
    marginBottom: 0,
    marginRight:26,

  },
  timeinput: {
    width: '%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
    marginLeft:13,
  },
  timeinput1: {
    width: '29%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
    marginLeft:6,
  },
  parttimeButtonSelected:{
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
    marginLeft:16,
  },
  parttimeButtonSelected1:{
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
  mulfont:{
    fontSize:30,
    marginBottom:15,
    marginLeft:8,
  },
  mulfont1:{
    fontSize:30,
    marginBottom:15,
    marginLeft:12,
  },
  title1: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center', 
    marginTop: 50,
    marginRight:30,
  },
  inputlesson:{
    width: '28%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 

  },
  inputlesson1:{
    width: '28%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
    marginLeft:10,

  },

});

export default LessonSignUpScreen;



