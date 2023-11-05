import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState, useRef } from 'react';
import { StyleSheet, KeyboardAvoidingView, Platform, TextInput } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WriteHeader from './WriteHeader';
import LogContext from '../context/LogContext';
import ImagePicker2 from './ImagePicker2';
import { Picker } from '@react-native-picker/picker'; 

const URL = 'http://192.168.25.204:8080';

function WriteScreen({ route }) {
  const log = route.params?.log;
  const logContext = useContext(LogContext);

  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigation = useNavigation();
  const bodyRef = useRef();
  const [date, setDate] = useState(log ? new Date(log.date) : new Date());
  const loginId = '정훈';
  const [category, setCategory] = useState(''); // 선택한 카테고리 상태

  const handleCategoryChange = (categoryValue) => {
    setCategory(categoryValue);
  };

  const handleTitleChange = (text) => {
    setTitle(text);
  };

  const handleContentChange = (text) => {
    setContent(text);
  };

  const onSave = () => {
    // 여기서 서버로 데이터를 전송합니다.
    const postData = { title, content, loginId };

    // POST 요청을 보내는 논리를 구현합니다.
    fetch(`${URL}/board/add`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    })
      .then((response) => response.text())
      .then((data) => {
        console.log('새 글 작성완료:', data);
        navigation.goBack(); 
      })
      .catch((error) => {
        console.error('글 작성 중 오류발생:', error);
      });
  };

  return (
    <SafeAreaView style={styles.block}>
      <KeyboardAvoidingView
        style={styles.avoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <WriteHeader
          onSave={onSave}
          date={date}
          onChangeDate={setDate}
        />
        <Picker
          selectedValue={category}
          onValueChange={handleCategoryChange}
        >
          <Picker.Item label="Select a category" value="" />
          <Picker.Item label="Category 1" value="category1" />
          <Picker.Item label="Category 2" value="category2" />
        </Picker>
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
        <ImagePicker2 />
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
  titleInput: {
    paddingVertical: 0,
    fontSize: 18,
    marginBottom: 16,
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
});

export default WriteScreen;
