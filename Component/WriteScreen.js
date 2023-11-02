import { useNavigation } from '@react-navigation/native';
import React, { useState, useRef,useEffect } from 'react';
import { Alert, StyleSheet, KeyboardAvoidingView, View, Platform, TextInput} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import WriteHeader from './WriteHeader';



function WriteScreen({ route }) {
  const log = route.params?.log;
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const navigation = useNavigation();
  const bodyRef = useRef();
  const [date, setDate] = useState(log ? new Date(log.date) : new Date());
  const loginId = '정훈';


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
    fetch('http://192.168.25.204:8080/board/add', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    })
      .then((response) => response.text())
      .then((data) => {
        console.log('새 글 작성완료:', data);
        // 글 작성이 성공하면 원하는 작업을 수행하거나 화면을 전환합니다.
        navigation.goBack(); // 예를 들어 글 작성 후 뒤로 돌아가기
      })
      .catch((error) => {
        console.error('글 작성 중 오류발생:', error);
        // 오류 처리 또는 사용자에게 알림을 표시하는 등의 작업을 수행합니다.
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
