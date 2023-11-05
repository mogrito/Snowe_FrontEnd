import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, RefreshControl, Image } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native'; 
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FloatingWriteButton from './FloatingWriteButton';
import { MaterialIcons} from '@expo/vector-icons';
import { PaperProvider } from 'react-native-paper';
import TransparentCircleButton from './TransparentCircleButton';



const URL = 'http://192.168.25.204:8080';



function FreeBoardScreen() {
  const [refreshing, setRefreshing] = useState(false); // 새로고침 상태
  const isFocused = useIsFocused(); // 화면이 포커스되는지 여부를 확인
  const [selectedBoard, setSelectedBoard] = useState(null); // 선택한 게시글 저장
  const navigation = useNavigation(); 
  const [ boardList, setBoardList ] = useState([]);

  const fetchBoardData = async () => {
    try {
      const response = await Promise.race([
        fetch(`${URL}/board/list`),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('시간이 초과되었습니다')), 1000) // 타임아웃을 10초(10000 밀리초)로 설정
        ),
      ]);
      const boardData = await response.json();
      console.log(boardData);
      setBoardList(boardData);
    } catch (error) {
      console.error(error);
      alert('글불러오기실패');
    }
  }

  const refreshBoardData = () => {
    // 게시글 데이터를 새로고침하는 함수
    setRefreshing(true); // 새로고침 시작
    fetchBoardData()
      .then(() => setRefreshing(false)); 
  };

  const onBoardPress = (board) => {
   
    setSelectedBoard(board);
    navigation.navigate('PostView', { 
      boardId: board.boardId, 
      refreshData: refreshBoardData, // 삭제 후 새로고침 함수를 전달
    }); 
  };

  useEffect(() => {
    if (isFocused) {
      // 화면이 포커스되면 게시글 데이터를 새로고침
      refreshBoardData();
    }
  }, [isFocused]);




  return (
    <View style={styles.container}>
      
      <FlatList
            data={boardList}
            keyExtractor={(item) => item.boardId.toString()}
            renderItem={({ item }) => (
              
              <TouchableOpacity
                style={styles.textContainer}
                onPress={() => onBoardPress(item)}
              >
                <View style={{ flexDirection:'row',alignItems: 'center', justifyContent: 'space-between' }}>
                  <View style={{ flex: 1 }}>
                    <Text style={styles.loginId}>{item.loginId}</Text>
                    <Text>{item.title}</Text>
                    <View style={styles.textComment}>
                      <MaterialIcons name='comment' size={10} color='black' />
                      <Text style={{ padding: 3, fontSize: 10 }}>{item.commentCount} · 조회 {item.viewCount}</Text>
                    </View>
                  </View>
                  <Image
                    source={item.image}
                    style={styles.ImageStyle}
                  />
                </View>
              </TouchableOpacity>
            )}
            refreshControl={
              <RefreshControl
                refreshing={refreshing}
                onRefresh={refreshBoardData}
              />
            }
          />
    </View>
  );
}

function NoticeScreen({ navigation }) {

  const [refreshing, setRefreshing] = useState(false);

  const notice = {
    id: 'notice',
    title: '공지',
    content: '이것은 모든 사용자를 위한 중요한 공지입니다.',
    date: '2023-10-31T09:00:00Z',
    loginId: 'admin',
    comments: 0,
  };

  const handleNoticePress = () => {
    // 공지사항 선택 시 동작
    navigation.navigate('PostView', {
      boardId: notice.id,
      title: notice.title,
      content: notice.content,
      loginId: 'Admin', 
    });
  };

  const refreshNoticeData = () => {
    // 공지사항 데이터를 새로고침하는 함수
    setRefreshing(true); // 새로고침 시작
    
    setTimeout(() => {
      setRefreshing(false); // 새로고침 완료
    }, 1000); 
  };

  return (
    <View style={styles.container}>
      {/* 공지사항 화면 구현 */}
      <FlatList
        data={[notice]}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.noticeItem} onPress={handleNoticePress}>
            <View style={{ flexDirection:'row',alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.loginId}>{item.loginId}</Text>
                <Text>📢 {item.title}</Text>
                <View style={styles.textComment}>
                  <MaterialIcons name='comment' size={10} color='black' />
                  <Text style={{ padding: 3, fontSize: 10 }}>{item.comments}</Text>
                </View>
              </View>                 
               <Image
                  source={item.image}
                  style={styles.ImageStyle}
                />
            </View>
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshNoticeData}
          />
        }
      />
    </View>
  );
}

function QnAScreen({ navigation }) {
  // const [questions, setQuestions] = useState([]);
  const [refreshing, setRefreshing] = useState(false); // 새로고침 상태

  const questions = [
    {
      id: '1',
      title: '다음 개장 날짜 언제인지 아시는 분?',
      content: 'ㅈㄱㄴ',
      date: '2023-10-03T12:00:00Z',
      comments:5,
      loginId:'원빈',      
    },
  ];

  // // 함수: 질문 목록을 불러오는 데이터 요청 (예시로 비워둠)
  // const fetchQuestions = async () => {
  //   try {
  //     // 여기에 질문 데이터를 가져오는 API 호출 또는 다시 데이터 설정하는 로직을 추가
  //     // ... (질문 데이터 가져오는 비동기 로직)
  //     // setQuestions(새로운 질문 데이터);
  //   } catch (error) {
  //     console.error(error);
  //     alert('질문 목록을 불러오는 데 실패했습니다.');
  //   }
  // };

  const refreshQuestionData = () => {

    setRefreshing(true); // 새로고침 시작
    setTimeout(() => {
      setRefreshing(false); // 새로고침 완료
    }, 1000); // 새로고침 완료 후의 시간 설정 (예: 1초 후에 새로고침 완료)
  };

  // useEffect(() => {
  //   fetchQuestions();
  // }, []);

  return (
    <View style={styles.container}>
      <FlatList
        data={questions}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.textContainer}
            onPress={() => {
              // 네비게이션을 통해 해당 질문/답변 화면으로 이동
              navigation.navigate('QuestionDetail', { questionId: item.id });
            }}
          >
            <View style={{ flexDirection:'row',alignItems: 'center', justifyContent: 'space-between' }}>
              <View style={{ flex: 1 }}>
                <Text style={styles.loginId}>{item.loginId}</Text>
                <Text>{item.title}</Text>
                <View style={styles.textComment}>
                  <MaterialIcons name='comment' size={10} color='black' />
                  <Text style={{ padding: 3, fontSize: 10 }}>{item.comments}</Text>
                </View>
              </View>
              <Image
                source={item.image}
                style={styles.ImageStyle}
              />
            </View>
          </TouchableOpacity>
          
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshQuestionData}
          />
        }
      />
    </View>
  );
}

function TipBoardScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const navigation = useNavigation();

  const [tips, setTips] = useState([
    {
      id: 'tip1',
      loginId : '희찬',
      title: '내얼굴평가좀',
      image: require('../Images/face.jpg'),
      content: 'ㅈㄱㄴ',
      comments: 3,
      likes:10,
      liked: false,
    },
    {
      id: 'tip2',
      loginId: '주성',
      title: '^^',
      image: require('../Images/face1.jpg'),
      content: '^>^',
      comments: 7,
      likes: 5,
      liked: false,
    },
    
  ]);

  const handleTipPress = (tip) => {
    navigation.navigate('PostView', {
      loginId: tip.loginid,
      title: tip.title,
      content: tip.content,
      comments: tip.comments,
    });
  };

  const handleLike = (id) => {
    setTips((prevTips) =>
      prevTips.map((tip) =>
        tip.id === id ? { ...tip, liked: !tip.liked, likes: tip.liked ? tip.likes - 1 : tip.likes + 1 } : tip
      )
    );
  };

  const refreshTipData = () => {
    setRefreshing(true);
    
    setTimeout(() => {
      setRefreshing(false);
    }, 1000);
  };

  return (
    <View style={styles.container}>
      <FlatList
        data={tips}
        keyExtractor={(item) => item.id.toString()}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={styles.instagramItem} 
            onPress={() => handleTipPress(item)}
          >
            <View style={styles.instagramItemContent}>
              <Image
                  source={item.image}
                  style={styles.ImageStyle2}
              />
              <Text style={styles.instagramTitle}>{item.title}</Text>
              <Text style={styles.instagramContent}>{item.content}</Text>
            </View>
            <View style={styles.tipFooter}>
              <TouchableOpacity onPress={() => handleLike(item.id)}>
                <MaterialIcons name={item.liked ? 'favorite' : 'favorite-border'} size={30} color="red" />
              </TouchableOpacity>
              <Text>{item.likes}</Text>
              <View style={styles.textComment}>
                <MaterialIcons name='comment' size={30} color="black" />
                <Text style={{ margin: 5 }}>{item.comments}</Text>
              </View>
            </View>
          </TouchableOpacity>
        )}
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={refreshTipData}
          />
        }
      />
    </View>
  );
}

const Tab = createMaterialTopTabNavigator();


function SocialView() {
  const navigation = useNavigation(); // 네비게이션 객체 생성

  const onSearchButtonPress = () => {
    // 검색 버튼을 누를 때 검색 화면으로 이동
    navigation.navigate('SearchScreen'); 
  };

  const [hidden, setHidden] = useState(false);

  const onGoBack = () => {
    navigation.goBack();
  };


  return (
    <PaperProvider>
      <View style={styles.container}>
        <View style={styles.header}>
        <TransparentCircleButton onPress={onGoBack} name="arrow-back" color="#424242" />
          <Text style={styles.title}>게시판</Text>
          <TouchableOpacity style={styles.userIcon} onPress={onSearchButtonPress}>
            <MaterialIcons name="search" size={30} color="black" />
          </TouchableOpacity>
        </View>   
        <Tab.Navigator>
          <Tab.Screen name="공지사항" component={NoticeScreen} />
          <Tab.Screen name="자유게시판" component={FreeBoardScreen} />
          <Tab.Screen name="묻고 답하기" component={QnAScreen} />
          <Tab.Screen name="💡꿀팁 공유" component={TipBoardScreen} />
        </Tab.Navigator>   
        <FloatingWriteButton hidden={hidden} />
      </View>
    </PaperProvider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#DBEBF9'
  },
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top:40,
    paddingVertical: 10,
    paddingHorizontal: 10,
    zIndex: 1,
    marginBottom:40,
    marginTop:10,
  },
  title: {
    flex: 1,
    textAlign: 'center',
    fontSize: 20,
    fontWeight: 'bold',
  },
  boardItem: {
    marginTop: 2,
    marginBottom: 1,
    padding: 10,
    borderRadius: 2,
  },
  textContainer: {
    borderWidth: 1, 
    borderColor: 'white', 
    paddingTop:20, 
    paddingLeft:15,
    paddingBottom:15,
    paddingRight:15,
    borderRadius: 5, 
    margin:10,
    height: 'auto',
    textAlign:'auto',
    backgroundColor:'white'
  },
  textComment: {
    flexDirection: 'row', 
    alignItems: 'center',
    paddingTop: 5
  },
  searchButton : {
    marginTop: 5,
    right: 10,
  },
  noticeTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    textAlign: 'center',
    marginTop: 10,
  },
  noticeItem: {
    backgroundColor: '#FFFF00', 
    borderWidth: 1, 
    borderColor: 'yellow', 
    padding: 20,
    borderRadius: 5, 
    margin:10
  },
  instagramItem: {
    borderWidth: 1,
    borderColor: 'black',
    padding: 20,
    borderRadius: 5,
    margin: 10,
    backgroundColor: 'white', 
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 3.84,
    elevation: 5,
  },
  instagramItemContent: {
    marginBottom: 10,
  },
  instagramTitle: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  instagramContent: {
    fontSize: 16,
  },
  tipFooter: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginTop: 10,
  },
  loginId:{
    fontSize:10,
    color:'gray',
    bottom:5,
  },
  ImageStyle:{
    width: 80, 
    height: 60, 
    resizeMode: 'cover', 
  },
  ImageStyle2:{
    width: '100%', 
    height: 200, 
    resizeMode: 'cover', 
  }
});

export default SocialView;