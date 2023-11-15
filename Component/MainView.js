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
import { Calendar, Agenda, LocaleConfig } from 'react-native-calendars';
import {
  FontAwesome,
  MaterialIcons,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Font from 'expo-font';
import axios from 'axios';
import { Card } from 'react-native-paper';
import { getTokenFromLocal } from './TokenUtils';
import AsyncStorage from '@react-native-async-storage/async-storage';

const windowWidth = Dimensions.get('window').width;

const weatherConditionTranslations = {
  Clear: '맑음',
  Clouds: '흐림',
  Rain: '비',
  Snow: '눈',
  Haze: '안개',
  Mist: '짙은 안개',
};

function getWeatherImage(weatherCondition) {
  switch (weatherCondition) {
    case 'Clear':
      return require('../Images/sunny.png');
    case 'Clouds':
      return require('../Images/cloud.png');
    case 'Rain':
      return require('../Images/rain.png');
    case 'Snow':
      return require('../Images/snow1.png');
    case 'Haze':
      return require('../Images/fog.png');
    case 'Mist':
      return require('../Images/fog.png');
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
  const [reservationData, setreservationData] = useState();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState({});
  const [agendaItems, setAgendaItems] = useState({});
  const [hotBoardList, setHotBoardList] = useState([]);
  const [boardId, setBoardId] = useState('');



  // SkiReosrtList.js에서 param값 받기
  const selectedResort = route.params?.selectedResort;

  const handleUserIconPress = () => {
    navigation.openDrawer();
  };

  useEffect(() => {
    async function loadCustomFont() {
      await Font.loadAsync({
        BalooRegular: require('../assets/fonts/BalooRegular.ttf'),
      });
      setFontLoaded(true);
    }

    loadCustomFont();
  }, []);

  useEffect(() => {
    if (route.params?.selectedResortName) {
      setSelectedResortName(route.params.selectedResortName);
      AsyncStorage.setItem("selectedResortName", route.params.selectedResortName);
    }
  }, [route.params?.selectedResortName]);





  useEffect(() => {
    async function fetchWeather() {
      console.log(await AsyncStorage.getItem("selectedResortName"))
      try {
        const apiKey = '28664d08fe65159df42d4ee6b227bacd';

        if (selectedResort?.location) {
          const lon = selectedResort.location.longitude;
          const lat = selectedResort.location.latitude;

          const response = await axios.get(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
          );

          if (response.status === 200) {
            const data = response.data;
            setWeatherData(data);
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
  }, [selectedResort]);



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
      title: board.title,
      recommendCount: board.recommendCount
    });
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
            <Image
              style={styles.weatherImage} // Add a style for the image
              source={weatherData && weatherData.weather && weatherData.weather.length > 0 ? getWeatherImage(weatherData.weather[0].main) : require('../Images/question.png')}
            />
            <Text style={styles.weatherTemp}>
              {weatherData && weatherData.main
                ? `${(weatherData.main.temp - 273.15).toFixed(0)}°`
                : 'N/A'}
            </Text>
            <Text style={styles.weatherexp}>
              {weatherData && weatherData.weather && weatherData.weather.length > 0 ? getKoreanWeatherCondition(weatherData.weather[0].main) : '알 수 없음'}
            </Text>
          </View>
        )}

        <View style={styles.SkiInfo}>
          <TouchableOpacity onPress={() => Linking.openURL(selectedResort.webcam)}>
            <View style={styles.SkiInfoIcon}>
              <View style={styles.iconContainer}>
                <Image
                  source={require('../Images/webcam.png')}
                  style={styles.iconImage}
                />
                <Text style={styles.iconText}>실시간 웹캠</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL(selectedResort.bus)}>
            <View style={styles.SkiResortBusIcon}>
              <View style={styles.iconContainer}>
                <Image
                  source={require('../Images/bus.png')}
                  style={styles.iconImage}
                />
                <Text style={styles.iconText}>셔틀버스 정보</Text>
              </View>
            </View>
          </TouchableOpacity>
          <TouchableOpacity onPress={() => Linking.openURL(selectedResort.condo)}>
            <View style={styles.SkiResortIcon}>
              <View style={styles.iconContainer}>
                <Image
                  source={require('../Images/condo.png')}
                  style={styles.iconImage}
                />
                <Text style={styles.iconText}>스키장 콘도 예약</Text>
              </View>
            </View>
          </TouchableOpacity>
        </View>

        <View style={{ flex: 1, marginTop: 20, width: windowWidth * 0.9 }}>         
            <Calendar monthFormat={'yyyy년 MM월'} style={{borderRadius:8}}
            />
        </View>

        {/* <View style={styles.reservateview}>

          <Image
            source={require('../Images/face.jpg')}
            style={styles.iconImage}
          />
          <Text style={styles.reservetext}>asd</Text>
        </View> */}

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
                  <View style={styles.headerContainer}>
                    <View style={styles.textComment}>
                      <Text style={styles.boardtitle}>{item.title}</Text>
                      <Text style={styles.boardcategory}>{item.category}</Text>
                    </View>
                    <View style={styles.textComment1}>
                      <Text style={styles.datestyle}>{item.createDate}</Text>
                      <Text> 👍 {item.recommendCount}  💬 {item.commentCount}</Text>
                    </View>
                  </View>
                </TouchableOpacity>
              )}

            />
          </View>
        </View>
      </ScrollView>
    </View>
  );
}

const styles = StyleSheet.create({
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    position: 'sticky',
    top: 45,
    backgroundColor: '#DBEBF9',
    paddingVertical: 5,
    paddingHorizontal: 10,
    zIndex: 1,
  },
  title: {
    fontSize: 40,
    fontStyle: 'italic',
    color: '#8BC1EF',
    fontFamily: 'BalooRegular',
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
    height: 350,
    marginBottom: 10, // Adjust this margin value
    backgroundColor: '#33A9FF',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  weatherText: {
    textAlign: 'center',
    fontSize: 18,
  },
  weatherCity: {
    color: 'white',
    fontSize: 23,
    fontWeight: '600',
    marginBottom: 5,

  },
  weatherTemp: {
    color: 'white',
    fontSize: 65,
    marginBottom: 1,  // Remove the margin-bottom
    marginLeft: 14,



  },
  weatherexp: {
    color: 'white',
    fontSize: 30,
    marginBottom: 10,
    fontWeight: '600',
    marginTop: 10,
  },
  weatherImage: {
    width: 145,
    height: 145,
    marginBottom: 1,

  },

  SkiInfo: {
    flexDirection: 'row',
    justifyContent: 'space-evenly',
    backgroundColor: 'white',
    width: windowWidth * 0.9,
    height: 110,
    marginTop: 10, // Adjust this margin value
    borderRadius: 10,
  },
  SkiInfoIcon: {
    marginTop: 25,
    marginLeft: 14,
  },
  SkiResortBusIcon: {
    marginTop: 25,
    marginLeft: 14,

  },
  SkiResortIcon: {
    marginTop: 25,
    marginLeft: 3,



  },
  iconContainer: {
    alignItems: 'center',


  },
  iconText: {
    marginTop: 10,
  },
  image: {
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
    marginTop: 20,

  },
  hotboarditems: {
    flex: 1,
    width: "100%",
    marginBottom: 40,


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
    marginLeft: -5,
  },
  headerContainer: {
    marginTop: 20,
    justifyContent: 'space-between',
    flexDirection: 'row'

  },
  textComment: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
  },
  textComment1: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginTop: 5,
  },
  headerContainer: {
    marginTop: 20,
    justifyContent: 'space-between',
  },
  boardcategory: {
    fontWeight: 'bold',
    marginBottom: 1,
  },
  textContainer: {
    width: '100%',

  }
  ,
  datestyle: {
    fontSize: 13,
    marginTop:4,
    color: 'gray'
  }
  ,
  bustext: {
    fontSize: 30,

  },
  webcamtext: {
    fontSize: 30,

  },
  condotext: {
    fontSize: 30,

  },
  iconImage: {
    width: 35,
    height: 35,

  },
  reservateview: {
    flexDirection: 'row',
    alignItems: 'center', // Center items vertically
    backgroundColor: 'white',
    width: windowWidth * 0.9,
    height: 100,
    marginTop: -10,
    borderRadius: 8,
    padding: 10, // Add padding for better visual spacing
  },
  
  iconImage: {
    width: 35,
    height: 35,
  },
  
  reservetext: {
    fontSize: 16,
    // Add any other styles you want for the text
  }
});

export default MainScreen;











