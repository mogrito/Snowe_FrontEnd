import React, { useState } from 'react';
import { View, Text, Button, FlatList, TextInput } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TransparentCircleButton from './TransparentCircleButton';
import { SafeAreaView } from 'react-native';

function PostView({ route }) {
  const { title, content, writer } = route.params;
  const navigation = useNavigation();
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');

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

  const addComment = (comment) => {
    setComments([...comments, comment]);
  };

  return (
    <SafeAreaView>
      <View style={{ flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', padding: 16, backgroundColor: '#009688' }}>
        <View style={{ flexDirection: 'row', alignItems: 'center' }}>
          <TransparentCircleButton
            onPress={onGoBack}
            name="arrow-back"
            color="#fff"
          />
        </View>
        <View>
          <Text style={{ fontSize: 20, textAlign: 'center', color: '#fff' }}>{title}</Text>
        </View>
        <TransparentCircleButton
          onPress={handleEditPress}
          name="edit"
          color="#fff"
        />
      </View>
      <Text style={{ textAlign: 'center', fontSize: 18, padding: 16 }}>{content}</Text>
      <Text style={{ textAlign: 'center', fontSize: 14, color: '#555' }}>{writer}</Text>

      <FlatList
        data={comments}
        keyExtractor={(item, index) => index.toString()}
        renderItem={({ item }) => (
          <View style={{ backgroundColor: '#f9f9f9', padding: 16, margin: 4, borderWidth: 1, borderColor: '#ddd', borderRadius: 5 }}>
            <Text>{item}</Text>
          </View>
        )}
      />

      <View style={{ padding: 16, borderTopWidth: 1, borderTopColor: '#ddd' }}>
        <TextInput
          placeholder="댓글을 입력하세요"
          onChangeText={(text) => setCommentText(text)}
          style={{ borderWidth: 1, borderColor: '#ccc', borderRadius: 5, padding: 8, marginBottom: 8 }}
        />
        <Button
          title="댓글 남기기"
          onPress={() => {
            addComment(commentText);
            setCommentText('');
          }}
        />
      </View>
    </SafeAreaView>
  );
}

export default PostView;