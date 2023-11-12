import React, { useState, useEffect, useFocusEffect } from 'react';
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
  const isFocused = useIsFocused(); // 화면이 포커스되는지 여부를 확인
  
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
    
    const [selectedBoard, setSelectedBoard] = useState(null); // 선택한 게시글 저장
    const navigation = useNavigation(); 
    
    const [imageUrls, setImageUrls] = useState({});

    const refreshBoardData = async () => {
      // 게시글 데이터를 새로고침하는 함수
      setRefreshing(true); // 새로고침 시작
      try {
        await fetchBoardData();
      } finally {
        setRefreshing(false); // 새로고침 완료
      }
    };

    useEffect(() => {
      const focusListener = navigation.addListener('focus', () => {
        refreshBoardData();
      });
  
      return () => {
        focusListener();
      };
    }, [navigation]);

    const onBoardPress = (board) => {
      // setSelectedBoard(board);
      navigation.navigate('PostView', { 
        boardId: board.boardId, 
        image: board.image,
        content: board.content,
        title:board.title,
        recommendCount:board.recommendCount
      }); 
    };
    //게시글 자세히보기 갔다가 돌아올때 새로고침
    useEffect(() => {
      if (isFocused && !freeBoardData.length) {
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


    const handleNoticePress = (noticeData) => {
      // 공지사항 선택 시 동작
      navigation.navigate('PostView', {
        boardId: noticeData.boardId,
        title: noticeData.title,
        content: noticeData.content,
        loginId: 'Admin', 
      });
    };

    const refreshNoticeData = () => {
      // 공지사항 데이터를 새로고침하는 함수
      setRefreshing(true); // 새로고침 시작
      
      try {
        fetchBoardData();
      } finally {
        setRefreshing(false); // 새로고침 완료
      }
    };

    useEffect(() => {
      const focusListener = navigation.addListener('focus', () => {
        refreshNoticeData();
      });
  
      return () => {
        focusListener();
      };
    }, [navigation]);

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
  
    const [refreshing, setRefreshing] = useState(false); // 새로고침 상태

    const refreshQuestionData = () => {

      setRefreshing(true); // 새로고침 시작
      try {
        fetchBoardData();
      } finally {
        setRefreshing(false); // 새로고침 완료
      }
    };

    useEffect(() => {
      const focusListener = navigation.addListener('focus', () => {
        refreshQuestionData();
      });
  
      return () => {
        focusListener();
      };
    }, [navigation]);

    const handleQnAPress = (QnAData) => {
      navigation.navigate('PostView', {
        boardId: QnAData.boardId,
        title: QnAData.title,
        content: QnAData.content,
        loginId: 'Admin',
      });
    };

    return (
      <View style={styles.container}>
        <FlatList
          data={QnAData}
          keyExtractor={(item) => item.boardId.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.textContainer}
              onPress={handleQnAPress}
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

    const refreshTipData = () => {
      setRefreshing(true);
      
      try {
        fetchBoardData();
      } finally {
        setRefreshing(false); // 새로고침 완료
      }
    };

    useEffect(() => {
      const focusListener = navigation.addListener('focus', () => {
        refreshTipData();
      });
  
      return () => {
        focusListener();
      };
    }, [navigation]);

    const handleTipPress = (TipBoardData) => {
      // 공지사항 선택 시 동작
      navigation.navigate('PostView', {
        boardId: TipBoardData.boardId,
        title: TipBoardData.title,
        content: TipBoardData.content,
        loginId: 'Admin', 
      });
    };


    return (
      <View style={styles.container}>
        <FlatList
          data={TipBoardData}
          keyExtractor={(item) => item.boardId.toString()}
          renderItem={({ item }) => (
            <TouchableOpacity
              style={styles.textContainer}
              onPress={handleTipPress}
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