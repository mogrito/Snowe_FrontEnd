import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Dimensions,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { Calendar } from 'react-native-calendars';
import {
  FontAwesome
  , MaterialIcons
  , Ionicons
  , Entypo
  , AntDesign
  , Feather
  , Fontisto
  , Octicons
  , Zocial
  , MaterialCommunityIcons } from '@expo/vector-icons';
import { useNavigation } from '@react-navigation/native';
import * as Font from 'expo-font';
import * as Location from 'expo-location';
import axios from 'axios';




const windowWidth = Dimensions.get('window').width;

//날씨 이름 한글로 바꿔요
const weatherConditionTranslations = {
  Clear: '맑음',
  Clouds: '흐림',
  Rain: '비',
  Snow: '눈',
  Haze: '안개',
  Mist: '짙은 안개'
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
  const [fontLoaded, setFontLoaded] = useState(false);
  const [weatherData, setWeatherData] = useState(null);
  const [isLoading, setIsLoading] = useState(true);

  // 메뉴 아이콘을 누를 때 실행될 함수
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

//도시명 불러오는 로직 
const openCageApiKey = 'f20a98f45d3d44a3912d0a6eeb337492';

async function fetchCityName(lat, lon) {
  try {
    const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?key=${openCageApiKey}&q=${lat}+${lon}&language=ko`);

    if (response.data.results.length > 0) {
      const cityName = response.data.results[0].components.city || '알 수 없음';
      return cityName;
    } else {
      return '알 수 없음';
    }
  } catch (error) {
    console.error(error);
    return '알 수 없음';
  }
}

  // 날씨 불러오는 로직 

  useEffect(() => {
    async function fetchWeather() {
      try {
        const apiKey = '28664d08fe65159df42d4ee6b227bacd';
  
        // 1. 위치 권한 요청
        const { status } = await Location.requestForegroundPermissionsAsync();
  
        if (status !== 'granted') {
          console.error('위치 권한이 거부되었습니다.');
          return;
        }
  
        // 2. 현재 위치 정보 가져오기
        const location = await Location.getCurrentPositionAsync();
  
        const lon = location.coords.longitude.toString();
        const lat = location.coords.latitude.toString();
  
        const cityName = await fetchCityName(lat, lon);
  
        // 3. 날씨 정보를 가져오는 API 호출에 현재 위치 좌표를 사용합니다.
        const response = await fetch(
          `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&appid=${apiKey}`
        );
  
        if (!response.ok) {
          throw Error('날씨 데이터를 가져올 수 없습니다');
        }
  
        const data = await response.json();
        data.cityName = cityName; 
        setWeatherData(data); 
        setIsLoading(false); 
        console.log(data); 
      } catch (error) {
        console.error(error);
        setIsLoading(false); 
      }
    }
  
    fetchWeather();
  }, []);

  return (
    <View style={styles.background}>
    {/* 헤더 */}
    <View style={styles.header}>
      <Text style={fontLoaded ? styles.title : {}}>Snowe</Text>
      <TouchableOpacity style={styles.userIcon} onPress={handleUserIconPress}>
        <MaterialIcons name="menu" size={30} color="black" />
      </TouchableOpacity>
    </View>

    {/* 콘텐츠 */}
    <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
      {/* 로딩 중인 경우 */}
      {isLoading && <Text>Loading...</Text>}

      {/* 날씨 컴포넌트 */}
      {!isLoading && weatherData && weatherData.main && (
        <View style={styles.weatherContainer}>
          <Text style={styles.weatherCity}>{weatherData.cityName}</Text>
          <MaterialCommunityIcons
            style={styles.weatherIcon}
            name={getWeatherIconName(weatherData.weather[0].main)}
            size={150}
            color="black"
          />
          <Text style={styles.weatherexp}>
            {getKoreanWeatherCondition(weatherData.weather[0].main)}
          </Text>
          <Text style={styles.weatherTemp}>
            {(weatherData.main.temp - 273.15).toFixed(0)}°C
          </Text>
        </View>
      )}
        {/* 달력 컴포넌트 */}    
        <Calendar style={styles.calendar} />
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
    backgroundColor: '#EFF5FB',
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
    backgroundColor: '#EFF5FB',
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
    fontSize: 30,
    fontWeight: '600'

  },
  weatherTemp: {
    fontSize: 20,
   

  },
  weatherexp: {
    fontSize: 30,
    marginBottom:20,
    fontWeight: '600'

  },


});

export default MainScreen;















