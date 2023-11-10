import { useNavigation } from '@react-navigation/native';
import React, { useEffect, useState, useRef } from 'react';
import { StyleSheet, KeyboardAvoidingView, View, Platform, Button, TextInput, Modal, Text, TouchableOpacity, Pressable, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { MaterialIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import TransparentCircleButton from './TransparentCircleButton';
import base64 from 'base64-js';

const URL = 'http://192.168.25.204:8080';

function WriteScreen({ route }) {
  const log = route.params?.log;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigation = useNavigation();
  const bodyRef = useRef();
  const [date] = useState(log ? new Date(log.date) : new Date());
  const loginId = '정훈';
  const [category, setCategory] = useState(''); // 선택한 카테고리 상태
  const [isModalVisible, setModalVisible] = useState(false);
  const [selectedCategory, setSelectedCategory] = useState('게시판 선택');
  const [status, requestPermission] = ImagePicker.useMediaLibraryPermissions();
  const [imageUrl, setImageUrl] = useState('');
  // const [currentTime, setCurrentTime] = useState(new Date().toLocaleTimeString());
  
  // useEffect(() => {
  //   const interval = setInterval(() => {
  //     setCurrentTime(new Date().toLocaleTimeString());
  //   }, 1000);

  //   return () => clearInterval(interval);
  // }, []);

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
      const postData = { title: title, content: content, loginId: loginId, category: category };

      const formData = new FormData();
      formData.append('board', JSON.stringify(postData));

      // 이미지가 선택되었는지 확인
      if (imageUrl) {
        // Base64 데이터를 Blob으로 변환
        const byteCharacters = base64.decode(imageUrl.split(',')[1]);
        const byteArray = new Uint8Array(byteCharacters.length);
        console.log(byteCharacters);

        for (let i = 0; i < byteCharacters.length; i++) {
          byteArray[i] = byteCharacters.charCodeAt(i);
        }

        const blob = new Blob([byteArray], { type: 'image/png' });
        const blob2 = new Blob([byteArray], { type: 'image/png' });

        console.log('블롭:', blob);
        const uriParts = imageUrl.split('/');
        const fileName = uriParts[uriParts.length - 1];

        formData.append('image', blob, fileName);
      }

      console.log(formData.get('image', imageUrl));
      console.log(formData.get('board'));
      console.log('이미지: ' ,formData.get('image'));

      const response = await fetch(`${URL}/board/add`, {
        method: 'POST',
        body: formData,
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const data = await response.json();
      console.log('새 글 작성 완료:', data);
      navigation.goBack();
    } catch (error) {
      console.error('글 작성 중 오류발생:', error);
    }
  };

  const uploadImage = async () => {
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
      aspect: [1, 1]
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
    // console.log(result.filename); 
  // 추출한 uri에서 파일 이름을 가져오는 방법
  // const uriComponents = result.uri.split('/');
  // const filename = uriComponents[uriComponents.length - 1];
  // console.log('이미지 파일 이름:', filename);
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
