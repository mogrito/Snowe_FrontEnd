import {useNavigation} from '@react-navigation/native';
import React, {useContext, useState} from 'react';
import {Alert, StyleSheet, KeyboardAvoidingView, Platform} from 'react-native';
import {SafeAreaView} from 'react-native-safe-area-context';
import WriteEditor from './WriteEditor';
import WriteHeader from './WriteHeader';
import LogContext from '../context/LogContext';

function WriteScreen({route}) {
  // 옵셔널 체이닝 문법
  const log = route.params?.log; // --> route.params ? route.params.log : undefined

  const logContext = useContext(LogContext);

    // onCreate 메서드가 있는지 확인
  if (!logContext || !logContext.onCreate) {
     console.error("LogContext 또는 onCreate 메서드를 찾을 수 없습니다.");
     return null; // 또는 오류 처리를 수행하십시오.
   }

  // 글의 제목과 내용과 날짜를 상태로 관리
  const [title, setTitle] = useState(log?.title ?? ''); // --> useState(log ? log.title : '')
  const [body, setBody] = useState(log?.body ?? '');
  const navigation = useNavigation();
  const [date, setDate] = useState(log ? new Date(log.date) : new Date());

  const {onCreate, onModify, onRemove} = useContext(LogContext);

  //글저장함수
  const onSave = () => {
    if (log) {
      onModify({
        // 글 수정 중인 경우
        id: log.id,
        // date: log.date,
        date: date.toISOString(),
        title,
        body,
      });
    } else {
      onCreate({
        title,
        body,
        // 날짜를 문자열로 변환
        // date: new Date().toISOString(),
        date: date.toISOString(),
      });
    }
    navigation.pop();
  };

  const onAskRemove = () => {
    Alert.alert(
      '삭제',
      '정말로 삭제하시겠어요?',
      [
        {text: '취소', style: 'cancel'},
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
      },
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
          isEditing={!!log}  // 글 수정 중인지 여부 확인
          date={date}
          onChangeDate={setDate} //날짜 변경 함수
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