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
  const [reservationData, setreservationData] = useState();
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [items, setItems] = useState({});
  const [agendaItems, setAgendaItems] = useState({});
  const [hotBoardList, setHotBoardList] = useState([]);
 


  // SkiReosrtList.js에서 param값 받기
  const selectedResort = route.params?.selectedResort;

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
  
  const timeToString = (time) => {
    const date = new Date(time);
    return date.toISOString().split('T')[0];
  };
  

  useEffect(() => {
    async function fetchData() {
      setIsLoading(true); // 로딩 시작
      const token = await getTokenFromLocal();
      const authorizationHeader = `Bearer ${token}`;
      try {
        const response = await axios.get(`http://192.168.25.202:8080/reservation/listOnDate?lessonDate=${date}`, {
          headers: {
            'Authorization': authorizationHeader,
          },
        });
        if (response.status === 200) {
          const data = response.data;
          console.log('Fetched Data:', data);
  
          // 아젠다 아이템 설정
          const agendaItem = {};
          agendaItem[date] = data;
          setAgendaItems(agendaItem);
  
          // items에 agendaItems를 설정
          setItems(agendaItem);
          console.log('items: ', items)
        } else {
          setreservationData(null);
          console.error('데이터 가져오기 중 오류 발생:', response.status);
        }
      } catch (error) {
        setreservationData(null);
        console.error('데이터 가져오기 중 오류 발생:', error);
      } finally {
        setIsLoading(false); // 로딩 종료
      }
    }
    fetchData();
  }, [date]);

  
  const renderItemForFlatList = ({ item }) => (
    <Card>
      <Card.Content>
        <View
          style={{
            flexDirection: 'row',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}>
          {item.lessonDate ? ( // lessonDate가 있는 경우 텍스트 표시
            <>
              <Text>{item.lessonDate}</Text>
              <Text>{item.name}</Text>
              <Text>{item.lessonTitle}</Text>
            </>
          ) : (
            // lessonDate가 없는 경우 안내 메시지 표시
            <Text>예약 내역이 없습니다.</Text>
          )}
        </View>
      </Card.Content>
    </Card>
  );

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
        <View style={{ flex: 1, marginTop: 10, width: windowWidth * 0.9 }}>
        <ScrollView>
          <Agenda
            items={agendaItems}
            selected={date}
            renderItem={renderItemForFlatList}
            style={{ borderRadius: 10, height: 290 }}
            onDayPress={(day) => {
              setDate(day.dateString);
            }}
          />
        </ScrollView>
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
                        <View style={styles.divider}></View>
                      </View>
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
    width: windowWidth * 0.9,
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
  divider: {
    borderBottomWidth: 1,
    borderBottomColor: 'black',
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