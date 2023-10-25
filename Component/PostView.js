import React, { useState, useEffect } from 'react';
import { View, Text, StyleSheet, TextInput,FlatList,  Keyboard, TouchableOpacity, KeyboardAvoidingView, Platform, SafeAreaView, ScrollView, Alert } from 'react-native';
import { useNavigation } from '@react-navigation/native';
import TransparentCircleButton from './TransparentCircleButton';
import { TouchableWithoutFeedback } from 'react-native';

function PostView({ route }) {
  const { boardId, title, content, writer } = route.params;
  const navigation = useNavigation();
  const [comments, setComments] = useState([]);
  const [commentText, setCommentText] = useState('');
  const loginId = '기모취';

  // 게시글 id를 기반으로 댓글 데이터를 가져옴
  useEffect(() => {
    fetchComments(boardId); // 게시글 id를 전달하여 해당 게시글의 댓글을 가져오는 함수
  }, [boardId]);

  const fetchComments = async (boardId) => {
    try {
      const response = await fetch(`http://192.168.25.204:8080/comment/list/${boardId}`);
      const commentData = await response.json();
      setComments(commentData);
    } catch (error) {
      console.error(error);
      alert('댓글 불러오기 실패');
    }
  };

  const onGoBack = () => {
    navigation.pop();
  };

  const handleEditPress = () => {
    navigation.navigate('게시글 수정', {
      boardId,
      title,
      content,
      writer,
    });
  };

  const handleDeletePost = async () => {
    if (Platform.OS === 'web') {
      const userConfirmed = window.confirm('게시글을 삭제하시겠습니까?');
      if (userConfirmed) {
        // 게시글 삭제 로직
        try {
          const response = await fetch(`http://192.168.25.204:8080/board/del/${boardId}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json',
            },
          });
    
          if (response.ok) {
            // 게시글 삭제 요청이 성공한 경우 로컬 상태에서도 해당 게시글을 제거
            // 이를 위해 게시글 목록을 가져오는 API를 다시 호출하거나
            // 로컬 상태에서 해당 게시글을 제거하는 방법을 사용할 수 있습니다.
    
            // 게시글 삭제 후, 이전 화면으로 돌아가기
            alert('게시글 삭제 성공');
            navigation.pop();
          } else {
            console.error('게시글 삭제 실패:', response.status);
            alert('게시글 삭제 실패');
          }
        } catch (error) {
          console.error('게시글 삭제 중 오류 발생:', error);
          alert('게시글 삭제 중 오류 발생');
        }
      } 
    } else {
      Alert.alert(
        '삭제 확인',
        '게시글을 삭제하시겠습니까?',
        [
          {
            text: '취소',
            style: 'cancel',
          },
          {
            text: '확인',
            onPress: async () => {
              // 이하 모바일 앱에서의 삭제 로직
              try {
                const response = await fetch(`http://192.168.25.204:8080/board/del/${boardId}`, {
                  method: 'PUT',
                  headers: {
                    'Content-Type': 'application/json',
                  },
                });
  
                if (response.ok) {
                  // 게시글 삭제 요청이 성공한 경우 로컬 상태에서도 해당 게시글을 제거
                  // 이를 위해 게시글 목록을 가져오는 API를 다시 호출하거나
                  // 로컬 상태에서 해당 게시글을 제거하는 방법을 사용할 수 있습니다.
  
                  // 게시글 삭제 후, 이전 화면으로 돌아가기
                  alert('게시글 삭제 성공');
                  navigation.pop();
                } else {
                  console.error('게시글 삭제 실패:', response.status);
                  alert('게시글 삭제 실패');
                }
              } catch (error) {
                console.error('게시글 삭제 중 오류 발생:', error);
                alert('게시글 삭제 중 오류 발생');
              }
            },
          },
        ],
        { cancelable: false }
      );
    }
  };

  const addComment = async (comment) => {
    try {
      // 새 댓글 데이터 생성
      const newComment = { content:commentText , boardId: boardId, loginId: loginId };
  
      // POST 요청 보내기
      const response = await fetch(`http://192.168.25.204:8080/board/view/${boardId}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json', // 데이터 형식 설정 (JSON)
        },
        body: JSON.stringify(newComment), // 댓글 데이터를 JSON 문자열로 변환하여 보냅니다.
      });
  
      if (response.ok) {
        // 서버에서 응답이 성공적으로 왔을 때
        // 새로운 댓글을 로컬 상태에 추가
        setComments([...comments, newComment]);
        setCommentText('');
  
        // 키보드 닫기
        Keyboard.dismiss();
  
        // 서버에서 추가한 댓글을 반환해도 됩니다.
        // const addedComment = await response.json();
      } else {
        // 서버에서 오류 응답을 받았을 때 처리
        console.error('댓글 추가 실패');
      }
    } catch (error) {
      console.error('댓글 추가 중 오류 발생', error);
    }
  };

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.header}>
        <View style={styles.headerButton}>
          <TransparentCircleButton
            onPress={onGoBack}
            name="arrow-back"
            color="#424242"
          />
        </View>
        <View>
          <Text style={styles.headerTitle}>{title}</Text>
        </View>
        <View style={styles.headerButton}>
          <TransparentCircleButton
            onPress={handleDeletePost}
            name="delete-forever"
            color="#ef5350"             
          />
          <TransparentCircleButton
            onPress={handleEditPress}
            name="edit"
            color="#424242"
          />
        </View>
      </View>
      <ScrollView style={styles.contentContainer}>
        <Text style={styles.contentText}>{content}</Text>
        <Text style={styles.writerText}>{writer}</Text>
      </ScrollView>
      <View style={styles.borderLine}></View>
      <FlatList
        data={comments}
        keyExtractor={(item, index) => `comment-${index}`}
        renderItem={({ item }) => (
          <View style={styles.commentItem}>
            <Text style={styles.commentText}>{item.content}</Text>
          </View>
        )}
      />
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : null}
      >
        {/* <TouchableWithoutFeedback onPress={() => Keyboard.dismiss()}> */}
          <View>
            <TextInput
              placeholder="댓글을 입력하세요"
              onChangeText={(text) => setCommentText(text)}
              multiline
              value={commentText}
              style={styles.commentInput}
            />
            <TouchableOpacity
              style={styles.commentButton}
              onPress={() => {
                addComment(commentText);
              }}
            >
              <Text style={styles.commentButtonText}>댓글 남기기</Text>
            </TouchableOpacity>
          </View>
        {/* </TouchableWithoutFeedback> */}
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
  },
  headerButton: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  headerTitle: {
    fontSize: 20,
    textAlign: 'center',
    color: '#424242',
    left:20,
  },
  contentContainer: {
    flex: 1,
    padding: 16,
  },
  contentText: {
    fontSize: 18,
  },
  writerText: {
    textAlign: 'center',
    fontSize: 14,
    color: '#555',
  },
  borderLine: {
    borderTopWidth: 2,
    borderTopColor: '#000',
    marginTop: 250,
    marginBottom: 16,
  },
  commentItem: {
    backgroundColor: '#f5f5f5',
    padding: 12,
    borderRadius: 8,
    marginBottom: 8,
  },
  commentText: {
    fontSize: 16,
  },
  commentInput: {
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 8,
    padding: 8,
    marginBottom: 8,
  },
  commentButton: {
    backgroundColor: '#009688',
    borderRadius: 8,
    padding: 12,
    alignItems: 'center',
  },
  commentButtonText: {
    color: '#fff',
    fontSize: 16,
  },
});

export default PostView;
