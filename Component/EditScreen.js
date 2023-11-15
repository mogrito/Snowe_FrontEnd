import React, { useState } from 'react';
import { View, Text, TouchableOpacity , TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TransparentCircleButton from './TransparentCircleButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import { StyleSheet } from 'react-native';
import { getTokenFromLocal } from './TokenUtils';

const URL = 'http://192.168.25.204:8080';

function EditScreen({ route }) {
  const { title, content, boardId} = route.params;
  const navigation = useNavigation();
  const [editTitle, setEditTitle] = useState(title);
  const [editContent, setEditContent] = useState(content);

  const onGoBack = () => {
    navigation.pop();
  };

  const onSave = async () => {
    const editData = { title: editTitle, content: editContent, boardId };
    console.log(editData);
    try {
      const token = await getTokenFromLocal();
      const authorizationHeader = `Bearer ${token}`;
      const response = await fetch(`${URL}/board/edit/${boardId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': authorizationHeader,
        },
        body: JSON.stringify(editData),
      });
  
      if (response.ok) {
        const data = await response.text();
        console.log('글 수정 완료:', data);
        alert('수정이 완료되었습니다.');
        navigation.navigate('게시판으로 가기');
      } else {
        console.error('글 수정 실패:', response.status);
      }
    } catch (error) {
      console.error('글 수정 중 오류 발생:', error);
    }
  };




  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TransparentCircleButton
            onPress={onGoBack}
            name="left"
            color="black"
          />
        </View>
        <View>
          <Text style={{ fontSize: 20, color: 'black', paddingLeft:21 }}>글 수정</Text>
        </View>
        <View>
        <TouchableOpacity
          onPress={onSave}
          style={styles.saveButton}
        >
          <Text style={{ color: 'white', fontSize: 16 }}>저장</Text>
        </TouchableOpacity>
        </View>
      </View>
      <View>
        <View style={styles.editView}>
          <TextInput
            style={styles.input}
            value={editTitle}
            onChangeText={(text) => setEditTitle(text)}
            placeholder="제목을 입력하세요"
          />
        </View>
        <View style={styles.contentView}>
          <TextInput
            style={styles.input1}
            value={editContent}
            onChangeText={(text) => setEditContent(text)}
            placeholder="내용을 입력하세요"
            multiline={true}
            numberOfLines={4}
          />
        </View>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#F6FDFF'
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 5,
    paddingRight:8,
    justifyContent: 'space-between'
  },
  input: {
    padding: 16,
  },
  input1: {
    padding: 16,
    height: 200
  },
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
  },
  saveButton:{
    borderRadius: 10, // 버튼을 둥글게 만들기 위한 속성
    paddingVertical: 10,
    paddingHorizontal: 15,
    backgroundColor: 'skyblue', // 버튼 배경색
  },
  editView:{
    borderTopWidth:0.6,
    borderBottomWidth:0.6,
    borderColor:'#bbb'
  },
  contentView:{
    marginTop:10,
    maxHeight:250
  }
});

export default EditScreen;