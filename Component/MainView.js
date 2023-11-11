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
  
    const [items, setItems] = useState({});
  

    const hardcodedData = [
      // {
      //   date: '2023-11-11',
      //   events: [
      //     { name: 'Meeting with Team A'},
      //   ],
      // },
      {
        date: '2023-11-11',
        events: [
          { name: 'Meeting with Team B'},
        ],
      },
  
    ];
  
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

        <View style={{ flex: 1, marginTop: 20 ,width:windowWidth*0.9}}>
          <Agenda
            items={items}
            loadItemsForMonth={loadItems}
            selected={timeToString(new Date().getTime())}
            renderItem={renderItem}
            style={{ borderRadius: 5,height: 250,}} 
          />
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
    paddingVertical: 10,
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
    marginTop: 20,
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

  }


});

export default MainScreen;











