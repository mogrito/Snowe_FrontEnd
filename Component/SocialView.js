import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList } from 'react-native';
import { useNavigation } from '@react-navigation/native'; // 네비게이션 기능 사용
import FloatingWriteButton from './FloatingWriteButton';
import { SafeAreaView } from 'react-native-safe-area-context';
import Icon from 'react-native-vector-icons/FontAwesome';

function SocialView() {
  const [hidden, setHidden] = useState(false);
  const [boardList, setBoardList] = useState([]);
  const [selectedBoard, setSelectedBoard] = useState(null); // 선택한 게시글 저장
  const [searchText, setSearchText] = useState(''); // 검색어 상태
  const navigation = useNavigation(); // 네비게이션 객체 생성
  

  const onSearchButtonPress = () => {
    // 검색 버튼을 누를 때 검색 화면으로 이동
    navigation.navigate('SearchScreen'); // 'SearchScreen'은 검색 화면의 이름입니다.
  };


  useEffect(() => {
    fetchBoardData();
  }, []);

  async function fetchBoardData() {
    try {
      const response = await fetch('http://192.168.25.204:8080/board/list');
      const boardData = await response.json();
      console.log(boardData);
      // alert(boardData[0].title);
      setBoardList(boardData);
    } catch (error) {
      console.error(error);
      alert('글불러오기실패');
    }
  }

  const onBoardPress = (board) => {
    // 게시글을 선택하면 해당 게시글의 내용을 보여줌
    setSelectedBoard(board);
    navigation.navigate('PostView', { 
      boardId: board.boardId, 
      title: board.title, 
      content: board.content, 
      writer: board.writer, 
      comment: board.comment,
    }); // 댓글 내용을 전달 });
  };

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>게시판</Text>
      <TouchableOpacity
        style={styles.searchButton}
        onPress={onSearchButtonPress}
      >
        <Text>
          <Icon name="search" size={24} color="black" /> {/* 검색 아이콘 */}
        </Text>
      </TouchableOpacity>
      <FlatList
          data={boardList}
          keyExtractor={(item) => item.boardId.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.boardItem}
              onPress={() => onBoardPress(item)}
            >
              <Text style={styles.textContainer}>{item.title}</Text>
              <Text>{item.body}</Text>
            </TouchableOpacity>
          )}
        />
      <FloatingWriteButton hidden={hidden} />
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    backgroundColor: 'white',
  },
  header: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16, // 헤더 아래 간격 조정
  },
  boardItem: {
    marginTop: 2,
    marginBottom: 1,
    padding: 3,
    backgroundColor: '#f0f0f0',
    borderRadius: 2,
  },
  textContainer: {
    borderWidth: 1, // 테두리 두께
    borderColor: 'black', // 테두리 색상
    padding: 25, // 텍스트 주위의 패딩
    borderRadius: 5, // 테두리의 모서리 반경 (원형 테두리를 만들려면 원의 반지름으로 설정)
  },
  boardBody: {
    fontSize: 16,
  },
  selectedBoard: {
    marginTop: 16,
    padding: 16,
    backgroundColor: '#f0f0f0',
    borderRadius: 8,
  },
  selectedBoardTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  selectedBoardBody: {
    fontSize: 16,
  },
  searchButton: {
    position: 'absolute',
    top: 60, // 원하는 위치로 조절
    right: 20, // 원하는 위치로 조절
  },
});

export default SocialView;



