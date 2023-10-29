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
  FontAwesome,
  MaterialIcons,
  Ionicons,
  Entypo,
  AntDesign,
  Feather,
  Fontisto,
  Octicons,
  Zocial,
  MaterialCommunityIcons,
} from '@expo/vector-icons';
import { useNavigation, useRoute } from '@react-navigation/native';
import * as Font from 'expo-font';
import * as Location from 'expo-location';
import axios from 'axios';

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

  // SkiReosrtList.js에서 param값 받기
  const selectedResort = route.params?.selectedResort;
  const location = selectedResort?.location;
  const selectedResortName = route.params?.selectedResortName;
 
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
  }, [location]);

  return (
    <View style={styles.background}>
      <View style={styles.header}>
        <Text style={fontLoaded ? styles.title : {}}>Snowe</Text>
        <TouchableOpacity style={styles.userIcon} onPress={handleUserIconPress}>
          <MaterialIcons name="menu" size={30} color="black" />
        </TouchableOpacity>
      </View>
      <ScrollView contentContainerStyle={styles.body} showsVerticalScrollIndicator={false}>
        {!isLoading && weatherData && weatherData.main && (
          <View style={styles.weatherContainer}>
            <Text style={styles.weatherCity}>{selectedResortName}</Text>
            <MaterialCommunityIcons
              style={styles.weatherIcon}
              name={getWeatherIconName(weatherData.weather[0].main)}
              size={150}
              color="black"
            />
            <Text style={styles.weatherexp}>
              {getKoreanWeatherCondition(weatherData.weather[0].main)}
            </Text>
            <Text style={styles.weatherTemp}>{(weatherData.main.temp - 273.15).toFixed(0)}°C</Text>
          </View>
        )}
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
    fontSize: 25,
  },
  weatherexp: {
    fontSize: 30,
    marginBottom: 20,
    fontWeight: '600',
  },
});

export default MainScreen;











