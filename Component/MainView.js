import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
  ActivityIndicator,
  Linking,
  Image,
  FlatList,
} from 'react-native';
import { Agenda, LocaleConfig } from 'react-native-calendars';
import {
  FontAwesome,
  MaterialIcons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Font from 'expo-font';
import * as Location from 'expo-location';
import axios from 'axios';
import { Card, Avatar } from 'react-native-paper';
import { getTokenFromLocal } from './TokenUtils';

const windowWidth = Dimensions.get('window').width;

const weatherConditionTranslations = {
  Clear: '맑음',
  Clouds: '흐림',
  Rain: '비',
  Snow: '눈',
  Haze: '안개',
  Mist: '짙은 안개',
};

function getWeatherIconName(weatherCondition) {
  switch (weatherCondition) {
    case 'Clear':
      return 'weather-sunny';
    case 'Clouds':
      return 'weather-cloudy';
    case 'Rain':
      return 'weather-rainy';
    case 'Snow':
      return 'weather-snowy';
    case 'Haze':
      return 'weather-hazy';
    case 'Mist':
      return 'weather-fog';
    default:
      return 'question';
  }
}

function getKoreanWeatherCondition(weatherCondition) {
  return weatherConditionTranslations[weatherCondition] || '알 수 없음';
}

function MainScreen() {
  const navigation = useNavigation();
  const route = useRoute();
  const [fontLoaded, setFontLoaded] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedResortName, setSelectedResortName] = useState('');
  const [reservationData, setreservationData] = useState(null);
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [hotBoardList, setHotBoardList] = useState([]);
  const [boardId, setBoardId] = useState('');

  // SkiReosrtList.js에서 param값 받기
  const selectedResort = route.params?.selectedResort;
  const location = selectedResort?.location;


  const handleUserIconPress = () => {
    navigation.openDrawer();
  };

  useEffect(() => {
    async function loadCustomFont() {
      await Font.loadAsync({
        DMSerifText1: require('../assets/fonts/DMSerifText1.ttf'),
      });
      setFontLoaded(true);
    }

    loadCustomFont();
  }, []);

  useEffect(() => {
    if (route.params?.selectedResortName) {
      setSelectedResortName(route.params.selectedResortName);
    }
  }, [route.params?.selectedResortName]);


  useEffect(() => {
    async function fetchWeather() {
      try {
        const apiKey = '28664d08fe65159df42d4ee6b227bacd';

        if (location) {
          const lon = location.longitude;
          const lat = location.latitude;

          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
          );

          if (response.status === 200) {
            const data = response.data;
            setWeatherData(data);
            console.log(data);
          } else {
            console.error('날씨 데이터를 가져올 수 없습니다');
          }
        }
      } catch (error) {
        console.error(error);
      } finally {
        setIsLoading(false); // 로딩 상태 업데이트
      }
    }

    fetchWeather();
  }, []);

  LocaleConfig.locales['ko'] = {
    monthNames: [
      '1월',
      '2월',
      '3월',
      '4월',
      '5월',
      '6월',
      '7월',
      '8월',
      '9월',
      '10월',
      '11월',
      '12월',
    ],
    monthNamesShort: [
      '1월',
      '2월',
      '3월',
      '4월',
      '5월',
      '6월',
      '7월',
      '8월',
      '9월',
      '10월',
      '11월',
      '12월',
    ],
    dayNames: ['일', '월', '화', '수', '목', '금', '토'],
    dayNamesShort: ['일', '월', '화', '수', '목', '금', '토'],
  };
  
  LocaleConfig.defaultLocale = 'ko'; 
  
  const timeToString = (time) => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  };
  

  useEffect(() => {
    async function fetchData() {
      const token = await getTokenFromLocal();
      const authorizationHeader = `Bearer ${token}`;
      try {
        const response = await fetch(`http://localhost:8080/reservation/listOnDate?lessonDate=${date}`, {
          method: 'GET',
          headers: {
            'Authorization': authorizationHeader,
            'Content-Type': 'application/json',
          },
        });
  
        if (response.ok) {
          // HTTP 상태 코드가 200 OK인 경우
          const data = await response.json();
          if (data && data.length > 0) {
            setreservationData(data);
            console.log(reservationData);
          } else {
            // 예약 목록이 비어있는 경우
            setreservationData(null);
            console.log('서버로부터 빈 응답을 수신했습니다');
          }
        } else if (response.status === 204) {
          // HTTP 상태 코드가 204 No Content인 경우
          setreservationData(null);
          console.log('서버로부터 빈 응답(No Content)을 수신했습니다');
        } else {
          // 그 외의 상황에서는 오류로 처리
          setreservationData(null);
          console.error('데이터 가져오기 중 오류 발생:', response.status);
        }
      } catch (error) {
        // fetch 자체의 오류 처리
        setreservationData(null);
        console.log(reservationData);
        console.error('데이터 가져오기 중 오류 발생:', error);
      }
    }
    fetchData();
  }, [date]);

  // 핫 게시글 fetch
  const fetchBoardData = async () => {
    try {
      const response = await Promise.race([
        fetch('http://192.168.25.204:8080/board/hot-List'),
        new Promise((_, reject) =>
          setTimeout(() => reject(new Error('시간이 초과되었습니다')), 1000)
        ),
      ]);
      const hotBoardData = await response.json();

      console.log("핫보드 데이터입니다 ==>> " + hotBoardData);
      setHotBoardList(hotBoardData);

      setBoardId(hotBoardData.boardId);

    } catch (error) {
      console.error(error);
      alert('글불러오기실패');
    }
  }
  useEffect(() => {
    fetchBoardData();
  }, []);
  // 핫게시글 누를 시
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
  
    const loadItems = () => {
      setTimeout(() => {
        hardcodedData.forEach((dayData) => {
          const { date, events } = dayData;
          const strTime = timeToString(new Date(date).getTime());
  
          if (!items[strTime]) {
            items[strTime] = [];
  
            events.forEach((event) => {
              items[strTime].push({
                name: event.name,
                height: event.height,
              });
            });
          }
        });
  
        const newItems = { ...items };
        setItems(newItems);
      }, 1000);
    };
  
    const renderItem = (item) => {
      return (
        <TouchableOpacity style={{ margin: 5, padding: 10 }}>
          <Card>
            <Card.Content>
              <View
                style={{
                  flexDirection: 'row',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}>
                <Text>{item.name}</Text>
                <Image source={require('../Images/face.jpg')} style={styles.image}/>  
              </View>
            </Card.Content>
          </Card>
        </TouchableOpacity>
      );
    };

  return (
    <View style={styles.background}>
      <View style={styles.header}>
        <Text style={fontLoaded ? styles.title : {}}>Snowe</Text>
        <TouchableOpacity style={styles.userIcon} onPress={handleUserIconPress}>
          <MaterialIcons name="menu" size={30} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {isLoading ? ( // 로딩 중일 때
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="black" />
            <Text>Loading...</Text>
          </View>
        ) : (
          // 데이터 로딩 후 표시할 내용
          <View style={styles.weatherContainer}>
            <Text style={styles.weatherCity}>{selectedResortName}</Text>
            <MaterialCommunityIcons
              style={styles.weatherIcon}
              name={weatherData && weatherData.weather && weatherData.weather.length > 0 ? getWeatherIconName(weatherData.weather[0].main) : 'question'}
              size={150}
              color="black"
            />
            <Text style={styles.weatherexp}>
              {weatherData && weatherData.weather && weatherData.weather.length > 0 ? getKoreanWeatherCondition(weatherData.weather[0].main) : 'question'}
            </Text>
            <Text style={styles.weatherTemp}> {weatherData && weatherData.main
              ? `현재 온도: ${(weatherData.main.temp - 273.15).toFixed(0)}°C`
              : 'N/A'}</Text>
          </View>
        )}

        <View style={styles.SkiInfo}>
          <TouchableOpacity onPress={() => Linking.openURL(selectedResort.webcam)}>
            <View style={styles.SkiInfoIcon}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="webcam" size={24} color="black" />
                <Text style={styles.iconText}>실시간 웹캠</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL(selectedResort.bus)}>
            <View style={styles.SkiResortBusIcon}>
              <View style={styles.iconContainer}>
                <MaterialCommunityIcons name="bus-clock" size={24} color="black" />
                <Text style={styles.iconText}>셔틀버스 정보</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL(selectedResort.condo)}>
            <View style={styles.SkiResortIcon}>
              <View style={styles.iconContainer}>
                <FontAwesome name="building-o" size={24} color="black" />
                <Text style={styles.iconText}>스키장 콘도 예약</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>
        

        <View style={styles.hotboardContainer}>
          <Text style={styles.hotboardheader}>🔥 인기 게시물</Text>
          <View style={styles.hotboarditems}>
          
          <FlatList
              data={hotBoardList}
              keyExtractor={(item) => item.boardId.toString()}
              renderItem={({ item }) => (
                <TouchableOpacity
                  style={styles.textContainer}
                  onPress={() => onBoardPress(item)}
                >
                  <View style={{ flexDirection:'row',alignItems: 'center', justifyContent: 'space-between' }}>
                    <View>
                      <Text>{item.title}</Text>
                      <View style={styles.textComment}>
                        <Text>{item.createDate}  댓글 {item.commentCount} · 좋아요 {item.recommendCount} </Text>
                      </View>
                    </View>
                  </View>
                </TouchableOpacity>
              )}
            
            />


          {/* <TouchableOpacity>
            <Text style={styles.hotboarditem}>오늘 스키장 같이 가실분?</Text>
            <Text style={styles.hotboarddate}>10/26</Text>
          </TouchableOpacity>
          
          <TouchableOpacity>
            <Text style={styles.hotboarditem1}>하앙</Text>
            <Text style={styles.hotboarddate1}>10/30</Text>
          </TouchableOpacity>

          <TouchableOpacity>
            <Text style={styles.hotboarditem2}>정훈아 해줘</Text>
            <Text style={styles.hotboarddate2}>10/21</Text>
          </TouchableOpacity> */}
          
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    width: '100%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 40,
    backgroundColor: '#DBEBF9',
    paddingVertical: 7,
    paddingHorizontal: 10,
    zIndex: 1,
  },
  title: {
    fontSize: 40,
    fontStyle: 'italic',
    color: 'black',
    fontFamily: 'DMSerifText1',
    left: 11,
  },
  userIcon: {
    marginTop: 5,
    right: 10,
  },
  calendar: {
    width: windowWidth * 0.9,
    marginTop: 20,
    borderRadius: 10,
  },
  background: {
    flex: 1,
    backgroundColor: '#DBEBF9',
  },
  body: {
    alignItems: 'center',
    paddingTop: 50,
  },
  weatherContainer: {
    width: windowWidth * 0.9,
    height: 300,
    marginBottom: 0,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  weatherText: {
    textAlign: 'center',
    fontSize: 18,
  },
  weatherIcon: {
    color: 'black',
  },
  weatherCity: {
    fontSize: 23,
    fontWeight: '600',
  },
  weatherTemp: {
    fontSize: 20,
  },
  weatherexp: {
    fontSize: 30,
    marginBottom: 20,
    fontWeight: '600',
  },

  SkiInfo: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: 'white',
    width: '90%',
    height: 110,
    marginTop: 10,
    borderRadius: 10,
  },
  SkiInfoIcon: {
    marginTop: 30,
    marginLeft: 14,
  },
  SkiResortBusIcon: {
    marginTop: 30,
    marginLeft: 14,

  },
  SkiResortIcon: {
    marginTop: 30,
    marginLeft: 3,



  },
  iconContainer: {
    alignItems: 'center',


  },
  iconText: {
    marginTop: 10,
  },
  image:{
    width: 60,
    height: 60,
    borderRadius: 60,
    marginLeft: 20,

  },
  hotboardContainer: {
    flexDirection: 'column',
    alignItems: 'flex-start',
    marginBottom: 20,
    width: windowWidth * 0.9,
    borderRadius: 10,
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    marginTop:10,
  },
  hotboarditems:{
    flex: 1,

  },
  hotboarditem: {
    fontSize: 16,
    marginBottom: 3, // Adjust this margin value to add space
  },
  hotboarddate: {
    fontSize: 13,
    marginBottom: 25,
  },
  hotboarditem1: {
    fontSize: 16,
    marginBottom: 3, // Adjust this margin value to add space
  },
  hotboarddate1: {
    fontSize: 13,
    marginBottom: 25,
  },
  hotboarditem2: {
    fontSize: 16,
    marginBottom: 3, // Adjust this margin value to add space
  },
  hotboarddate2: {
    fontSize: 13,
    marginBottom: 25,
  },
  hotboardheader: {
    fontSize: 18,
    marginBottom: 20,
    fontWeight: 'bold',
    marginTop: 20,
    marginLeft:-5,
  },


});

export default MainScreen;