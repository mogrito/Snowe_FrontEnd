import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, KeyboardAvoidingView, View, Platform, Button, TextInput, Modal, Text, TouchableOpacity, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import TransparentCircleButton from './TransparentCircleButton';
import { getTokenFromLocal } from './TokenUtils';
import axios from 'axios';

const URL = 'http://192.168.25.204:8080';



function WriteScreen({ route }) {
  const log = route.params?.log;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigation = useNavigation();
  const bodyRef = useRef();
  const [date, setDate] = useState(log ? new Date(log.date) : new Date());
  const [category, setCategory] = useState(''); // 선택한 카테고리 상태
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('카테고리 선택');
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const [imageUrl, setImageUrl] = useState(null);
  const [role, setRole] = useState('');
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

      if (imageUrl) {
        // 파일 
        const filename = imageUrl.split('/').pop();
        console.log("파일이름 => " + filename);


        const response = await fetch(imageUrl);
        const imageBlob = await response.blob();

        formData.append('image', imageBlob, filename);
      }

      //요청
      axios.post(`${URL}/board/add`, formData,
        {
          headers: {
            'Authorization': authorizationHeader,
            'Content-Type': 'multipart/form-data'
          },
        }
      )

      console.log('새 글 작성 완료:', formData);
      navigation.pop();
    } catch (error) {
      // 에러 처리
      console.error('글 작성 중 오류발생:', error);
    }
  };



  // 카메라에서 이미지를 가져올 함수
  const uploadImage = async () => {
    // 권한요청
    if (!status?.granted) {
      const permission = await requestPermission();
      if (!permission.granted) {
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
      setImageUrl(result.uri);
    }
  };
  useEffect(() => {
    fetchGetToken();
  }, []);

  const fetchGetToken = async () => {
    try {
      const token = await getTokenFromLocal();
      const authorizationHeader = `Bearer ${token}`;

      const response = await fetch(`${URL}/board/view/token-check`, {
        method: 'GET',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authorizationHeader,
        }
      });

      const tokenData = await response.json();
      console.log(tokenData); // 게시글 정보 확인

      // 게시글 데이터에서 필요한 정보 추출
      const role = tokenData.role;
      console.log(role);
      setRole(role);

    } catch (error) {
      console.error(error);
    }
  };


  return (
    <View style={styles.block}>
       <View style={styles.header}>
          <TransparentCircleButton
            onPress={onGoBack}
            name="left"
            color="#424242"
          />
          <Text style={styles.headertitle}>글 쓰기</Text>
          {/* <Text style={{marginTop:8}}>{currentTime}</Text> */}
          <TransparentCircleButton
            onPress={onSave}
            name="check"
            color="#009688"
          />
        </View>
        <View style={styles.borderLine1}></View>
      <KeyboardAvoidingView
        style={styles.avoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        {/* <WriteHeader
          onSave={onSave}
          date={date}
        /> */}
        <View style={styles.category}>
          <TouchableOpacity onPress={handleOpenModal}>
            <Text style={{ marginTop: 2, backgroundColor: '#DBEBF9' }}>{selectedCategory}</Text>
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
        <Image source={{ uri: imageUrl }} style={{ width: 50, height: 50, marginBottom: 40 }} />
        <View style={{ alignItems: 'center' }}>
          <View style={styles.borderLine}></View>
        </View>

        <TouchableOpacity style={styles.imageContainer} onPress={uploadImage}>
          <Image
            source={require('../Images/photo.png')}
            style={styles.iconImage}
          />
          <Text style={styles.iconText}>사진</Text>
        </TouchableOpacity>

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
                {role !== 'ADMIN' && (
                  <Button
                    title="공지사항"
                    onPress={() => handleSelectCategory('공지사항', '공지사항')}
                    disabled={true}
                  />
                )}
                {role === 'ADMIN' && (
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
                <Button title="묻고 답하기" onPress={() => handleSelectCategory('묻고답하기', '묻고 답하기')} />
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
    </View>

  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
    paddingTop: 50, // 
  },
  avoidingView: {
    flex: 1,
    paddingHorizontal: 16,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingTop: 5,
    paddingLeft:10,
    paddingRight:20,
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
    marginBottom: 16,
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
  category: {
    flexDirection: 'row',
  },
  imageContainer: {
    marginBottom: 50,
    width: 33,
    height: 33,
    flexDirection: 'row',
     alignItems: 'center', 
    
  },
  borderLine: {
    borderTopWidth: 0.3,
    borderTopColor: 'gray',
    marginTop: '5%',
    marginBottom: 10,
    flexDirection: 'row',
    width: '120%',
  },
  iconImage:{
    width:25,
    height:25,

  },
  iconText: {
    width:25,
    marginLeft: 5, // 이미지와 텍스트 사이의 간격 조절

  },
  headertitle:{
    fontSize:20,
    fontWeight:'bold',
    paddingLeft:4,
  },
  borderLine1: {
    borderTopWidth: 0.3,
    borderTopColor: 'gray',
    marginTop:10,
    marginBottom: 20,
    flexDirection: 'row',
    width: '120%',
  },
  borderLine2: {
    borderTopWidth: 0.3,
    borderTopColor: 'gray',
    marginTop:0,
    marginBottom: 20,
    flexDirection: 'row',
    width: '100%',
  },
  

});


export default WriteScreen;