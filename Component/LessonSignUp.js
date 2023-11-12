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
  Modal,
} from 'react-native';
import {useNavigation} from '@react-navigation/native';
import * as Font from 'expo-font';
import TransparentCircleButton from './TransparentCircleButton';
import { TextInputMask } from 'react-native-masked-text' 
import { Calendar } from 'react-native-calendars';
import backgroundImage from '../Images/dr1.png'; 
import { FontAwesome5 } from '@expo/vector-icons';
import { max } from 'date-fns';


const LessonSignUpScreen = () => {

  const [lessonname, setLessonname] = useState('');
  const [startday, setStartday] = useState('');
  const [endday, setEndday] = useState('');
  const [level, setLevel] = useState('');
  const [startlessontime, setStartLessontime] = useState('');
  const [endlessontime, setEndLessontime] = useState('');
  const [ampm,setAmPm] = useState('');
  const [fontLoaded, setFontLoaded] = useState(false);
  const [maxReserveCount, setMaxReserveCount] = useState('');
  const [isSki, setIsSki] = useState(false);
  const [isBoard, setIsBoard] = useState(false);
  const [lessonClass, setLessonClass] = useState('');
  const [isCalendarModalVisible, setCalendarModalVisible] = useState(false);
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
          maxReserveCount:parseInt(maxReserveCount),
          lessonClass:lessonClass,
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
  const handleSkiPress = () => {
    setLessonClass('스키');
    setIsSki(true);
    setIsBoard(false);
  };

  const handleBoardPress = () => {
    setLessonClass('보드');
    setIsBoard(true);
    setIsSki(false);
  };


  const onDayPress = (day) => {
    if (!startday || (startday && endday)) {
      // 시작일이 비어 있거나 이미 시작일과 종료일이 선택되어 있을 때
      setStartday(day.dateString);
      setEndday('');
    } else if (day.dateString >= startday) {
      // 종료일이 시작일 이후이거나 같은 경우
      setEndday(day.dateString);
      setCalendarModalVisible(false); // 선택 후 모달 닫기
    } else {
      // 선택한 날짜가 시작일보다 이전이면 시작일을 변경
      setStartday(day.dateString);
      setEndday('');
    }
  };

  const openCalendarModal = () => {
    setCalendarModalVisible(true);
  };

  const closeCalendarModal = () => {
    setCalendarModalVisible(false);
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
          <View style={styles.iconContainer1}>
            <TouchableOpacity
              style={isSki ? styles.skiButtonSelected : styles.selectedButton}
              onPress={handleSkiPress}
            >
              <FontAwesome5 name="skiing" size={20} color={isSki ? 'white' : 'gray'} />
            </TouchableOpacity>

            <TouchableOpacity
              style={isBoard ? styles.boardButtonSelected : styles.selectedButton}
              onPress={handleBoardPress}
            >
              <FontAwesome5 name="snowboarding" size={20} color={isBoard ? 'white' : 'gray'} />
            </TouchableOpacity>
          </View>
          <View style={styles.iconContainer2}>
            <TextInput
              style={styles.input3} 
              placeholder="강습 인원 수"
              value={maxReserveCount}
              onChangeText={(text) => setMaxReserveCount(text)}
              keyboardType="numeric"
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputContainer1_1}>
            <TouchableOpacity
              style={level === '초급' ? styles.levelButtonSelected : styles.selectedLessonButton}
              onPress={() => setLevel('초급')}
            >
              <Text style={styles. levelButtonText}>초급</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={level === '중급' ? styles.levelButtonSelected : styles.selectedLessonButton}
              onPress={() => setLevel('중급')}
            >
              <Text style={styles. levelButtonText}>중급</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={level === '고급' ? styles.levelButtonSelected : styles.selectedLessonButton}
              onPress={() => setLevel('고급')}
            >
              <Text style={styles. levelButtonText}>고급</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer1_2}>
            <TextInput
              style={styles.input2}
              placeholder="강습명"
              value={lessonname}
              onChangeText={(text) => setLessonname(text)}
            />
          </View>
        </View>

        <View style={styles.inputContainer}>
          <TouchableOpacity style={styles.dateinput} onPress={openCalendarModal}>
            <Text>
              {startday
                ? `시작일: ${startday}`
                : '시작일과 종료일 선택'}
            </Text>
          </TouchableOpacity>
          <Text style={styles.mulfont1}>~</Text>
          <TouchableOpacity style={styles.dateinput} onPress={openCalendarModal}>
            <Text>
              {endday
                ? `종료일: ${endday}`
                : '시작일과 종료일 선택'}
            </Text>
          </TouchableOpacity>
          <Modal visible={isCalendarModalVisible} animationType="slide">
            <Calendar
              markedDates={{
                [startday]: { selected: true, startingDay: true, color: 'skyblue' },
                [endday]: { selected: true, endingDay: true, color: 'skyblue' },
              }}
              onDayPress={onDayPress}
              style={{marginTop:50}}
            />
            <TouchableOpacity onPress={closeCalendarModal}>
              <Text style={{ color: 'blue', textAlign: 'center', marginVertical: 10 }}>
                달력 닫기
              </Text>
            </TouchableOpacity>
          </Modal>
        </View>

        <View style={styles.inputContainer}>
          <View style={styles.inputContainer2_1}>
            <TouchableOpacity
              style={ampm === '오전' ? styles.levelButtonSelected : styles.selectedDivButton}
              onPress={() => setAmPm('오전')}
            >
              <Text style={styles. levelButtonText}>오전</Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={ampm === '오후' ? styles.levelButtonSelected : styles.selectedDivButton}
              onPress={() => setAmPm('오후')}
            >
              <Text style={styles. levelButtonText}>오후</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.inputContainer2_2}>
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
              style={styles.inputlesson}
              type={'datetime'}
              placeholder="종료 시간"
              value={endlessontime}
              options={{
                format: 'HH:MM'
              }}
              onChangeText={(text) => setEndLessontime(text)}
            />
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
    ...Platform.select({
      web: {
        alignSelf:'center'
      },
    }),
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
    marginLeft:13,
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
  selectedLessonButton: {
    width: 40, 
    height: 40,
    marginBottom: 16,
    marginLeft: 7,
    backgroundColor: 'transparent',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },
  selectedDivButton: {
    width: 40, 
    height: 40,
    marginBottom: 16,
    marginLeft:7,
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
    marginLeft: 7,
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
    width: '87.2%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
    marginLeft:19,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
  },
  input3: {
    width: '87.2%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 16,
    marginLeft:16,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
  },

  dateinput: {
    width: '43.6%',
    height: 40,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    marginBottom: 12,
    paddingHorizontal: 8,
    backgroundColor: 'rgba(255, 255, 255, 0.8)', 
    padding:9
  },
  inputContainer1_1: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '38%',
  },
  inputContainer1_2: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '62%',
    marginLeft:5
  },
  inputContainer2_1: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '30%',
  },
  inputContainer2_2: {
    flexDirection: 'row',
    alignItems: 'center',
    width: '70%',
    marginLeft:4
  },
  iconContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width:'100%',
  },
  iconContainer1: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width:'38%',
  },
  iconContainer2: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    width:'62%',
    marginLeft:2
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
    marginRight:12,
  },
  topBar: {
    flexDirection: 'row',
    alignItems: 'center', 
    marginTop: 50,
    marginRight:30,
  },
  inputlesson:{
    width: '40%',
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
  },
  skiButtonSelected: {
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
  boardButtonSelected: {
    width: 40,
    height: 40,
    marginBottom: 16,
    marginLeft: 15,
    backgroundColor: 'green', // 원하는 색상으로 변경
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    justifyContent: 'center',
    alignItems: 'center',
  },

});

export default LessonSignUpScreen;



