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
import {useNavigation} from '@react-navigation/native';
import * as Font from 'expo-font';
import TransparentCircleButton from './TransparentCircleButton';
import backgroundImage from '../Images/dr1.png'; 
import * as ImagePicker from 'expo-image-picker';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';



const TeacherVerifyScreen = () => {
    const [introduce, setIntroduce] = useState('');
    const [history, setHistory] = useState('');
    const [career, setCareer] = useState('');
    const [team, setTeam] = useState('해당 소속 : ');

    const [username, setUsername] = useState('');
    const [name, setName] = useState('');
    const [password, setPassword] = useState('');
    const [birthday, setBirthday] = useState('');
    const [email, setEmail] = useState('');
    const [nickname, setNickname] = useState('');
    const [fontLoaded, setFontLoaded] = useState(false);
    const navigation = useNavigation();
    const URL = 'http://192.168.219.103:8080';
    const [imageUrl, setImageUrl] = useState('');
    const [licenseImageUrl, setLicenseImageUrl] = useState('');
    const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();

    
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
  
  
    // 변수명, API DB에 맞게 변경해야함
    const handleRegister = async () => {
      try {

        const response = await fetch(`${URL}/member/members`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            introduce: introduce, // 한줄소개
            history: history, // 약력
            career: career, // 경력
            team: team, // 소속

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
      setIntroduce('');
      setHistory('');
      setCareer('');
      setTeam('');      

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

      const selectedImageUri = result.uri;

      // file:// 를 제거하고 실제 파일 경로만 얻기
      const realFilePath = selectedImageUri.replace("file://", "");
      console.log("실제 파일 경로:", realFilePath);
    
    if(result.canceled){
      console.log('이미지 선택이 취소되었습니다');
      return null;
    }
    console.log(result);
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

      const selectedImageUri = result.uri;

      // file:// 를 제거하고 실제 파일 경로만 얻기
      const realFilePath = selectedImageUri.replace("file://", "");
      console.log("실제 파일 경로:", realFilePath);
    
    if(result.canceled){
      console.log('이미지 선택이 취소되었습니다');
      return null;
    }
    console.log(result);
    setLicenseImageUrl(result.uri);
    console.log(result.uri); 
  };


  return (
    <View style={{ flex: 1 }}>
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
      fontFamily: 'DMSerifText1',
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
  });
  

export default TeacherVerifyScreen;