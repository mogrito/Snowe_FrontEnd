import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Image,
  Platform
} from 'react-native';
import {useNavigation, useRoute} from '@react-navigation/native';
import * as Font from 'expo-font';
import TransparentCircleButton from './TransparentCircleButton';
import backgroundImage from '../Images/dr1.png'; 
import * as ImagePicker from 'expo-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { getTokenFromLocal } from './TokenUtils';
import { FontAwesome5 } from '@expo/vector-icons';
import ModalSelector from 'react-native-modal-selector';
import { hasStartedLocationUpdatesAsync } from 'expo-location';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { List } from 'react-native-paper';
import axios from 'axios';



const TeacherVerifyScreen = () => {
    const [introduce, setIntroduce] = useState('');
    const [history, setHistory] = useState('');
    const [career, setCareer] = useState('');
    const [team, setTeam] = useState('');

    const [fontLoaded, setFontLoaded] = useState(false);
    const navigation = useNavigation();
    const URL = 'http://192.168.25.204:8080';
    const [imageUrl, setImageUrl] = useState('');
    const [licenseImageUrl, setLicenseImageUrl] = useState('');
    const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
    const [isSki, setIsSki] = useState(false);
    const [isBoard, setIsBoard] = useState(false);
    const [lessonClass, setLessonClass] = useState('');
    const [selectedLevel, setSelectedLevel] = useState('');
    const [showLevelButtons, setShowLevelButtons] = useState(false);
    const [selectedResortName, setSelectedResortName] = useState('');
    
    console.log('선택된스키장: ', selectedResortName);

    const skiResorts = [
      { 
        key: '1', 
        label: '지산 포레스트 리조트 스키장', 
      },
      { 
        key: '2', 
        label: '휘닉스 평창 스노우 파크', 
      },
      { 
        key: '3', 
        label: '알펜시아 리조트 스키장', 
      },
      { 
        key: '4', 
        label: '엘리시안 강촌스키장', 
      },
      { 
        key: '5', 
        label: '무주 덕유산 리조트스키장', 
      },
      { 
        key: '6', 
        label: '오크밸리 스키장', 
      },
      { 
        key: '7', 
        label: '에덴밸리 리조트스키장', 
      },
      { 
        key: '8', 
        label: '모나 용평리조트 스키장', 
      },
      { 
        key: '9', 
        label: '웰리힐리파크 스노우파크', 
      },
      { 
        key: '10', 
        label: '오투 리조트 스키장', 
      },
      { 
        key: '11', 
        label: '비발디파크 스키장', 
      },
      { 
        key: '12', 
        label: '곤지암 리조트 스키장', 
      },
      { 
        key: '13', 
        label: '하이원 리조트 스키장', 
      },
    ];

    const handleSelect = (option) => {
      setSelectedResortName(option.label);
    };

    console.log('이거야: ', selectedResortName);

    
    
    const onGoBack = () => {
      navigation.pop();
    };

    //스키장 이름 갖고오는거
    useEffect(() => {
      const fetchData = async () => {
        try {
          const resortName = await AsyncStorage.getItem('selectedResortName');
          console.log('resortName:',resortName);
          console.log('storage:',await AsyncStorage.getItem('selectedResortName'));
          setSelectedResortName(resortName);
        } catch (error) {
          console.error('Error fetching data from AsyncStorage:', error);
        }
      };

      fetchData();
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

    const handleSkiPress = () => {
      setLessonClass('스키');
      setShowLevelButtons(true);
      setIsSki(true);
      setIsBoard(false);
      if (lessonClass === '보드') {
        setSelectedLevel('');
      }
      if (showLevelButtons === true && isSki){
        setShowLevelButtons(false);
      }
    };
  
    const handleBoardPress = () => {
      setLessonClass('보드');
      setShowLevelButtons(true);
      setIsBoard(true);
      setIsSki(false);
      if(lessonClass === '스키'){
        setSelectedLevel('');
      }
      if (showLevelButtons === true && isBoard){
        setShowLevelButtons(false);
      }
    };

    const handleLevelPress = (level) => {
      setSelectedLevel(level);
      setShowLevelButtons(false);
    };
  
  
    // 변수명, API DB에 맞게 변경해야함
    const handleRegister = async () => {
      try {
        const token = await getTokenFromLocal();
        const authorizationHeader = `Bearer ${token}`;
    
        const formData = new FormData();
    
        // 요청보낼 body 설정
        const applyTeacher = {
          resortName: selectedResortName,  // 강사의 리조트명
          classification: lessonClass,     // 강사 종목
          classLevel: selectedLevel,       // 강사 레벨
          introduce: introduce,            // 한줄소개
          history: history,                // 약력
          career: career,                  // 경력
          team: team,                          // 소속
        }
    
        const json = JSON.stringify(applyTeacher);
        const applyBlob = new Blob([json], {
          type: 'application/json'
        });
        // 강사소개 요청
        formData.append('teacher', applyBlob);
    
        // 이미지 리스트
        const imageUrls = [imageUrl, licenseImageUrl];
    
        for (let i = 0; i < imageUrls.length; i++) {
          const fileUrl = imageUrls[i];
          const fileName = fileUrl.split('/').pop();
    
          // React Native에서 이미지를 blob으로 변환하는 방법
          const fileResponse = await fetch(fileUrl);
          const imageBlob = await fileResponse.blob();
    
          // FormData에 이미지 추가
          formData.append('image', imageBlob, fileName);
        }
    
        // 요청
        const response = await axios.post(`${URL}/member/apply`, formData, {
          headers: {
            'Authorization': authorizationHeader,
            'Content-Type': 'multipart/form-data'
          },
        });
    
        if (response.status === 200) {
          // 성공적인 응답
          alert('강사 신청이 완료되었습니다.');
          navigation.navigate('MainView');
        } else if (response.status === 500) {
          // 서버 오류 응답
          alert('서버 오류로 강사 신청이 실패했습니다.');
        }
      } catch (error) {
        console.error('Error:', error);
        alert('이미 신청된 내역이 존재합니다.');
      }
    
  
      // 상태 초기화
      setIntroduce('');
      setHistory('');
      setCareer('');
      setTeam('');    
      setLessonClass('');
      setSelectedLevel('');
      setSelectedResortName('');
      setShowLevelButtons(false);  

    };

  const uploadImage = async () => {
    //앱에 대한 권한 여부
    if (!status?.granted) {
      const permission = await requestPermission();
      if(!permission.granted){
        return null;
      } 
    }
    //이미지 업로드 기능
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
      aspect: [1, 1],
      multiple: true,
    });
    
    if(result.canceled){
      console.log('이미지 선택이 취소되었습니다');
      return null;
    }

    if (!result.canceled) {

      console.log("기본uri => " + result.uri);
      setImageUrl(result.uri);
   }

    setImageUrl(result.uri);
    console.log(result.uri); 
  };

  const uploadImage2 = async () => {
    //앱에 대한 권한 여부
    if (!status?.granted) {
      const permission = await requestPermission();
      if(!permission.granted){
        return null;
      } 
    }
    //이미지 업로드 기능
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: false,
      quality: 1,
      aspect: [1, 1],
      multiple: true,
    });
    
    if(result.canceled){
      console.log('이미지 선택이 취소되었습니다');
      return null;
    }

    setLicenseImageUrl(result.uri);
    console.log(result.uri); 

  };



  return (
    <View style={{flex:1}}>
      <Image source={backgroundImage} style={styles.backgroundImage} />
      <KeyboardAwareScrollView
        contentContainerStyle={styles.container}
      >
        <View style={styles.backButton}>
          <TransparentCircleButton
            onPress={onGoBack}
            name="left"
            color="#424242"
          />
        </View>
        {/* 배경 이미지 설정 */}
        <Text style={fontLoaded ? styles.title : {}}>강사 신청</Text>
        <View style={styles.subjectContainer}>
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

        {showLevelButtons && ( // showLevelButtons가 true일 때에만 레벨 버튼 표시
        <View style={styles.levelButtonsContainer}>
          <TouchableOpacity
            style={selectedLevel === 'Lv1' ? styles.Lv1levelButtonSelected : styles.levelButton}
            onPress={() => handleLevelPress('Lv1')}
          >
            <Text style={styles.levelButtonText}>Lv1</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={selectedLevel === 'Lv2' ? styles.Lv2levelButtonSelected : styles.levelButton}
            onPress={() => handleLevelPress('Lv2')}
          >
            <Text style={styles.levelButtonText}>Lv2</Text>
          </TouchableOpacity>

          <TouchableOpacity
            style={selectedLevel === 'Lv3' ? styles.Lv3levelButtonSelected : styles.levelButton}
            onPress={() => handleLevelPress('Lv3')}
          >
            <Text style={styles.levelButtonText}>Lv3</Text>
          </TouchableOpacity>
        </View>
      )}

        <View style={styles.skiResortInput}>
          <ModalSelector
            data={skiResorts}
            onChange={(option) => handleSelect(option)}
            initValue={selectedResortName || '스키장 선택'}
          >
            <TouchableOpacity>
            <Text>{selectedResortName || '스키장 선택'}</Text>
            </TouchableOpacity>
          </ModalSelector>
        </View>

        <TextInput
          style={styles.input1}
          placeholder="한줄 소개"
          value={introduce}
          onChangeText={(text) => setIntroduce(text)}
          multiline={true}
          textAlignVertical="top"
        />

        <TextInput
          style={styles.input}
          placeholder="약력"
          value={history}
          onChangeText={(text) => setHistory(text)}
          multiline={true}
        />

        <TextInput
          style={styles.input}
          placeholder="경력"
          value={career}
          onChangeText={(text) => setCareer(text)}
          multiline={true}
        />

        <TextInput
          style={styles.input1}
          placeholder="해당 소속"
          value={team}
          onChangeText={(text) => setTeam(text)}
          multiline={true}
        />
        <View style={styles.imageContainer}>
          <View style={styles.imageView}>
            <View style={styles.imageRow}>
              <TouchableOpacity 
                onPress={uploadImage} 
                style={styles.imageUpload}
              >
                <Text style={styles.imageText}>본인 사진 첨부</Text>
                <Image 
                  source={{ uri: imageUrl }} 
                  style={styles.image1}
                />
              </TouchableOpacity>
              <TouchableOpacity 
                onPress={uploadImage2} 
                style={styles.imageUpload}
              >
                <Text style={styles.imageText}>자격증 첨부</Text>
                <Image 
                  source={{ uri: licenseImageUrl }} 
                  style={styles.image2} 
                />
              </TouchableOpacity> 
            </View>       
          </View>
        </View>

        <TouchableOpacity 
          style={styles.registerButton} 
          onPress={handleRegister}
        >
          <Text style={styles.registerButtonText}>신청하기</Text>
        </TouchableOpacity>
      </KeyboardAwareScrollView>
     </View>
  );
};

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center',
      padding: 40,
      marginBottom:100,
      marginTop:80,
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
      fontSize: 30,
      fontWeight: 'bold',
      marginBottom: 20,
      color: 'black', 
      fontFamily: 'BalooRegular',
      textAlign:'center'
    },
    subjectContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
      width:'100%',
      marginRight:15
    },
    input: {
      width: '100%',
      height: 100,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 12,
      paddingHorizontal: 8,
      backgroundColor: 'rgba(255, 255, 255, 0.8)', 
    },
    input1:{
      width: '100%',
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 12,
      paddingHorizontal: 8,
      backgroundColor: 'rgba(255, 255, 255, 0.8)', 
    },
    skiResortInput:{
      width: '100%',
      height: 40,
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      marginBottom: 12,
      padding:10,
      paddingLeft:8,
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
      width:'100%'
    },
    imageView: {
      alignItems: 'center',
      justifyContent: 'center',
      left:-8,
    },
    imageContainer:{
      width:'100%',
      borderWidth: 1,
      borderColor: '#888888',
      borderRadius: 8,     
      backgroundColor:'white',
      padding:5,
      marginBottom:10
    },
    imageRow: {
      flexDirection: 'row',
      justifyContent: 'space-around',
      paddingBottom:5
    },
    imageText:{
      paddingBottom:15
    },
    imageUpload:{
      marginLeft:13
    },
    image1: {
      width: 170,
      height: 170,
    },    
    image2: {
      width: 170,
      height: 170,
      right:3
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
    levelButtonsContainer: {
      flexDirection: 'row',
      justifyContent: 'center',
      alignItems: 'center',
    },
    levelButton: {
      width: 42,
      height: 40,
      marginBottom: 16,
      margin:5,
      backgroundColor: 'transparent',
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    Lv1levelButtonSelected: {
      width: 42,
      height: 40,
      marginBottom: 16,
      margin: 5,
      backgroundColor: 'lightgreen', // 원하는 색상으로 변경
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    Lv2levelButtonSelected: {
      width: 42,
      height: 40,
      marginBottom: 16,
      margin: 5,
      backgroundColor: 'lightblue', // 원하는 색상으로 변경
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    Lv3levelButtonSelected: {
      width: 42,
      height: 40,
      marginBottom: 16,
      margin: 5,
      backgroundColor: 'lightpink', // 원하는 색상으로 변경
      borderColor: 'gray',
      borderWidth: 1,
      borderRadius: 5,
      justifyContent: 'center',
      alignItems: 'center',
    },
    levelButtonText: {
      color: 'black',
    },
  });
  

export default TeacherVerifyScreen;