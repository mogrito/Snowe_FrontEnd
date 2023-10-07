import React, { useState } from 'react';
import { View, Text, Button, FlatList, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TransparentCircleButton from './TransparentCircleButton';
import { SafeAreaView } from 'react-native';

function PostView({ route }) {
  const { title, content, writer } = route.params;
  const navigation = useNavigation();
  const [comments, setComments] = useState([]); // 댓글 데이터를 관리하는 상태

  const onGoBack = () => {
    navigation.pop();
  };

  const handleEditPress = () => {
    navigation.navigate('게시글 수정', {
      title,
      content,
      writer,
    });
  };

  // 댓글 추가 함수
  const addComment = (comment) => {
    setComments([...comments, comment]);
  };

  return (
    <SafeAreaView>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TransparentCircleButton
            onPress={onGoBack}
            name="arrow-back"
            color="#424242"
          />
        </View>
        <View>
            <Text style={{ marginLeft: 8, fontSize: 20, textAlign: 'center' }}>{title}</Text>
        </View>
        <TransparentCircleButton
          onPress={handleEditPress}
          name="edit"
          color="#009688"
        />
      </View>
      <Text style={{ textAlign: 'center' }}>{content}</Text>
      <Text>{writer}</Text>

      {/* 댓글 입력란 */}
      <TextInput
        placeholder="댓글을 입력하세요"
        onChangeText={(text) => setCommentText(text)}
      />
      <Button
        title="댓글 남기기"
        onPress={() => {
          addComment(commentText);
          setCommentText(''); // 입력란 초기화
        }}
      />

      {/* 댓글 목록 */}
      <FlatList
        data={comments}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View>
            <Text>{item}</Text>
          </View>
        )}
      />
    </SafeAreaView>
  );
}

export default PostView;