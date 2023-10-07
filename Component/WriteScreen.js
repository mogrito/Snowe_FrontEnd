import { useNavigation } from '@react-navigation/native';
import React, { useContext, useState } from 'react';
import { Alert, StyleSheet, KeyboardAvoidingView, Platform } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import axios from 'axios'; // axios를 임포트

import WriteEditor from './WriteEditor';
import WriteHeader from './WriteHeader';
import LogContext from '../context/LogContext';

function WriteScreen({ route }) {
  const log = route.params?.log;
  const logContext = useContext(LogContext);

  if (!logContext || !logContext.onCreate) {
    console.error('LogContext 또는 onCreate 메서드를 찾을 수 없습니다.');
    return null;
  }

  const [title, setTitle] = useState(log?.title ?? '');
  const [body, setBody] = useState(log?.body ?? '');
  const navigation = useNavigation();
  const [date, setDate] = useState(log ? new Date(log.date) : new Date());

  const { onCreate, onModify, onRemove } = useContext(LogContext);

  const onSave = async () => {
    const url = 'http://192.168.25.212:8080/board/list'; // 스프링 부트 API 엔드포인트 URL
  
    // 요청할 데이터 객체 생성 (여기에 원하는 데이터를 추가하세요)
    const data = {
      title: 'title',
      content: 'content',
    };
  
    try {
      const response = await fetch(url, {
        method: 'POST', // POST 요청
        headers: {
          'Content-Type': 'application/json', // JSON 데이터를 보낼 경우 Content-Type 설정
        },
        body: JSON.stringify(data), // 데이터 객체를 JSON 문자열로 변환하여 보냄
      });
  
      if (response.ok) {
        // 서버로부터 응답이 성공인 경우
        const responseData = await response.json(); // 서버 응답 데이터를 JSON으로 파싱
        console.log('서버 응답 데이터:', responseData);
        alert(responseData);
        // 필요한 작업을 수행하거나 응답 데이터를 처리하세요.
      } else {
        // 서버로부터 응답이 실패인 경우
        console.error('서버 응답 오류:', response.status, response.statusText);
        alert('실패');
        // 오류 처리 또는 사용자에게 알림을 표시하는 등의 작업을 수행하세요.
      }
    } catch (error) {
      // 네트워크 오류 또는 기타 오류 처리
      console.error('오류:', error);
      alert('오류');
      // 오류 처리 또는 사용자에게 알림을 표시하는 등의 작업을 수행하세요.
    }
  };

  // const onSave = () => {
  //   if (log) {
  //     onModify({
  //       id: log.id,
  //       date: date.toISOString(),
  //       title,
  //       body,
  //     });
  //   } else {
  //     onCreate({
  //       title,
  //       body,
  //       date: date.toISOString(),
  //     });
  //   }
  //   navigation.pop();
  // };

  const onAskRemove = () => {
    Alert.alert(
      '삭제',
      '정말로 삭제하시겠어요?',
      [
        { text: '취소', style: 'cancel' },
        {
          text: '삭제',
          onPress: () => {
            onRemove(log?.id);
            navigation.pop();
          },
          style: 'destructive',
        },
      ],
      {
        cancelable: true,
      }
    );
  };

  return (
    <SafeAreaView style={styles.block}>
      <KeyboardAvoidingView
        style={styles.avoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}>
        <WriteHeader
          onSave={onSave}
          onAskRemove={onAskRemove}
          isEditing={!!log}
          date={date}
          onChangeDate={setDate}
        />
        <WriteEditor
          title={title}
          body={body}
          onChangeTitle={setTitle}
          onChangeBody={setBody}
        />
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  block: {
    flex: 1,
    backgroundColor: 'white',
  },
  avoidingView: {
    flex: 1,
  },
});

export default WriteScreen;
