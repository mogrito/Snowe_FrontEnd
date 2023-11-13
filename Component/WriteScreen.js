import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, KeyboardAvoidingView, View, Platform, Button, TextInput, Modal, Text, TouchableOpacity, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WriteHeader from './WriteHeader';
import ImagePicker2 from './ImagePicker2';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import TransparentCircleButton from './TransparentCircleButton';
import { getTokenFromLocal } from './TokenUtils';
import axios from 'axios';
import * as base64 from 'base-64';

const URL = 'http://192.168.25.204:8080';



function WriteScreen({ route }) {
  const log = route.params?.log;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigation = useNavigation();
  const bodyRef = useRef();
  const [date, setDate] = useState(log ? new Date(log.date) : new Date());
  const loginId = '정훈';
  const [category, setCategory] = useState(''); // 선택한 카테고리 상태
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('카테고리 선택');
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const [imageUri, setImageUri] = useState(null);
  const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentTime(new Date().toLocaleTimeString());
    }, 1000);

    return () => clearInterval(interval);
  }, []);

  const handleTitleChange = (text) => {
    setTitle(text);
  };

  const handleContentChange = (text) => {
    setContent(text);
  };

  const handleOpenModal = () => {
    setModalVisible(true);
  };

  const handleSelectCategory = (selectedType, buttonText) => {
    setCategory(selectedType);
    setSelectedCategory(buttonText);
    setModalVisible(false);
  };

  const onGoBack = () => {
    navigation.pop();
  };

  const onSave = async () => {
    try {

      //promise로 뜨는걸 storage에서 뽑아씀
      const token = await getTokenFromLocal();
      const authorizationHeader = `Bearer ${token}`;

      console.log("토큰값 : " + authorizationHeader);

      const formData = new FormData();
     
      // board지정
      const board = { title: title, content: content, category: category };

      if (!title) {
        alert('제목을 입력해주세요');
        return null;
      }
      if (!content) {
        alert('내용을 입력해주세요');
        return null;
      }
      if (!category) {
        alert('카테고리를 선택해주세요');
        return null;
      }
     
      const json = JSON.stringify(board);
      const boardBlob = new Blob([json], {
        type: 'application/json'
      });

      formData.append('board', boardBlob);
      

      // 파일 
      const filename = imageUri.split('/').pop();
      console.log("파일이름 => " + filename);

      const response = await fetch(imageUri);
      const imageBlob = await response.blob();
    
      formData.append('image', imageBlob, filename);


      console.log("board는?? => "+formData.get('board'));
      console.log("파일입니다 ==>> " + formData.get('image'));
      console.log("이미지블롭 : "+imageBlob);
      
      //요청
      axios.post(`${URL}/board/add`,formData,
        {
        	headers: {
          'Authorization': authorizationHeader,
          'Content-Type':'multipart/form-data'},
        }
      )

      console.log('새 글 작성 완료:', formData);
      navigation.goBack();
      } catch (error) {
        // 에러 처리
        console.error('글 작성 중 오류발생:', error);
    }
    };
  


  // 카메라에서 이미지를 가져올 함수
  const uploadImage = async () => {
    // 권한요청
    if(!status?.granted) {
      const permission = await requestPermission();
      if(!permission.granted) {
        return null;
      }
    }

    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.All,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    });
    // 이미지를 취소하지 않으면
    if (!result.canceled) {


       console.log("기본uri => " + result.uri);
       setImageUri(result.uri);
    }
  };


  return (
    <SafeAreaView style={styles.block}>
      <KeyboardAvoidingView
        style={styles.avoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* <WriteHeader
          onSave={onSave}
          date={date}
        /> */}
        <View style={styles.header}>
          <TransparentCircleButton
            onPress={onGoBack}
            name="left"
            color="#424242"
          />
          {/* <Text style={{marginTop:8}}>{currentTime}</Text> */}
          <TransparentCircleButton
            onPress={onSave}
            name="check"
            color="#009688"
          />
        </View>
        <View style={styles.category}>
          <TouchableOpacity onPress={handleOpenModal}>
            <Text style={{marginTop:2, backgroundColor: '#DBEBF9' }}>{selectedCategory}</Text>
          </TouchableOpacity>
          <TextInput
            placeholder="제목을 입력하세요"
            style={styles.titleInput}
            returnKeyType="next"
            onChangeText={handleTitleChange}
            value={title}
            onSubmitEditing={() => {
              bodyRef.current.focus();
            }}
          />
        </View>
        <TextInput
          placeholder="내용을 입력하세요"
          style={styles.bodyInput}
          multiline={true}
          textAlignVertical="top"
          onChangeText={handleContentChange}
          returnKeyType="next"
          value={content}
          ref={bodyRef}
        />
       {/* <View style={{ flex: 1, alignItems: 'left', justifyContent: 'center' }}> */}
          <TouchableOpacity onPress={uploadImage}>
            <MaterialIcons name='add-a-photo' size={30} color="black" />
            <Image source={{ uri: imageUrl }} style={{ width: 200, height: 200 }} />
          </TouchableOpacity>
        {/* </View> */}

        <Modal
          animationType="slide"
          transparent={true}
          visible={isModalVisible}
          onRequestClose={() => setModalVisible(false)}
        >
        <View style={styles.modalContainer}>
          <View style={styles.modalContent}>
            <Text>검색 대상을 선택하세요:</Text>
            <View style={styles.buttonContainer}>
              {loginId !== 'admin' && (
                <Button 
                  title="공지사항" 
                  onPress={() => handleSelectCategory('공지사항', '공지사항')} 
                  disabled={true} // 비활성화
                />
              )}
              {loginId === 'admin' && (
                <Button 
                  title="공지사항" 
                  onPress={() => handleSelectCategory('공지사항', '공지사항')} 
                />
              )}
            </View>
            <View style={styles.buttonContainer}>
              <Button title="자유게시판" onPress={() => handleSelectCategory('자유게시판', '자유게시판')} />
            </View>
            <View style={styles.buttonContainer}>
              <Button title="묻고 답하기" onPress={() => handleSelectCategory('묻고 답하기', '묻고 답하기')} />
            </View>
            <View style={styles.buttonContainer}>
              <Button title="💡꿀팁 공유" onPress={() => handleSelectCategory('꿀팁공유', '💡꿀팁 공유')} />
            </View>
            <View style={styles.buttonContainer}>
              <Button title="닫기" onPress={() => setModalVisible(false)} />
            </View>     
          </View>
        </View>
        </Modal>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
    paddingHorizontal: 16,
  },
  avoidingView: {
    flex: 1,
  },  
  header: {
    flexDirection:'row',
    justifyContent: 'space-between',
    paddingTop:5,
    paddingBottom:10
  },
  titleInput: {
    flex: 1,
    paddingVertical: 0,
    fontSize: 18,
    marginBottom: 16,
    marginLeft: 10,
    color: '#263238',
    fontWeight: 'bold',
  },
  bodyInput: {
    flex: 1,
    fontSize: 16,
    paddingVertical: 0,
    marginBottom:16,
    color: '#263238',
  },
  modalContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'rgba(0, 0, 0, 0.5)',    
  },
  modalContent: {
    backgroundColor: 'white',
    padding: 20,
    borderRadius: 10,
  },
  buttonContainer: {
    margin: 3, // 버튼 간의 상단 여백 조정
  },
  category:{
    flexDirection: 'row',
  }
});


export default WriteScreen;