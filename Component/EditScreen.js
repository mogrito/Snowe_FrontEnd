import React, { useState } from 'react';
import { View, Text, Button, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TransparentCircleButton from './TransparentCircleButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';

const URL = 'http://192.168.25.204:8080';

function EditScreen({ route }) {
  const { title: FirstTitle, content: FirstContent, boardId: FirstBoardId } = route.params;
  const navigation = useNavigation();
  const [title, setTitle] = useState(FirstTitle);
  const [content, setContent] = useState(FirstContent);
  const [boardId, setBoardId] = useState(FirstBoardId);

  const onGoBack = () => {
    navigation.pop();
  };

  const onSave = async () => {
    const editData = { title, content, boardId };
  
    try {
      const response = await fetch(`${URL}/board/edit/${boardId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(editData),
      });
  
      if (response.ok) {
        const data = await response.text();
        console.log('글 수정 완료:', data);
        navigation.navigate('게시판으로 가기');
      } else {
        console.error('글 수정 실패:', response.status);
      }
    } catch (error) {
      console.error('글 수정 중 오류 발생:', error);
    }
  };




  return (
    <SafeAreaView>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TransparentCircleButton
            onPress={onGoBack}
            name="left"
            color="#fff"
          />
        </View>
        <View>
          <Text style={{ fontSize: 20, color: '#fff' }}>글 수정</Text>
        </View>
        {/* <View>
          {boardId}
        </View> */}
      </View>
      <TextInput
        style={styles.input}
        value={title}
        onChangeText={(text) => setTitle(text)}
        placeholder="제목을 입력하세요"
      />
      <View style={styles.divider}></View>
      <TextInput
        style={styles.input}
        value={content}
        onChangeText={(text) => setContent(text)}
        placeholder="내용을 입력하세요"
        multiline={true}
        numberOfLines={4}
      />
      <Button
        title="저장"
        onPress={onSave}
      />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#009688',
  },
  input: {
    padding: 16,
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: '#ddd',
  },
});

export default EditScreen;