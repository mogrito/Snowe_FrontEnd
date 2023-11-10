import React, { useState, useEffect } from 'react';
import { StyleSheet, View, Text, TouchableOpacity, FlatList, RefreshControl, Image } from 'react-native';
import { useNavigation, useIsFocused } from '@react-navigation/native'; 
import { createMaterialTopTabNavigator } from '@react-navigation/material-top-tabs';
import FloatingWriteButton from './FloatingWriteButton';
import { MaterialIcons} from '@expo/vector-icons';
import { PaperProvider } from 'react-native-paper';
import TransparentCircleButton from './TransparentCircleButton';



const URL = 'http://192.168.25.204:8080';

function SocialView(){
  const Tab = createMaterialTopTabNavigator();

  const navigation = useNavigation(); // 네비게이션 객체 생성
  const [ hidden, setHidden ] = useState(false);
  const [ freeBoardData, setFreeBoardData ] = useState([]); // 자유게시판 데이터
  const [ noticeData, setNoticeData ] = useState([]); // 공지사항 데이터
  const [ QnAData, setQnAData ] = useState([]);
  const [ TipBoardData, setTipBoardData ] = useState([]);
  // const [ imageData, setImageData ] = useState(null);
  const [ boardId, setBoardId ] = useState('');
  const [ boardList, setBoardList ] = useState([]);
  
  const onGoBack = () => {
    navigation.goBack();
  };

  const onSearchButtonPress = () => {
    // 검색 버튼을 누를 때 검색 화면으로 이동
    navigation.navigate('SearchScreen'); 
  };

  // useEffect(() => {
  //   fetchImage(); // 컴포넌트가 마운트되면 이미지 가져오기 함수 호출
  // }, []);

  const fetchBoardData = async () => {
    try {
      const response = await Promise.race([
        fetch(`${URL}/board/list`),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('시간이 초과되었습니다')), 1000)
        ),
      ]);
      const boardData = await response.json();

      // 받아온 데이터를 카테고리에 따라 분류
      const freeBoardData = boardData.filter(item => item.category === '자유게시판');
      const noticeData = boardData.filter(item => item.category === '공지사항');
      const QnAData = boardData.filter(item => item.category === '묻고답하기');
      const TipBoardData = boardData.filter(item => item.category === '꿀팁공유');

      // 각 카테고리별 데이터를 해당하는 화면으로 전달
      setFreeBoardData(freeBoardData);
      setNoticeData(noticeData);
      setQnAData(QnAData);
      setTipBoardData(TipBoardData);

      console.log(boardData);
      setBoardList(boardData);

      setBoardId(boardData.boardId);

      // const images = {};
      // for (const boardItem of boardData) {
      //   const imageUrl = await fetchImage(boardItem.boardId);
      //   images[boardItem.boardId] = imageUrl;
      // }
      // setImageUrls(images);

    } catch (error) {
      console.error(error);
      alert('글불러오기실패');
    }
  }

  //   // 이미지 가져오는 함수
  //   const fetchImage = async () => {
  //     try {
  //       const response = await axios.get(`${URL}/file?boardId=${boardId}`);
  //       console.log(boardId);
  //       if (response.status === 200) {
  //         const imageUrl = URL.createObjectURL(new Blob([response.data]));
  //         return imageUrl;
  //       } else {
  //         return null;
  //       }
  //     } catch (error) {
  //       console.error('이미지 가져오기 오류:', error);
  //       return null;
  //     }
  // };


  return (
    <PaperProvider>
      <View style={styles.container}>
        <View style={styles.header}>
        <TransparentCircleButton onPress={onGoBack} name="left" color="#424242" />
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

  //여기서부터 탭 화면들
  function FreeBoardScreen() {
    const [refreshing, setRefreshing] = useState(false); // 새로고침 상태
    const isFocused = useIsFocused(); // 화면이 포커스되는지 여부를 확인
    const [selectedBoard, setSelectedBoard] = useState(null); // 선택한 게시글 저장
    const navigation = useNavigation(); 
    
    const [imageUrls, setImageUrls] = useState({});
    //이미지 불러오기
    useEffect(() => {
      fetchImage();
    }, []);

    const fetchImage = async () => {
      try {
        const response = await fetch(`${URL}/file?boardId=${boardId}`);
        if (response.ok) {
          const data = await response.blob();
          const imageUrl = URL.createObjectURL(data);
          return imageUrl;
        } else {
          return null;
        }
      } catch (error) {
        console.error('이미지 가져오기 오류:', error);
        return null;
      }
    };


    const sampleData = [
      {
        boardId: '1',
        title: '내 첫 번째 글',
        content: '이것은 내 첫 번째 글입니다.',
        date: '2023-10-03T12:00:00Z',
        commentCount: '5',
        viewCount: '20',
        recommendCount:'20',
        loginId: '정훈',
        image: [
          {
            url: 'https://picsum.photos/id/237/200/300'
          },
          {
            url: 'https://picsum.photos/seed/picsum/200/300'
          },
        ], 
      },
      {
        boardId: '2',
        title: '내 두 번째 글',
        content: '이것은 내 두 번째 글입니다.',
        date: '2023-10-03T12:00:00Z',
        comments: '0',
        loginId: 'dodasha',

        //image: require('../Images/face1.jpg'),
      },  
      {
        boardId: '3',
        title: '내 세 번째 글',
        content: '이것은 내 세 번째 글입니다.',
        date: '2023-10-03T12:00:00Z',
        comments: '1',
        loginId: 'mogrito',
        // image: require('../Images/face2.jpg'),
      },
      {
        boardId: '4',
        title: '내 실력 ㅁㅌㅊ?',
        content: 'ㅈㄱㄴ',
        date: '2023-10-03T12:00:00Z',
        comments: '1',
        loginId: '주성',
        //image: require('../Images/snowee.jpg'),
      },
    ];

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
        image: board.image,
        content: board.content,
        title:board.title
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
              data={freeBoardData}
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
                        <Text style={{ padding: 3, fontSize: 10 }}>{item.commentCount} · 조회 {item.viewCount} · ❤️ {item.recommendCount} </Text>
                      </View>
                    </View>
                    <View style={{ flexDirection: 'row' }}>
                      <Image
                        source={{ uri: imageUrls[item.boardId] }}
                        style={styles.ImageStyle}
                      />
                    </View>
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
          data={noticeData}
          keyExtractor={(item) => item.boardId.toString()}
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
          data={QnAData}
          keyExtractor={(item) => item.boardId.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.textContainer}
              onPress={() => {
                // 네비게이션을 통해 해당 질문/답변 화면으로 이동
                navigation.navigate('PostView', { boardId: item.boardId });
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

    const [tips] = useState([
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


    const refreshTipData = () => {
      setRefreshing(true);
      
      setTimeout(() => {
        setRefreshing(false);
      }, 1000);
    };

    return (
      <View style={styles.container}>
        <FlatList
          data={TipBoardData}
          keyExtractor={(item) => item.boardId.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.textContainer}
              onPress={() => {
                // 네비게이션을 통해 해당 질문/답변 화면으로 이동
                navigation.navigate('PostView', { boardId: item.boardId });
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
              onRefresh={refreshTipData}
            />
          }
        />
      </View>
    );
  }
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
  loginId:{
    fontSize:10,
    color:'gray',
    bottom:5,
  },
  ImageStyle:{
    width: 80, 
    height: 60, 
    resizeMode: 'contain', 
  },
});

export default SocialView;